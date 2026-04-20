import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CC_API = "https://api.cloudconvert.com/v2";

async function ccFetch(path: string, apiKey: string, init?: RequestInit) {
  const res = await fetch(`${CC_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`CloudConvert ${path} ${res.status}: ${txt}`);
  }
  return res.json();
}

async function waitForJob(jobId: string, apiKey: string, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const j = await ccFetch(`/jobs/${jobId}`, apiKey);
    const status = j.data.status;
    if (status === "finished") return j.data;
    if (status === "error") throw new Error(`CloudConvert job error: ${JSON.stringify(j.data)}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("CloudConvert job timed out");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return new Response(JSON.stringify({ error: "slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ccKey = Deno.env.get("CLOUDCONVERT_API_KEY");
    if (!ccKey) throw new Error("CLOUDCONVERT_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Look up asset
    const { data: asset, error: assetErr } = await supabase
      .from("assets")
      .select("slug, filename, preview_pages")
      .eq("slug", slug)
      .maybeSingle();
    if (assetErr) throw new Error(`Asset lookup failed: ${assetErr.message}`);
    if (!asset) throw new Error(`Asset not found: ${slug}`);

    // Return cached
    if (asset.preview_pages && asset.preview_pages.length > 0) {
      return new Response(JSON.stringify({ preview_pages: asset.preview_pages, cached: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const filename = asset.filename;
    if (!filename) throw new Error(`Asset ${slug} missing filename`);

    // Sign source URL (1h, enough for CloudConvert to fetch)
    const { data: signed, error: signErr } = await supabase.storage
      .from("documents")
      .createSignedUrl(filename, 60 * 60);
    if (signErr || !signed?.signedUrl) {
      throw new Error(`Could not sign source: ${signErr?.message ?? "no url"}`);
    }

    // Create CloudConvert job: import URL -> convert docx to jpg pages 1-2 -> export url
    const job = await ccFetch("/jobs", ccKey, {
      method: "POST",
      body: JSON.stringify({
        tasks: {
          "import-doc": {
            operation: "import/url",
            url: signed.signedUrl,
            filename: filename,
          },
          "convert-doc": {
            operation: "convert",
            input: "import-doc",
            input_format: "docx",
            output_format: "jpg",
            pages: "1-2",
            pixel_density: 120,
          },
          "export-doc": {
            operation: "export/url",
            input: "convert-doc",
            inline: false,
            archive_multiple_files: false,
          },
        },
      }),
    });

    const finished = await waitForJob(job.data.id, ccKey);
    const exportTask = finished.tasks.find((t: any) => t.name === "export-doc");
    const files: Array<{ url: string; filename: string }> = exportTask?.result?.files ?? [];
    if (files.length === 0) throw new Error("No preview files produced");

    // Download each and upload to previews bucket
    const uploaded: string[] = [];
    for (let i = 0; i < files.length && i < 2; i++) {
      const f = files[i];
      const r = await fetch(f.url);
      if (!r.ok) throw new Error(`Failed to download preview ${i + 1}`);
      const bytes = new Uint8Array(await r.arrayBuffer());
      const path = `${slug}/page-${i + 1}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("previews")
        .upload(path, bytes, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
      const { data: pub } = supabase.storage.from("previews").getPublicUrl(path);
      uploaded.push(pub.publicUrl);
    }

    // Cache on asset row
    const { error: updErr } = await supabase
      .from("assets")
      .update({ preview_pages: uploaded })
      .eq("slug", slug);
    if (updErr) console.error("[asset-preview] cache update failed:", updErr.message);

    return new Response(JSON.stringify({ preview_pages: uploaded, cached: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[asset-preview] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});