import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { substances, assets } from "@/data/siteData";
import { ArrowLeft } from "lucide-react";

const SubstancePage = () => {
  const { slug } = useParams();
  const substance = substances.find((s) => s.slug === slug);

  if (!substance) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">Substance not found</h1>
        <Link to="/substances" className="mt-4 inline-block text-primary font-sans">← Back to substances</Link>
      </main>
    );
  }

  const substanceAssets = assets.filter((a) => a.substance === substance.name || a.substance === "All").filter((a) => !a.isBundle);

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-3xl">
          <Link to="/substances" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All substances
          </Link>
          <h1 className="heading-1 text-foreground">{substance.name} Compliance Resources</h1>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl space-y-8">
          <div>
            <h2 className="heading-3 text-foreground mb-4">Legal status</h2>
            <p className="body-base text-muted-foreground">{substance.legalStatus}</p>
          </div>
          <div>
            <h2 className="heading-3 text-foreground mb-4">About {substance.name}</h2>
            <p className="body-base text-muted-foreground">{substance.description}</p>
          </div>
          <div>
            <h2 className="heading-3 text-foreground mb-4">Clinical and operational requirements</h2>
            <p className="body-base text-muted-foreground">{substance.clinicalRequirements}</p>
          </div>
        </div>
      </section>

      {substanceAssets.length > 0 && (
        <section className="section-padding section-spacing bg-card">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">Available {substance.name} resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {substanceAssets.map((asset) => (
                <Link
                  key={asset.slug}
                  to={`/assets/${asset.slug}`}
                  className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                    <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.state}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{asset.title}</h3>
                  <span className="font-sans font-semibold text-foreground">${asset.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding section-spacing text-center">
        <div className="container-narrow">
          <h2 className="heading-3 text-foreground mb-4">Need help with {substance.name} compliance?</h2>
          <p className="body-base text-muted-foreground mb-8">Let's talk about your specific situation and requirements.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Discovery Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default SubstancePage;
