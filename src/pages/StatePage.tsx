import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const StatePage = () => {
  const { slug } = useParams();

  const { data: state, isLoading } = useQuery({
    queryKey: ["state", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: stateAssets = [] } = useQuery({
    queryKey: ["state-assets", state?.name],
    enabled: !!state,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_bundle", false)
        .or(`state.eq.${state!.name},state.eq.All States`);
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

  if (!state || !state.active) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">State not found</h1>
        <Link to="/states" className="mt-4 inline-block text-primary font-sans">← Back to states</Link>
      </main>
    );
  }

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-3xl">
          <Link to="/states" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All states
          </Link>
          <h1 className="heading-1 text-foreground">{state.name} Psychedelic Business Compliance</h1>
          <p className="mt-4 body-sm text-muted-foreground">Substances covered: {state.substances.join(", ")}</p>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl space-y-6">
          <h2 className="heading-3 text-foreground">Regulatory overview</h2>
          <p className="body-base text-muted-foreground">{state.overview}</p>
          <h2 className="heading-3 text-foreground mt-10">Licensing and requirements</h2>
          <p className="body-base text-muted-foreground">{state.licensing_info}</p>
        </div>
      </section>

      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-8">Available resources for {state.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateAssets.map((asset) => (
              <Link
                key={asset.slug}
                to={`/assets/${asset.slug}`}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                  <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.substance}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">{asset.title}</h3>
                <span className="font-sans font-semibold text-foreground">${asset.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-spacing text-center">
        <div className="container-narrow">
          <h2 className="heading-3 text-foreground mb-4">Need {state.name}-specific guidance?</h2>
          <p className="body-base text-muted-foreground mb-8">We know the rules. Let's talk about your situation.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Discovery Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default StatePage;
