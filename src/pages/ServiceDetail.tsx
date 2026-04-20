import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/data/siteData";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  const { data: relatedAssets = [] } = useQuery({
    queryKey: ["related-assets-service"],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*").eq("is_bundle", false).limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!service) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-primary font-sans">← Back to services</Link>
      </main>
    );
  }

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-3xl">
          <Link to="/services" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All services
          </Link>
          <h1 className="heading-1 text-foreground">{service.title}</h1>
          <p className="mt-6 body-lg text-muted-foreground">{service.shortDescription}</p>
        </div>
      </section>

      {/* Who needs this */}
      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-3 text-foreground mb-4">Who needs this</h2>
          <p className="body-base text-muted-foreground">{service.whoNeeds}</p>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-3 text-foreground mb-4">What's included</h2>
          <p className="body-base text-muted-foreground">{service.whatsIncluded}</p>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-padding pb-16">
        <div className="container-wide max-w-4xl">
          <h2 className="heading-3 text-foreground mb-8">Choose your approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {service.tiers.map((tier) => (
              <div key={tier.name} className="bg-card border border-border rounded-xl p-8">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{tier.name}</h3>
                <p className="body-base text-foreground mb-4">{tier.description}</p>
                <p className="font-sans text-xl font-semibold text-foreground mb-6">{tier.price}</p>
                <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans">
                  <Link to="/book">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related assets */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-8">Related assets from the library</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {relatedAssets.map((asset) => (
              <Link
                key={asset.slug}
                to={`/assets/${asset.slug}`}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">{asset.title}</h3>
                <span className="font-sans font-semibold text-foreground">${asset.price}</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
              <Link to={`/assets?category=${encodeURIComponent(service.title)}`}>
                See all {service.title} assets <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-spacing text-center">
        <div className="container-narrow">
          <h2 className="heading-3 text-foreground mb-4">Not sure what you need?</h2>
          <p className="body-base text-muted-foreground mb-8">Start with a free call. We'll figure it out together.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Discovery Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
