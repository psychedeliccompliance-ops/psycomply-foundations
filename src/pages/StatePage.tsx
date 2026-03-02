import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { services } from "@/data/siteData";
import { toast } from "@/hooks/use-toast";

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

  if (isLoading) {
    return (
      <main className="section-padding section-spacing">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!state) {
    return (
      <main className="section-padding section-spacing text-center">
        <h1 className="heading-2 text-foreground">State not found</h1>
        <Link to="/states" className="mt-4 inline-block text-primary font-sans">← Back to states</Link>
      </main>
    );
  }

  if (state.active) {
    return <ActiveStatePage state={state} />;
  }

  return <ComingSoonStatePage state={state} slug={slug!} />;
};

/* ============ ACTIVE STATE ============ */
interface StateData {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  substances: string[];
  overview: string;
  licensing_info: string;
}

const ActiveStatePage = ({ state }: { state: StateData }) => {
  const { data: allSubstances = [] } = useQuery({
    queryKey: ["substances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: stateAssets = [] } = useQuery({
    queryKey: ["state-assets", state.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_bundle", false)
        .or(`state.eq.${state.name},state.eq.All States`);
      if (error) throw error;
      return data;
    },
  });

  const linkedSubstances = allSubstances.filter((s) =>
    state.substances.includes(s.name)
  );

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-16 md:py-24 bg-forest text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <Link to="/states" className="font-sans text-sm text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All states
          </Link>
          <h1 className="heading-1">{state.name} Psychedelic &amp; Ketamine Compliance</h1>
          <p className="mt-4 body-lg text-primary-foreground/80">
            Everything you need to launch and operate a compliant psychedelic practice in {state.name}.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans mt-8 px-10">
            <Link to="/book">Book a Free Call</Link>
          </Button>
        </div>
      </section>

      {/* Substances */}
      {linkedSubstances.length > 0 && (
        <section className="section-padding section-spacing">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-3 text-center">Substances We Cover in {state.name}</h2>
            <p className="body-base text-muted-foreground mb-8 text-center">Select a substance for detailed compliance resources.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedSubstances.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/substances/${sub.slug}`}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{sub.name}</h3>
                  <p className="body-sm text-muted-foreground mb-4 line-clamp-2">{sub.legal_status?.split(".")[0]}.</p>
                  <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                    View {sub.name} resources <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-3">Our Services in {state.name}</h2>
          <p className="body-base text-muted-foreground mb-8">Six areas of compliance, tailored for {state.name}'s regulatory landscape.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
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

      {/* Assets */}
      {stateAssets.length > 0 && (
        <section className="section-padding section-spacing">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">Resources for {state.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateAssets.map((asset) => (
                <Link
                  key={asset.slug}
                  to={`/assets/${asset.slug}`}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
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
      )}

      {/* Overview */}
      {state.overview && (
        <section className="section-padding section-spacing bg-card">
          <div className="container-wide max-w-3xl">
            <h2 className="heading-3 text-foreground mb-4">Regulatory overview</h2>
            <p className="body-base text-muted-foreground">{state.overview}</p>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="section-padding section-spacing bg-forest text-primary-foreground text-center">
        <div className="container-narrow">
          <h2 className="heading-3 mb-4">Ready to get compliant in {state.name}?</h2>
          <p className="body-base text-primary-foreground/80 mb-8">We know the rules. Let's talk about your situation.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

/* ============ COMING SOON STATE ============ */
const ComingSoonStatePage = ({ state, slug }: { state: StateData; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: allSubstances = [] } = useQuery({
    queryKey: ["substances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("*");
      if (error) throw error;
      return data;
    },
  });

  const linkedSubstances = allSubstances.filter((s) =>
    state.substances.includes(s.name)
  );

  const handleNotify = async () => {
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email, state_slug: slug });
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } else {
      toast({ title: "You're on the list!", description: `We'll notify you when ${state.name} resources are ready.` });
      setEmail("");
    }
  };

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-3xl">
          <Link to="/states" className="font-sans text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft size={14} /> All states
          </Link>
          <h1 className="heading-1 text-foreground">{state.name} Psychedelic &amp; Ketamine Compliance</h1>
          <p className="mt-2 body-lg text-gold font-sans font-medium">Coming Soon</p>
          {state.substances.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {state.substances.map((sub) => (
                <span key={sub} className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Substances */}
      {linkedSubstances.length > 0 && (
        <section className="section-padding section-spacing">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-3 text-center">Substances We Cover in {state.name}</h2>
            <p className="body-base text-muted-foreground mb-8 text-center">Select a substance for detailed compliance resources.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedSubstances.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/substances/${sub.slug}`}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{sub.name}</h3>
                  <p className="body-sm text-muted-foreground mb-4 line-clamp-2">{sub.legal_status?.split(".")[0]}.</p>
                  <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                    View {sub.name} resources <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-3 text-foreground mb-3">Our Services in {state.name}</h2>
          <p className="body-base text-muted-foreground mb-8">Six areas of compliance, tailored for {state.name}'s regulatory landscape.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
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

      {state.overview && (
        <section className="section-padding pb-16">
          <div className="container-wide max-w-3xl space-y-6">
            <h2 className="heading-3 text-foreground">What's happening in {state.name}</h2>
            <p className="body-base text-muted-foreground">{state.overview}</p>
          </div>
        </section>
      )}

      {state.licensing_info && (
        <section className="section-padding pb-16">
          <div className="container-wide max-w-3xl space-y-6">
            <h2 className="heading-3 text-foreground">Regulatory outlook</h2>
            <p className="body-base text-muted-foreground">{state.licensing_info}</p>
          </div>
        </section>
      )}

      {/* Email capture */}
      <section className="section-padding pb-16 bg-card">
        <div className="container-wide max-w-xl text-center py-12">
          <h2 className="heading-3 text-foreground mb-4">Get notified</h2>
          <p className="body-base text-muted-foreground mb-6">
            We're building {state.name}-specific compliance resources. Enter your email and we'll let you know when they're ready.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              placeholder="your@email.com"
              className="font-sans"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleNotify}
              disabled={submitting || !email}
              className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans shrink-0"
            >
              {submitting ? "Saving…" : "Notify me"}
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding section-spacing text-center">
        <div className="container-narrow">
          <h2 className="heading-3 text-foreground mb-4">Already operating in {state.name}?</h2>
          <p className="body-base text-muted-foreground mb-8">Even before state-specific resources are ready, we can help you plan ahead.</p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
            <Link to="/book">Book a Free Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default StatePage;
