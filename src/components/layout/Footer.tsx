import { Link } from "react-router-dom";

const footerLinks = {
  company: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Resources", href: "/blog" },
  ],
  resources: [
    { label: "Asset Library", href: "/assets" },
    { label: "By State", href: "/states" },
    { label: "By Substance", href: "/substances" },
    { label: "Book a Call", href: "/book" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Logo & tagline */}
            <div className="md:col-span-2">
              <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
                Psy<span className="text-gold">Comply</span>
              </Link>
              <p className="mt-4 body-sm opacity-80 max-w-md">
                PsyComply provides compliance consulting and operational resources for the psychedelic medicine industry. Nothing on this site constitutes legal advice.
              </p>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-60 mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="body-sm opacity-80 hover:opacity-100 transition-opacity">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource links */}
            <div>
              <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-60 mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="body-sm opacity-80 hover:opacity-100 transition-opacity">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="body-sm opacity-60">
              &copy; {new Date().getFullYear()} PsyComply. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="body-sm opacity-60 hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link to="/terms" className="body-sm opacity-60 hover:opacity-100 transition-opacity">Terms of Use</Link>
              <Link to="/contact" className="body-sm opacity-60 hover:opacity-100 transition-opacity">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
