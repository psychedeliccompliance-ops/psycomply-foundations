import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { services } from "@/data/siteData";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const { data: activeStates = [] } = useQuery({
    queryKey: ["nav-active-states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("slug, name").eq("active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: substances = [] } = useQuery({
    queryKey: ["nav-substances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("substances").select("slug, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const navItems = [
    {
      label: "Services",
      href: "/services",
      children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    },
    {
      label: "By State",
      href: "/states",
      children: [
        ...activeStates.map((s) => ({ label: s.name, href: `/states/${s.slug}` })),
        { label: "View all states →", href: "/states" },
      ],
    },
    {
      label: "By Substance",
      href: "/substances",
      children: substances.map((s) => ({ label: s.name, href: `/substances/${s.slug}` })),
    },
    { label: "Store", href: "/assets", children: [] },
    { label: "About", href: "/about", children: [] },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-padding">
        <div className="container-wide flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="font-serif text-xl md:text-2xl font-semibold text-foreground tracking-tight">
              Psy<span className="text-gold">Comply</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <DesktopNavItem key={item.href} item={item} pathname={location.pathname} />
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans font-medium">
              <Link to="/book">Book a Free Call</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background overflow-hidden"
          >
            <nav className="section-padding py-6 flex flex-col gap-1">
              {navItems.map((item) => (
                <MobileNavItem key={item.href} item={item} onClose={() => setMobileOpen(false)} />
              ))}
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans mt-4 w-full">
                <Link to="/book" onClick={() => setMobileOpen(false)}>Book a Free Call</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* Desktop nav item with hover dropdown */
interface NavItemData {
  label: string;
  href: string;
  children: { label: string; href: string }[];
}

const DesktopNavItem = ({ item, pathname }: { item: NavItemData; pathname: string }) => {
  const hasChildren = item.children.length > 0;

  return (
    <div className="relative group">
      <Link
        to={item.href}
        className={`body-sm font-medium transition-colors hover:text-foreground flex items-center gap-1 py-2 ${
          pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {item.label}
        {hasChildren && <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />}
      </Link>

      {hasChildren && (
        <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-popover border border-border rounded-xl shadow-lg py-2 min-w-[220px]">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className="block px-4 py-2 body-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* Mobile nav item with expand/collapse */
const MobileNavItem = ({ item, onClose }: { item: NavItemData; onClose: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          to={item.href}
          className="body-base font-medium text-foreground py-2 flex-1"
          onClick={onClose}
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="p-2 text-muted-foreground">
            <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="pl-4 pb-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block py-1.5 body-sm text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
