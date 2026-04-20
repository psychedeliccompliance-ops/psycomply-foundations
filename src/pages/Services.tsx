import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { services } from "@/data/siteData";
import { Scale, Heart, Lock, Users, Building2, Megaphone, ArrowRight } from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  Scale: <Scale size={28} />,
  Heart: <Heart size={28} />,
  Lock: <Lock size={28} />,
  Users: <Users size={28} />,
  Building: <Building2 size={28} />,
  Megaphone: <Megaphone size={28} />,
};

const Services = () => {
  return (
    <main className="pb-28 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">Full operational and legal support for psychedelic businesses</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Six areas. Every document, protocol, and system you need. Choose what fits.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding pb-24">
        <div className="container-wide space-y-16">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-8 lg:p-12"
              id={service.slug}
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="text-primary mt-1">{serviceIcons[service.icon]}</div>
                <div>
                  <h2 className="heading-3 text-foreground">{service.title}</h2>
                  <p className="mt-3 body-base text-muted-foreground max-w-3xl">{service.fullDescription}</p>
                </div>
              </div>

              {/* Tiers */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {service.tiers.map((tier) => (
                  <div key={tier.name} className="bg-background border border-border rounded-lg p-6">
                    <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{tier.name}</h4>
                    <p className="body-sm text-foreground mb-4">{tier.description}</p>
                    <p className="font-sans font-semibold text-foreground">{tier.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans">
                  <Link to="/book">Book a call to discuss</Link>
                </Button>
                <Button asChild variant="outline" className="font-sans">
                  <Link to={`/services/${service.slug}`}>
                    Full details <ArrowRight size={14} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Services;
