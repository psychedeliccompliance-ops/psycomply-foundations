import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const FloatingCTA = () => {
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-3">
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
