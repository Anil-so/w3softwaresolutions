import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
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
    document.body.style.overflow = "unset";
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Our Work", href: "/our-work" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
    { name: "Careers", href: "/careers" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${scrolled || isMenuOpen
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
                className="h-8 w-8 sm:h-10 sm:w-10 relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-300 truncate max-w-[200px] sm:max-w-none">
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
          <div className="md:hidden flex items-center space-x-2 z-[101]">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full active:bg-primary/10 border border-border/50 bg-background/50 backdrop-blur-sm"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 stroke-[2.5]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMenuOpen(false)}
          style={{ touchAction: "none" }}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-background shadow-2xl border-l border-border/50 transition-transform duration-300 ease-out flex flex-col h-[100dvh] ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg">Menu</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="h-10 w-10 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Drawer Links */}
          <nav className="flex flex-col p-6 space-y-2 overflow-y-auto flex-1 bg-background overscroll-contain">
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center justify-between p-4 rounded-xl text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 group active:scale-[0.98]"
                onClick={() => setIsMenuOpen(false)}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {item.name}
                <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
              </Link>
            ))}

            <div className="my-6 border-t border-border/50" />

            <div className="space-y-4 pb-8">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              <Button className="w-full rounded-xl py-6 shadow-lg shadow-primary/20 bg-gradient-primary text-lg font-semibold active:scale-[0.98] transition-transform">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;