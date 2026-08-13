import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://in.linkedin.com/company/w3-software-solutions",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/w3softwaresolutions/",
      label: "Instagram",
    },
    {
      icon: Mail,
      href: "mailto:web3softwaresolutionsinfo@gmail.com",
      label: "Email",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Our Work", href: "/our-work" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
    { name: "Careers", href: "/careers" },
  ];

  const services = [
    { name: "Web Development", href: "/web-development" },
    { name: "Mobile Apps", href: "/mobile-apps" },
    { name: "Custom Software", href: "/custom-software" },
    { name: "UI/UX Design", href: "/ui-ux-design" },
  ];

  return (
    <footer className="bg-[#0B0F19] text-white relative overflow-hidden pt-16 sm:pt-20 border-t border-white/5 dark:border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                W3 Software Solutions
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-md text-lg">
              Transforming ideas into powerful digital solutions. We create
              websites and applications that drive business growth and deliver
              exceptional user experiences.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group"
                >
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <social.icon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted/60 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-primary group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Services
            </h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-muted/60 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-primary group-hover:w-4 transition-all duration-300"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-muted/40 text-sm">
              © {new Date().getFullYear()} W3 Software Solutions. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy-policy"
                className="text-muted/40 hover:text-white text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-muted/40 hover:text-white text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/refund-policy"
                className="text-muted/40 hover:text-white text-sm transition-colors duration-300"
              >
                Refund Policy
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-muted/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-full px-4"
              >
                Back to Top
                <ArrowUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
