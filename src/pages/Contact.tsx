import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pb-28 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-2xl">
          <h1 className="heading-1 text-foreground">Get in touch</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Questions, feedback, or just want to say hello. We're here.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-wide max-w-xl">
          {submitted ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <h2 className="heading-3 text-foreground mb-4">Message sent</h2>
              <p className="body-base text-muted-foreground">We respond within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="font-sans text-sm font-medium">Name</Label>
                <Input id="contact-name" placeholder="Your name" required className="font-sans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="font-sans text-sm font-medium">Email</Label>
                <Input id="contact-email" type="email" placeholder="your@email.com" required className="font-sans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="font-sans text-sm font-medium">Message</Label>
                <Textarea id="contact-message" placeholder="What's on your mind?" rows={6} required className="font-sans" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold-hover font-sans text-base">
                Send Message
              </Button>
            </form>
          )}

          <div className="mt-10 text-center">
            <p className="body-sm text-muted-foreground">We respond within one business day.</p>
            <p className="body-sm text-muted-foreground mt-2">
              Or email us directly: <span className="text-foreground">hello@psycomply.com</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
