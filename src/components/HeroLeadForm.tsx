import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Mail, MapPin, CheckCircle2, Bell, User, Briefcase, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const PRACTICE_TYPES = [
  "Ketamine clinic",
  "Psilocybin service center",
  "MDMA-assisted therapy",
  "Solo facilitator / therapist",
  "Group practice",
  "Investor / operator",
  "Retreat / wellness center",
  "Other",
];

const leadSchema = z.object({
  first_name: z.string().trim().min(1, { message: "Enter your first name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  state_slug: z.string().trim().min(1, { message: "Select your state" }).max(100),
  practice_type: z.string().trim().min(1, { message: "Select your practice type" }).max(100),
});

const HeroLeadForm = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [stateSlug, setStateSlug] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data: states = [] } = useQuery({
    queryKey: ["states-lead-form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("slug, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({
      first_name: firstName,
      email,
      state_slug: stateSlug,
      practice_type: practiceType,
    });
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      first_name: parsed.data.first_name,
      email: parsed.data.email,
      state_slug: parsed.data.state_slug,
      practice_type: parsed.data.practice_type,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setSuccess(true);
    setFirstName("");
    setEmail("");
    setStateSlug("");
    setPracticeType("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Decorative gold accent */}
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gold/20 blur-2xl" aria-hidden />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/15 blur-3xl" aria-hidden />

      <div className="relative bg-card border border-border rounded-2xl shadow-xl p-8 lg:p-10">
        <div className="absolute -top-4 left-8 inline-flex items-center gap-2 bg-gold text-gold-foreground font-sans text-xs font-semibold px-3 py-1.5 rounded-full">
          <Bell size={12} />
          Free state updates
        </div>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-primary" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">You're on the list</h3>
            <p className="body-sm text-muted-foreground">
              We'll email you when there's a regulatory change in your state.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl lg:text-3xl text-foreground leading-tight">
              Be In The Know: Get Psychedelic Regulation Updates For Your State
            </h3>
            <p className="mt-3 body-sm text-muted-foreground">
              Regulations move fast. We'll send you the changes that actually affect your practice — no fluff.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Always-visible email field */}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@practice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setExpanded(true)}
                  className="pl-10 h-12 font-sans"
                  maxLength={255}
                  required
                />
              </div>

              {!expanded && (
                <Button
                  type="button"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("[HeroLeadForm] Continue clicked, expanding");
                    setExpanded(true);
                  }}
                  className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base h-12 flex items-center justify-center gap-2"
                >
                  Continue →
                  <ChevronDown size={16} />
                </Button>
              )}

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="rest-of-form"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10 h-12 font-sans"
                        maxLength={100}
                      />
                    </div>

                    <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select value={practiceType} onValueChange={setPracticeType}>
                  <SelectTrigger className="pl-10 h-12 font-sans">
                    <SelectValue placeholder="Type of practice" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRACTICE_TYPES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select value={stateSlug} onValueChange={setStateSlug}>
                  <SelectTrigger className="pl-10 h-12 font-sans">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base h-12"
              >
                {submitting ? "Subscribing..." : "Keep me updated"}
              </Button>

              <p className="text-xs text-muted-foreground text-center font-sans">
                No spam. Unsubscribe anytime.
              </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HeroLeadForm;
