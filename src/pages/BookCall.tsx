import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const stateOptions = ["Oregon", "Colorado", "California", "Washington", "New York", "Texas", "Florida", "Other"];
const substanceOptions = ["Psilocybin", "Ketamine", "MDMA", "Ibogaine", "Multiple", "Not sure yet"];

const BookCall = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-2xl">
          <h1 className="heading-1 text-foreground mb-6">Let's figure out what you need</h1>
          <p className="body-lg text-muted-foreground">
            No pressure. Thirty minutes to understand your situation and tell you exactly what makes sense for you.
          </p>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-wide max-w-2xl">
          {submitted ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <h2 className="heading-3 text-foreground mb-4">Thanks for reaching out</h2>
              <p className="body-base text-muted-foreground">
                We'll review your information and get back to you within one business day to schedule your discovery call.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-sans text-sm font-medium">Name</Label>
                  <Input id="name" placeholder="Your name" required className="font-sans" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="font-sans text-sm font-medium">Business or practice name</Label>
                  <Input id="business" placeholder="Your business name" className="font-sans" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium">State you operate in</Label>
                  <Select>
                    <SelectTrigger className="font-sans"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium">Substance you work with</Label>
                  <Select>
                    <SelectTrigger className="font-sans"><SelectValue placeholder="Select substance" /></SelectTrigger>
                    <SelectContent>
                      {substanceOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="needs" className="font-sans text-sm font-medium">What do you need help with most?</Label>
                <Textarea id="needs" placeholder="Tell us briefly about your situation..." rows={4} className="font-sans" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base">
                Submit and Schedule Your Call
              </Button>
            </form>
          )}

          {/* Calendly placeholder */}
          <div className="mt-12 bg-muted rounded-xl p-16 text-center border border-border">
            <p className="text-muted-foreground font-sans text-sm">[Calendly embed placeholder]</p>
            <p className="text-muted-foreground font-sans text-xs mt-2">Replace with your Calendly scheduling widget</p>
          </div>

          {/* What to expect */}
          <div className="mt-12 space-y-3">
            <h3 className="font-serif text-xl font-medium text-foreground">What to expect</h3>
            <p className="body-sm text-muted-foreground">A real conversation, not a sales pitch. We'll ask about your state, substance, and stage.</p>
            <p className="body-sm text-muted-foreground">We'll tell you exactly what you need and what it would cost. No guessing.</p>
            <p className="body-sm text-muted-foreground">If we're not the right fit, we'll say so. That happens sometimes and it's fine.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookCall;
