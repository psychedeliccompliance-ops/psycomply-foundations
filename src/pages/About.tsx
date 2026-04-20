import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">Built by people who saw the gap</h1>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl">
          <div className="space-y-6">
            <p className="body-lg text-foreground">
              The psychedelic medicine industry is growing fast. But the compliance infrastructure — the documents, protocols, and systems that practitioners and businesses actually need to operate — has been woefully inadequate.
            </p>
            <p className="body-base text-muted-foreground">
              PsyComply was founded after years of watching talented healers struggle with paperwork they weren't trained for, and investors burn through money on legal consultants who didn't understand the psychedelic space. There had to be a better way: purpose-built compliance resources created by people who know both the regulatory landscape and the clinical reality.
            </p>
            <p className="body-base text-muted-foreground">
              That's what PsyComply is. We're not a law firm. We're not a therapy practice. We're the compliance and operations team that the psychedelic industry has been missing — built specifically for the people doing this work.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-3 text-foreground mb-6">What we believe</h2>
          <div className="space-y-4 body-base text-muted-foreground">
            <p>
              Psychedelic medicine has real potential to help people. But that potential only gets realized if the industry operates safely, legally, and professionally. Compliance isn't red tape — it's the foundation that makes the healing possible.
            </p>
            <p>
              We believe every practitioner deserves access to the tools and documentation they need. We believe compliance should protect clients, not just businesses. And we believe the industry grows stronger when its infrastructure is solid.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding section-spacing bg-primary text-primary-foreground text-center">
        <div className="container-narrow">
          <h2 className="heading-2 mb-6">Want to work together?</h2>
          <p className="body-lg opacity-80 mb-10">
            Whether you need a single document or full operational support, let's start with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans px-10">
              <Link to="/book">Book a Free Call</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-sans px-10 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
