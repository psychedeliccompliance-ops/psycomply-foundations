import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingCTA = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [mobileVisible, setMobileVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setMobileVisible(true);
      return;
    }
    setMobileVisible(false);
    const target = document.getElementById("what-is-psycomply");
    if (!target) {
      setMobileVisible(true);
      return;
    }
    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      // Show once the section's top reaches the top of the viewport
      setMobileVisible(rect.top <= window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  return (
    <>
      {/* Desktop: bottom-right floating button */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40">
        <Link
          to="/book"
          className="flex items-center gap-2 bg-gold text-gold-foreground hover:bg-gold-hover px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-sans font-medium text-sm"
        >
          <Phone size={16} />
          Book a Free Call
        </Link>
      </div>

      {/* Mobile: sticky bottom bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-3 transition-transform duration-300 ${
          mobileVisible ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <Link
          to="/book"
          className="flex items-center justify-center gap-2 bg-gold text-gold-foreground hover:bg-gold-hover py-3 rounded-lg font-sans font-medium text-sm w-full"
        >
          <Phone size={16} />
          Book a Free Discovery Call
        </Link>
      </div>
    </>
  );
};

export default FloatingCTA;
