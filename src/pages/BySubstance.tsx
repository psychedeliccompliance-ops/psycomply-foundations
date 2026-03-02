import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const BySubstance = () => {
  const { data: substances = [] } = useQuery({
    queryKey: ["substances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">Compliance built around your substance</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Select your substance to see state availability and resources.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-wide grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {substances.map((substance, i) => (
            <motion.div
              key={substance.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/substances/${substance.slug}`}
                className="block bg-card border border-border rounded-xl p-8 hover:border-primary/30 hover:shadow-md transition-all h-full group"
              >
                <Leaf size={28} className="text-primary mb-4" />
                <h2 className="heading-4 text-foreground mb-3">{substance.name}</h2>
                <p className="body-sm text-muted-foreground mb-2 line-clamp-2">{substance.legal_status.split(".")[0]}.</p>
                <p className="body-sm text-muted-foreground mb-4">
                  States: {Array.isArray(substance.states) ? substance.states.join(", ") : substance.states}
                </p>
                <span className="font-sans text-sm font-medium text-primary group-hover:text-forest-light flex items-center gap-1">
                  View details <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BySubstance;
