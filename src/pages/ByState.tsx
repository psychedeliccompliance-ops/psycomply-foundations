import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ByState = () => {
  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*");
      if (error) throw error;
      return data;
    },
  });

  const activeStates = states.filter((s) => s.active);
  const comingSoonStates = states.filter((s) => !s.active);

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">State-specific compliance, covered</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Psychedelic regulations vary significantly by state. Our resources are built for the rules where you actually operate.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-8">Active states</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {activeStates.map((state) => (
              <Link
                key={state.slug}
                to={`/states/${state.slug}`}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <h3 className="heading-3 text-foreground mb-2">{state.name}</h3>
                <p className="body-sm text-muted-foreground mb-4">Substances: {state.substances.join(", ")}</p>
                <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                  View {state.name} resources <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>

          <h2 className="heading-3 text-foreground mb-8">Coming soon</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {comingSoonStates.map((state) => (
              <Link
                key={state.slug}
                to={`/states/${state.slug}`}
                className="bg-muted/50 border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all group"
              >
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">{state.name}</h3>
                <p className="body-sm text-muted-foreground mb-3">Resources in development</p>
                <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                  View details <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ByState;
