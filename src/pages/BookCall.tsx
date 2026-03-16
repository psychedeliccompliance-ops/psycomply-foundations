import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const BookCall = () => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="pb-16 md:pb-0">
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide max-w-3xl text-center">
          <h1 className="heading-1 text-foreground mb-4">Book a Free Consultation</h1>
          <p className="body-lg text-muted-foreground max-w-xl mx-auto">
            Schedule a 30-minute call to discuss your compliance needs
          </p>
        </div>
      </section>

      <section className="section-padding pb-20">
        <div className="container-wide max-w-4xl">
          <div
            className="calendly-inline-widget rounded-xl overflow-hidden border border-border"
            data-url="https://calendly.com/psychedeliccompliance/30min?hide_gdpr_banner=1&background_color=f5f0e8&text_color=1a1a1a&primary_color=2c4a3e"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      </section>

      {/* What to expect */}
      <section className="section-padding pb-20">
        <div className="container-wide max-w-2xl">
          <h2 className="heading-3 text-foreground mb-6 text-center">What to expect</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "A real conversation", desc: "Not a sales pitch. We'll ask about your state, substance, and stage." },
              { title: "Clear pricing", desc: "We'll tell you exactly what you need and what it would cost. No guessing." },
              { title: "Honest guidance", desc: "If we're not the right fit, we'll say so. That happens sometimes and it's fine." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">{item.title}</h3>
                <p className="body-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookCall;
