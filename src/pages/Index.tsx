import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scale, Heart, Lock, Users, Building2, Megaphone, ArrowRight, CheckCircle, Leaf, MapPin, Star } from "lucide-react";
import { services, testimonials } from "@/data/siteData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  })
};

const serviceIcons: Record<string, React.ReactNode> = {
  Scale: <Scale size={28} />,
  Heart: <Heart size={28} />,
  Lock: <Lock size={28} />,
  Users: <Users size={28} />,
  Building: <Building2 size={28} />,
  Megaphone: <Megaphone size={28} />
};

const Index = () => {
  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*");
      if (error) throw error;
      return data;
    }
  });

  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*");
      if (error) throw error;
      return data;
    }
  });

  const { data: substances = [] } = useQuery({
    queryKey: ["substances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("*");
      if (error) throw error;
      return data;
    }
  });

  const featuredAssets = assets.filter((a) => !a.is_bundle).slice(0, 4);
  const activeStates = states.filter((s) => s.active);
  const comingSoonStates = states.filter((s) => !s.active);

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cream-dark opacity-80" />
        <div className="container-wide relative py-20 md:py-32 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl">

            <motion.h1 variants={fadeUp} custom={0} className="heading-1 text-foreground">You heal.<br />We do paperwork.</motion.h1>
            <motion.p variants={fadeUp} custom={1} className="mt-6 body-lg text-muted-foreground max-w-2xl">PsyComply covers the full operational and legal foundation of your psychedelic practice — from day one.

            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base px-8">
                <Link to="/book">Book a Free Discovery Call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-sans text-base px-8 border-foreground/20 hover:bg-foreground/5">
                <Link to="/assets">Browse the Asset Library</Link>
              </Button>
            </motion.div>
          </motion.div>
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl hidden lg:block" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="section-padding py-6">
          <div className="container-wide flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm font-sans">
            {[
            { icon: <MapPin size={16} />, text: "Oregon & Colorado Regulatory Expertise" },
            { icon: <Leaf size={16} />, text: "Psilocybin, Ketamine & MDMA Protocols" },
            { icon: <Scale size={16} />, text: "Legal, Clinical, HR & Operations" },
            { icon: <CheckCircle size={16} />, text: "Built for Healers and Operators" }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-2 opacity-90">
                {item.icon}
                <span>{item.text}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What is PsyComply */}
      <section className="section-padding section-spacing">
        <div className="container-wide grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="heading-2 text-foreground">What is PsyComply?</h2>
            <div className="mt-6 space-y-4 body-base text-muted-foreground">
              <p>
                PsyComply is a compliance and consulting firm built specifically for the psychedelic medicine industry. We produce the documents, protocols, and systems that psychedelic clinics and practices need to operate legally, safely, and professionally.
              </p>
              <p>
                Whether you're starting from scratch or cleaning up gaps in an existing operation, we have what you need. Every template, every protocol, every system — designed by people who know this regulatory landscape inside and out.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
            { icon: <Scale size={24} />, label: "Legal Compliance" },
            { icon: <Heart size={24} />, label: "Clinical Protocols" },
            { icon: <Lock size={24} />, label: "Substance Management" },
            { icon: <Users size={24} />, label: "Staff & HR" },
            { icon: <Building2 size={24} />, label: "Business Operations" },
            { icon: <Megaphone size={24} />, label: "Marketing Compliance" }].
            map((item, i) =>
            <div key={i} className="bg-card border border-border rounded-lg p-5 flex flex-col items-center text-center gap-3">
                <div className="text-primary">{item.icon}</div>
                <span className="font-sans text-sm font-medium text-foreground">{item.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-2 text-foreground text-center mb-12">Who we serve</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-xl p-8 lg:p-10">

              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart size={24} className="text-primary" />
              </div>
              <h3 className="heading-4 text-foreground mb-4">The Healer</h3>
              <p className="body-base text-muted-foreground mb-6">
                You trained to facilitate. Not to file regulatory paperwork. We handle the compliance side so you can stay in your lane and do the work that actually matters to your clients.
              </p>
              <Link to="/services" className="font-sans text-sm font-medium text-primary hover:text-forest-light flex items-center gap-1">
                See how we help you <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-background border border-border rounded-xl p-8 lg:p-10">

              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                <Building2 size={24} className="text-accent" />
              </div>
              <h3 className="heading-4 text-foreground mb-4">The Operator / Investor</h3>
              <p className="body-base text-muted-foreground mb-6">
                You see the opportunity. We make sure you move fast and don't expose yourself to regulatory or legal risk. Every document, every protocol, every filing requirement — handled before you open your doors.
              </p>
              <Link to="/services" className="font-sans text-sm font-medium text-primary hover:text-forest-light flex items-center gap-1">
                See how we help you <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding section-spacing">
        <div className="container-wide">
          <h2 className="heading-2 text-foreground text-center mb-4">What we cover</h2>
          <p className="body-base text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Six areas of compliance and operational support. Everything your psychedelic business needs to operate legally and professionally.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) =>
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}>

                <Link
                to={`/services/${service.slug}`}
                className="block bg-card border border-border rounded-xl p-7 hover:border-primary/30 hover:shadow-md transition-all h-full group">

                  <div className="text-primary mb-4">
                    {serviceIcons[service.icon]}
                  </div>
                  <h3 className="heading-4 text-foreground mb-3">{service.title}</h3>
                  <p className="body-sm text-muted-foreground mb-4">{service.shortDescription}</p>
                  <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                    Learn more <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding section-spacing bg-primary text-primary-foreground">
        <div className="container-wide">
          <h2 className="heading-2 text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
            {
              step: "01",
              title: "Book a free discovery call",
              description: "We learn your situation, your state, your substance, and your stage. Thirty minutes, no pressure."
            },
            {
              step: "02",
              title: "We build your compliance plan",
              description: "Either we do it for you, with you, or we hand you the exact documents you need. Your choice."
            },
            {
              step: "03",
              title: "You operate with confidence",
              description: "We stay available as your business grows and regulations change. You're never on your own."
            }].
            map((item, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center">

                <span className="font-serif text-5xl font-light text-gold">{item.step}</span>
                <h3 className="font-serif text-xl font-medium mt-4 mb-3">{item.title}</h3>
                <p className="body-sm opacity-80">{item.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="section-padding section-spacing">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h2 className="heading-2 text-foreground">From the asset library</h2>
            <Link to="/assets" className="font-sans text-sm font-medium text-primary hover:text-forest-light flex items-center gap-1">
              Browse all assets <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAssets.map((asset, i) =>
            <motion.div
              key={asset.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}>

                <Link
                to={`/assets/${asset.slug}`}
                className="block bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all h-full">

                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                    <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.state}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground mb-3 leading-snug">{asset.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="font-sans font-semibold text-foreground">${asset.price}</span>
                    <span className="font-sans text-sm text-primary font-medium">Get it</span>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* By State Teaser */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-2 text-foreground text-center mb-4">We know the rules in your state</h2>
          <p className="body-base text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Psychedelic regulations vary significantly by state. Our resources are built for the rules where you actually operate.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {activeStates.map((state) =>
            <Link
              key={state.slug}
              to={`/states/${state.slug}`}
              className="bg-background border border-border rounded-lg p-5 text-center hover:border-primary/40 hover:shadow-sm transition-all">

                <h3 className="font-serif text-lg font-medium text-foreground">{state.name}</h3>
                <p className="text-xs font-sans text-muted-foreground mt-1">{state.substances.join(", ")}</p>
              </Link>
            )}
            {comingSoonStates.map((state) =>
            <Link
              key={state.slug}
              to={`/states/${state.slug}`}
              className="bg-muted/50 border border-border/50 rounded-lg p-5 text-center opacity-60 hover:opacity-80 hover:border-primary/30 transition-all">

                <h3 className="font-serif text-lg font-medium text-foreground">{state.name}</h3>
                <p className="text-xs font-sans text-muted-foreground mt-1">Coming soon</p>
              </Link>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/states" className="font-sans text-sm font-medium text-primary hover:text-forest-light">
              View all states →
            </Link>
          </div>
        </div>
      </section>

      {/* By Substance Teaser */}
      <section className="section-padding section-spacing">
        <div className="container-wide">
          <h2 className="heading-2 text-foreground text-center mb-12">Built around the substance you work with</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {substances.map((substance, i) =>
            <motion.div
              key={substance.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>

                <Link
                to={`/substances/${substance.slug}`}
                className="block bg-card border border-border rounded-xl p-7 text-center hover:border-primary/30 hover:shadow-md transition-all h-full">

                  <Leaf size={28} className="text-primary mx-auto mb-4" />
                  <h3 className="heading-4 text-foreground mb-2">{substance.name}</h3>
                  <p className="body-sm text-muted-foreground">{substance.slug === 'ketamine' ? 'Available in all 50 states' : Array.isArray(substance.states) ? substance.states.join(", ") : substance.states}</p>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding section-spacing bg-card">
        <div className="container-wide">
          <h2 className="heading-2 text-foreground text-center mb-12">What our clients say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-border rounded-xl p-8">

                <Star size={20} className="text-gold mb-4" />
                <p className="body-base text-foreground italic mb-6">{t.quote}</p>
                <div>
                  <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="section-padding section-spacing">
        <div className="container-wide grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="bg-muted rounded-xl aspect-[4/3] flex items-center justify-center">
            <span className="text-muted-foreground font-sans text-sm">[Founder photo placeholder]</span>
          </div>
          <div>
            <h2 className="heading-2 text-foreground mb-6">Built by someone who saw the gap</h2>
            <p className="body-base text-muted-foreground mb-4">
              [Placeholder] The psychedelic medicine industry is moving fast, but the compliance infrastructure hasn't kept up. PsyComply was founded to close that gap — giving practitioners and operators the tools they need to do this work safely and legally.
            </p>
            <Link to="/about" className="font-sans text-sm font-medium text-primary hover:text-forest-light flex items-center gap-1">
              More about PsyComply <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding section-spacing bg-primary text-primary-foreground text-center">
        <div className="container-narrow">
          <h2 className="heading-2 mb-6">Ready to get your compliance handled?</h2>
          <p className="body-lg opacity-80 mb-10 max-w-xl mx-auto">
            Thirty minutes. No pressure. We'll tell you exactly what you need for your state, substance, and stage.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base px-10">
            <Link to="/book">Book a Free Discovery Call</Link>
          </Button>
        </div>
      </section>
    </main>);

};

export default Index;