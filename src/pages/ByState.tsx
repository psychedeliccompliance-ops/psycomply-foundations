import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const ByState = () => {
  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const activeStates = states.filter((s) => s.active);
  const comingSoonStates = states.filter((s) => !s.active);

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">Find compliance resources for your state</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Select your state to see what's available or get notified when we launch in your area.
          </p>
        </div>
      </section>

      {/* Active states */}
      {activeStates.length > 0 && (
        <section className="section-padding pb-16">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">States with live resources</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {activeStates.map((state) => (
                <Link
                  key={state.slug}
                  to={`/states/${state.slug}`}
                  className="bg-card border border-border rounded-xl p-8 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <h3 className="heading-3 text-foreground mb-3">{state.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {state.substances.map((sub) => (
                      <span key={sub} className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <p className="body-sm text-muted-foreground mb-4 line-clamp-2">{state.overview}</p>
                  <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                    View Resources <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming soon states */}
      {comingSoonStates.length > 0 && (
        <section className="section-padding pb-24">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">Coming soon</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonStates.map((state) => (
                <ComingSoonCard key={state.slug} state={state} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

interface ComingSoonCardProps {
  state: {
    slug: string;
    name: string;
    overview: string;
  };
}

const ComingSoonCard = ({ state }: ComingSoonCardProps) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const teaser = state.overview
    ? state.overview.split(".")[0] + "."
    : "Resources in development.";

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email, state_slug: state.slug });
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } else {
      toast({ title: "You're on the list!", description: `We'll notify you when ${state.name} resources are ready.` });
      setEmail("");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
      <h3 className="font-serif text-lg font-medium text-foreground mb-2">{state.name}</h3>
      <p className="body-sm text-muted-foreground mb-4 line-clamp-2">{teaser}</p>
      <form onSubmit={handleNotify} className="flex gap-2 mb-3">
        <Input
          placeholder="your@email.com"
          type="email"
          className="font-sans text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          disabled={submitting || !email}
          size="sm"
          className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans shrink-0 text-xs"
        >
          {submitting ? "…" : "Notify Me"}
        </Button>
      </form>
      <Link
        to={`/states/${state.slug}`}
        className="font-sans text-sm font-medium text-primary hover:text-forest-light flex items-center gap-1 mt-auto"
      >
        See full details <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default ByState;
