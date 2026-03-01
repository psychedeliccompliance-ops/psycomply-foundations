import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Blog = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">Resources</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Compliance news, regulatory updates, and operational guides for the psychedelic industry.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-wide max-w-xl mx-auto text-center">
          {/* Filter bar ready for future */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["By State", "By Substance", "Compliance News", "Operational Guides"].map((cat) => (
              <span key={cat} className="font-sans text-sm border border-border rounded-full px-4 py-2 text-muted-foreground">
                {cat}
              </span>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-12">
            <h2 className="heading-3 text-foreground mb-4">Content coming soon</h2>
            <p className="body-base text-muted-foreground mb-8">
              We're putting together regulatory guides, compliance updates, and practical operational content. Subscribe to get notified when we publish.
            </p>
            {subscribed ? (
              <p className="body-base text-primary font-medium">You're on the list. We'll be in touch.</p>
            ) : (
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-sans"
                />
                <Button
                  onClick={() => { if (email) setSubscribed(true); }}
                  className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans shrink-0"
                >
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
