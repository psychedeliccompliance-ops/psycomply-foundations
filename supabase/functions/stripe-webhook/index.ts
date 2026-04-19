import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Convert "ketamine-licensing-guide-new-jersey-ketamine"
// -> "Ketamine_Licensing_Guide_-_New_Jersey_-_Ketamine.docx"
// We treat known multi-word state names as single segments so the dashes
// only appear between major sections (topic - state - substance).
function slugToFilename(slug: string): string {
  // Heuristic: split on "-", title-case each token, join with "_".
  // Then collapse the structural separators back to " - " positions.
  // Since we don't know structure reliably, we use a simple rule:
  // every hyphen in slug becomes "_" in filename, words are TitleCased.
  // Per the example, dashes also remain between sections wrapped by underscores.
  // Example mapping:
  //   ketamine-licensing-guide-new-jersey-ketamine
  //   -> Ketamine_Licensing_Guide_-_New_Jersey_-_Ketamine.docx
  //
  // We can't infer section boundaries from the slug alone, so we accept the
  // optional metadata override `filename` if Stripe metadata provides it.
  const titled = slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join("_");
  return `${titled}.docx`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] signature verification failed:", msg);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${msg}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge other events without processing.
    return new Response(JSON.stringify({ received: true, ignored: event.type }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const slug = session.metadata?.slug;
    if (!slug) {
      console.error("[stripe-webhook] missing metadata.slug on session", session.id);
      return new Response(JSON.stringify({ error: "Missing slug in session metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Look up asset
    const { data: asset, error: assetErr } = await supabase
      .from("assets")
      .select("title, slug, filename")
      .eq("slug", slug)
      .maybeSingle();

    if (assetErr) throw new Error(`Asset lookup failed: ${assetErr.message}`);
    if (!asset) throw new Error(`Asset not found for slug: ${slug}`);

    // Filename: prefer asset.filename, then metadata override, else derive from slug.
    const filename =
      asset.filename || session.metadata?.filename || slugToFilename(slug);

    // Generate signed URL (24h)
    const expiresInSec = 60 * 60 * 24;
    const { data: signed, error: signErr } = await supabase.storage
      .from("documents")
      .createSignedUrl(filename, expiresInSec);

    if (signErr || !signed?.signedUrl) {
      throw new Error(`Failed to create signed URL for ${filename}: ${signErr?.message ?? "unknown"}`);
    }

    const downloadUrl = signed.signedUrl;
    const downloadExpiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();
    const customerEmail =
      session.customer_details?.email || session.customer_email || null;
    const amountPaid = typeof session.amount_total === "number" ? session.amount_total / 100 : null;

    // Upsert order keyed on session_id (unique)
    const { error: insertErr } = await supabase
      .from("orders")
      .upsert(
        {
          session_id: session.id,
          asset_slug: slug,
          asset_name: asset.title,
          customer_email: customerEmail,
          amount_paid: amountPaid,
          download_url: downloadUrl,
          download_expires_at: downloadExpiresAt,
          status: "paid",
        },
        { onConflict: "session_id" }
      );

    if (insertErr) throw new Error(`Order insert failed: ${insertErr.message}`);

    console.log("[stripe-webhook] order recorded for session", session.id, "slug", slug);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] handler error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
