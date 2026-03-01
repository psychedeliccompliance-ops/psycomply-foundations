import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { assets } from "@/data/siteData";
import { ArrowLeft, Download } from "lucide-react";

const AssetDetail = () => {
  const { slug } = useParams();
  const asset = assets.find((a) => a.slug === slug);

  if (!asset) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">Asset not found</h1>
        <Link to="/assets" className="mt-4 inline-block text-primary font-sans">← Back to asset library</Link>
      </main>
    );
  }

  const relatedAssets = assets.filter((a) => a.slug !== asset.slug && !a.isBundle && (a.category === asset.category || a.substance === asset.substance)).slice(0, 3);

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-4xl">
          <Link to="/assets" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> Asset Library
          </Link>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.state}</span>
                <span className="text-xs font-sans font-medium bg-muted text-muted-foreground px-2 py-1 rounded">{asset.substance}</span>
                {asset.isBundle && <span className="text-xs font-sans font-medium bg-gold/20 text-gold-foreground px-2 py-1 rounded">Bundle</span>}
              </div>
              <h1 className="heading-2 text-foreground mb-6">{asset.title}</h1>
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">What this is</h2>
                  <p className="body-base text-muted-foreground">{asset.description}</p>
                </div>
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">Why you need it</h2>
                  <p className="body-base text-muted-foreground">{asset.whyYouNeed}</p>
                </div>
                {asset.isBundle && asset.bundleContents && (
                  <div>
                    <h2 className="font-sans font-semibold text-foreground mb-2">What's included</h2>
                    <p className="body-base text-muted-foreground">{asset.bundleContents}</p>
                  </div>
                )}
                <div>
                  <h2 className="font-sans font-semibold text-foreground mb-2">Format</h2>
                  <p className="body-sm text-muted-foreground">{asset.format}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-xl p-8 sticky top-28">
                <div className="text-center mb-6">
                  {asset.isBundle && asset.bundleValue && (
                    <p className="font-sans text-sm text-muted-foreground line-through mb-1">${asset.bundleValue} value</p>
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
