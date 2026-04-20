import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { services } from "@/data/siteData";

const SubstancePage = () => {
  const { slug } = useParams();

  const { data: substance, isLoading } = useQuery({
    queryKey: ["substance", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: substanceAssets = [] } = useQuery({
    queryKey: ["substance-assets", substance?.name],
    enabled: !!substance,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_bundle", false)
        .or(`substance.eq.${substance!.name},substance.eq.All`);
      if (error) throw error;
      return data;
    },
  });

  const { data: allStates = [] } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <main className="section-padding section-spacing">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!substance) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">Substance not found</h1>
        <Link to="/substances" className="mt-4 inline-block text-primary font-sans">← Back to substances</Link>
      </main>
    );
  }

  const linkedStates = allStates.filter(
    (s) => s.substances.includes(substance.name)
  );

  return (
    <main className="pb-28 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-16 md:py-24 bg-forest text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <Link to="/substances" className="font-sans text-sm text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All substances
          </Link>
          <h1 className="heading-1">{substance.name} Compliance Resources</h1>
          <p className="mt-4 body-lg text-primary-foreground/80">
            Legal status, clinical requirements, and compliance tools for {substance.name} practices.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans mt-8 px-10">
            <Link to="/book">Book a Free Call</Link>
          </Button>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-3">Our Services for {substance.name} Practices</h2>
          <p className="body-base text-muted-foreground mb-8">Six areas of compliance, tailored for {substance.name}.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all group"
              >
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">{service.title}</h3>
                <p className="body-sm text-muted-foreground mb-4 line-clamp-3">{service.shortDescription}</p>
                <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legal & Description */}
      <section className="section-padding section-spacing">
        <div className="container-wide max-w-3xl space-y-8">
          <div>
            <h2 className="heading-3 text-foreground mb-4">Legal status</h2>
            <p className="body-base text-muted-foreground">{substance.legal_status}</p>
          </div>
          <div>
            <h2 className="heading-3 text-foreground mb-4">About {substance.name}</h2>
            <p className="body-base text-muted-foreground">{substance.description}</p>
          </div>
          {substance.clinical_requirements && (
            <div>
              <h2 className="heading-3 text-foreground mb-4">Clinical requirements</h2>
              <p className="body-base text-muted-foreground">{substance.clinical_requirements}</p>
            </div>
          )}
        </div>
      </section>

      {/* States */}
      {linkedStates.length > 0 && (
        <section className="section-padding section-spacing bg-card">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-3">States where we cover {substance.name}</h2>
            <p className="body-base text-muted-foreground mb-8">Explore state-specific compliance resources.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedStates.map((st) => (
                <Link
                  key={st.slug}
                  to={`/states/${st.slug}`}
                  className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{st.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {st.substances.map((sub) => (
                      <span key={sub} className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{sub}</span>
                    ))}
                  </div>
                  <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                    View {st.name} resources <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Assets */}
      {substanceAssets.length > 0 && (
        <section className="section-padding section-spacing">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">Resources for {substance.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {substanceAssets.map((asset) => (
                <Link
                  key={asset.slug}
                  to={`/assets/${asset.slug}`}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
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

      {/* Bottom CTA */}
      <section className="section-padding section-spacing bg-forest text-primary-foreground text-center">
        <div className="container-narrow">
          <h2 className="heading-3 mb-4">Need {substance.name} compliance support?</h2>
          <p className="body-base text-primary-foreground/80 mb-8">Let's talk about your specific situation and requirements.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default SubstancePage;
