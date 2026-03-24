import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download as DownloadIcon, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("session_id", sessionId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    retry: 5,
    retryDelay: 2000,
  });

  // Also fetch the asset title
  const { data: asset } = useQuery({
    queryKey: ["download-asset", order?.asset_slug],
    enabled: !!order?.asset_slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("title, drive_link")
        .eq("slug", order!.asset_slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!sessionId) {
    return (
      <main className="section-padding py-24 text-center">
        <AlertCircle className="mx-auto text-destructive mb-4" size={48} />
        <h1 className="heading-2 text-foreground mb-4">Invalid Link</h1>
        <p className="body-base text-muted-foreground mb-6">This download link is missing a session ID.</p>
        <Link to="/assets">
          <Button variant="outline" className="font-sans">Browse Asset Library</Button>
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="section-padding py-24 text-center">
        <Loader2 className="mx-auto text-primary mb-6 animate-spin" size={48} />
        <h1 className="heading-2 text-foreground mb-4">Preparing your download…</h1>
        <p className="body-base text-muted-foreground">
          We're confirming your payment. This usually takes a few seconds.
        </p>
      </main>
    );
  }

  if (!order || isError) {
    return (
      <main className="section-padding py-24 text-center">
        <AlertCircle className="mx-auto text-accent mb-4" size={48} />
        <h1 className="heading-2 text-foreground mb-4">Order Not Found</h1>
        <p className="body-base text-muted-foreground mb-2">
          We couldn't find an order for this session. If you just completed payment, it may still be processing.
        </p>
        <p className="body-sm text-muted-foreground mb-6">
          Please contact{" "}
          <a href="mailto:support@psychedeliccompliance.com" className="text-primary underline">
            support@psychedeliccompliance.com
          </a>{" "}
          if this persists.
        </p>
        <Link to="/assets">
          <Button variant="outline" className="font-sans">Browse Asset Library</Button>
        </Link>
      </main>
    );
  }

  const downloadUrl = order.download_url || asset?.drive_link;

  return (
    <main className="section-padding py-24">
      <div className="container-wide max-w-xl text-center">
        <div className="bg-card border border-border rounded-xl p-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <DownloadIcon className="text-primary" size={28} />
          </div>
          <h1 className="heading-2 text-foreground mb-2">Your Purchase is Ready</h1>
          <p className="font-serif text-lg text-accent mb-8">
            {asset?.title || order.asset_slug}
          </p>

          {downloadUrl ? (
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans w-full mb-4">
                <DownloadIcon size={18} className="mr-2" />
                Download Now
              </Button>
            </a>
          ) : (
            <p className="body-base text-muted-foreground mb-4">
              Your download link is being prepared. Please check back shortly or contact support.
            </p>
          )}

          <p className="text-xs font-sans text-muted-foreground">
            Instant download. File delivered as .docx. Link expires in 24 hours.
          </p>
        </div>
      </div>
    </main>
  );
};

export default DownloadPage;
