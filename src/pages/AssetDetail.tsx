import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const AssetDetail = () => {
  const { slug } = useParams();

  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
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

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-4xl">
          <Link to="/assets" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> Asset Library
          </Link>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.state}</span>
                <span className="text-xs font-sans font-medium bg-muted text-muted-foreground px-2 py-1 rounded">{asset.substance}</span>
                {asset.is_bundle && <span className="text-xs font-sans font-medium bg-gold/20 text-gold-foreground px-2 py-1 rounded">Bundle</span>}
              </div>
              <h1 className="heading-2 text-foreground mb-6">{asset.title}</h1>
              <div className="space-y-6">
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
            </div>

            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-xl p-8 sticky top-28">
                <div className="text-center mb-6">
                  {asset.is_bundle && asset.bundle_value && (
                    <p className="font-sans text-sm text-muted-foreground line-through mb-1">${asset.bundle_value} value</p>
                  )}
                  <p className="font-sans text-3xl font-bold text-foreground">${asset.price}</p>
                </div>
                <Button className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans mb-3" size="lg">
                  <Download size={16} className="mr-2" />
                  Buy Now
                </Button>
                <p className="text-xs font-sans text-muted-foreground text-center">Instant download after purchase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
