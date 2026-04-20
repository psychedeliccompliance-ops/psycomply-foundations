import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const AssetDetail = () => {
  const { slug } = useParams();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: previewData, isLoading: previewLoading } = useQuery({
    queryKey: ["asset-preview", slug],
    enabled: !!asset,
    staleTime: 1000 * 60 * 60,
    retry: false,
    queryFn: async () => {
      // Use cached pages if already on the asset row
      const cached = (asset as any)?.preview_pages as string[] | null | undefined;
      if (cached && cached.length > 0) return { preview_pages: cached, available: true };
      const { data, error } = await supabase.functions.invoke("asset-preview", {
        body: { slug },
      });
      if (error) throw error;
      return data as { preview_pages: string[]; available?: boolean; message?: string };
    },
  });

  const { data: relatedAssets = [] } = useQuery({
    queryKey: ["related-assets", slug, asset?.category, asset?.substance],
    enabled: !!asset,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .neq("slug", slug!)
        .eq("is_bundle", false)
        .or(`category.eq.${asset!.category},substance.eq.${asset!.substance}`)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const handleBuyNow = async () => {
    if (!asset) return;
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { slug: asset.slug },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="section-padding section-spacing">
        <div className="container-wide max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (!asset) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">Asset not found</h1>
        <Link to="/assets" className="mt-4 inline-block text-primary font-sans">← Back to asset library</Link>
      </main>
    );
  }

  const toc = (asset as any).toc as string[] | null;
  const descriptionPreview = asset.description?.slice(0, 300) || "";

  return (
    <main className="pb-28 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-4xl">
          <Link to="/assets" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> Asset Library
          </Link>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Title */}
              <h1 className="heading-1 text-primary mb-3">{asset.title}</h1>
              <p className="font-serif text-lg italic text-accent mb-6">
                {asset.state} • {asset.substance}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                {asset.is_bundle && <span className="text-xs font-sans font-medium bg-gold/20 text-accent-foreground px-2 py-1 rounded">Bundle</span>}
              </div>

              {/* Description */}
              <div className="space-y-6 mb-10">
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">What this is</h2>
                  <p className="body-base text-muted-foreground">{asset.description}</p>
                </div>
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">Why you need it</h2>
                  <p className="body-base text-muted-foreground">{asset.why_you_need}</p>
                </div>
                {asset.is_bundle && asset.bundle_contents && (
                  <div>
                    <h2 className="font-sans font-semibold text-foreground mb-2">What's included</h2>
                    <p className="body-base text-muted-foreground">{asset.bundle_contents}</p>
                  </div>
                )}
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">Format</h2>
                  <p className="body-sm text-muted-foreground">{asset.format}</p>
                </div>
              </div>

              {/* Table of Contents */}
              {toc && toc.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-8 mb-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-5">What's Inside</h2>
                  <ol className="space-y-3">
                    {toc.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="font-sans font-bold text-accent text-sm mt-0.5 min-w-[1.5rem]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="body-base text-foreground">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Document preview */}
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl border border-border">
                {/* Scrollable document page */}
                <div
                  className="relative h-[640px] overflow-y-auto bg-[hsl(var(--cream))]"
                  style={{ scrollbarGutter: "stable" }}
                >
                  <div className="mx-auto max-w-[720px] py-8 px-4 flex flex-col items-center gap-6">
                    {previewLoading && (
                      <div className="w-full space-y-4">
                        <Skeleton className="w-full aspect-[8.5/11]" />
                        <Skeleton className="w-full aspect-[8.5/11]" />
                      </div>
                    )}
                    {!previewLoading && previewData?.preview_pages?.length ? (
                      <>
                        {previewData.preview_pages.map((url, i) => {
                          const locked = i >= 2;
                          return (
                            <div
                              key={url}
                              className="relative w-full max-w-[680px] shadow-lg border border-border bg-white overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`${asset.title} preview page ${i + 1}`}
                                loading="lazy"
                                className={`w-full ${locked ? "select-none pointer-events-none" : ""}`}
                                style={locked ? { filter: "blur(7px)" } : undefined}
                              />
                            </div>
                          );
                        })}
                      </>
                    ) : !previewLoading ? (
                      <div className="text-center py-20 px-6">
                        <p className="font-sans text-sm text-muted-foreground">
                          {previewData?.message || "Preview not available for this document."}
                        </p>
                      </div>
                    ) : null}
                    <div className="h-48" />
                  </div>
                </div>

                {/* Diagonal watermark banner */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-10 flex items-center justify-center">
                  <div className="rotate-[-20deg] text-center font-sans font-light tracking-[0.4em] text-foreground/15 text-4xl md:text-6xl leading-tight">
                    <div>DOCUMENT</div>
                    <div>PREVIEW</div>
                  </div>
                </div>

                {/* Fade-out gradient overlay (sticky at bottom of viewport) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-[hsl(var(--cream))]/85 to-[hsl(var(--cream))]" />

                {/* Unlock CTA overlay */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-8 px-6">
                  <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-6 py-5 text-center max-w-sm w-full">
                    <p className="font-sans font-semibold text-foreground mb-3">
                      Purchase to unlock the full document
                    </p>
                    <Button
                      onClick={handleBuyNow}
                      disabled={isCheckingOut}
                      className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans"
                    >
                      {isCheckingOut ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart size={16} className="mr-2" />
                      )}
                      Buy Now — ${asset.price}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-xl p-8 sticky top-28">
                <div className="text-center mb-6">
                  {asset.is_bundle && asset.bundle_value && (
                    <p className="font-sans text-sm text-muted-foreground line-through mb-1">${asset.bundle_value} value</p>
                  )}
                  <p className="font-sans text-3xl font-bold text-foreground">${asset.price}</p>
                </div>
                <Button
                  className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans mb-3"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Download size={16} className="mr-2" />
                  )}
                  Buy Now — ${asset.price}
                </Button>
                <p className="text-xs font-sans text-muted-foreground text-center">
                  Instant download after purchase. File delivered as .docx. Link expires in 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedAssets.length > 0 && (
        <section className="section-padding section-spacing bg-card">
          <div className="container-wide max-w-4xl">
            <h2 className="heading-3 text-foreground mb-8">Related resources</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedAssets.map((a) => (
                <Link key={a.slug} to={`/assets/${a.slug}`} className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{a.title}</h3>
                  <span className="font-sans font-semibold text-foreground">${a.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default AssetDetail;
