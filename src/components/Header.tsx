import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/w3-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Our Work", href: "/our-work" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
    { name: "Careers", href: "/careers" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled || isMenuOpen
        ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border/50 py-0"
        : "bg-transparent py-2"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer z-50 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={logo}
                alt="W3 Software Solutions"
                className="h-10 w-10 relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-300">
              W3 Software Solutions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* CTA & Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button className="rounded-full px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-primary border-0">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4 z-50">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 min-h-[48px] min-w-[48px] flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md active:bg-primary/10"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-in spin-in-90 duration-300" />
              ) : (
                <Menu className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-background/98 backdrop-blur-xl z-40 md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        style={{ top: "0", paddingTop: "80px" }}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col h-full overflow-y-auto">
          <nav className="flex flex-col space-y-2 mb-8">
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-2xl font-bold text-foreground/80 hover:text-primary py-4 border-b border-border/40 transition-all duration-300 flex justify-between items-center group"
                style={{ transitionDelay: `${idx * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-primary">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-10 space-y-6">
            <div className="p-6 bg-card/40 rounded-2xl border border-border/50 shadow-lg">
              <h4 className="font-bold text-foreground mb-2">Ready to start a project?</h4>
              <p className="text-muted-foreground text-sm mb-4">Let's build something amazing together.</p>
              <Button className="w-full rounded-xl py-6 text-lg shadow-lg shadow-primary/20 bg-gradient-primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;