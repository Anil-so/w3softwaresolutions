import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  Code,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";


const WebDevelopment = () => {
  const features = [
    "React & Next.js Development",
    "Responsive & Mobile-First Design",
    "SEO Optimization & Performance",
    "Progressive Web Apps (PWA)",
    "E-commerce Solutions",
    "Content Management Systems",
    "API Integration",
    "Real-time Features",
    "Custom Animations",
    "Performance Optimization"
  ];

  const packages = [
    {
      name: "Starter Website",
      price: "$2,999",
      duration: "2-3 weeks",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 5 pages",
        "Responsive design",
        "Basic SEO setup",
        "Contact forms",
        "Social media integration",
        "3 months support"
      ],
      popular: false
    },
    {
      name: "Professional Website",
      price: "$5,999",
      duration: "4-6 weeks",
      description: "Ideal for growing businesses with advanced needs",
      features: [
        "Up to 15 pages",
        "Advanced animations",
        "E-commerce ready",
        "Blog/CMS integration",
        "Advanced SEO",
        "Analytics setup",
        "6 months support"
      ],
      popular: true
    },
    {
      name: "Enterprise Solution",
      price: "$12,999+",
      duration: "8-12 weeks",
      description: "Custom web applications for large organizations",
      features: [
        "Unlimited pages",
        "Custom functionality",
        "Third-party integrations",
        "User authentication",
        "Admin dashboard",
        "Performance monitoring",
        "12 months support"
      ],
      popular: false
    }
  ];

  const technologies = [
    { name: "React", icon: "⚛️", desc: "Modern UI Library" },
    { name: "Next.js", icon: "▲", desc: "Full-stack Framework" },
    { name: "TypeScript", icon: "TS", desc: "Type Safety" },
    { name: "Tailwind CSS", icon: "🎨", desc: "Utility-first CSS" },
    { name: "Node.js", icon: "🟢", desc: "Backend Runtime" },
    { name: "PostgreSQL", icon: "🐘", desc: "Reliable Database" }
  ];

  const portfolio = [
    {
      title: "E-commerce Platform",
      description: "Modern online store with payment integration",
      tech: ["React", "Next.js", "Stripe"],
      image: "🛒"
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics dashboard with real-time data",
      tech: ["React", "TypeScript", "Charts"],
      image: "📊"
    },
    {
      title: "Corporate Website",
      description: "Professional business website with CMS",
      tech: ["Next.js", "Tailwind", "Sanity"],
      image: "🏢"
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-6">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Web Development</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Modern <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Web Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              We build fast, secure, and scalable web applications that drive business growth.
              From simple websites to complex web applications, we bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="default" size="lg" className="animate-glow">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Websites Built", value: "100+", icon: Globe },
                { label: "Happy Clients", value: "98%", icon: Star },
                { label: "Average Speed", value: "1.2s", icon: Zap },
                { label: "Uptime", value: "99.9%", icon: Shield }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services & Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              What We <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Deliver</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive web development services tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-2 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <Card
                key={pkg.name}
                className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 animate-slide-in-right ${pkg.popular ? 'border-blue-500 shadow-elegant' : 'border-border/50'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <CardHeader className={pkg.popular ? 'pt-12' : 'pt-6'}>
                  <div className="text-center">
                    <CardTitle className="text-xl font-bold text-foreground mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-500 mb-2">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pkg.duration}
                    </div>
                    <p className="text-muted-foreground text-sm">{pkg.description}</p>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={pkg.popular ? "default" : "outline"}
                    className="w-full group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Technologies We <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Use</span>
            </h3>
            <p className="text-muted-foreground">Modern tools that power exceptional web experiences</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-blue-500/50 hover:shadow-elegant transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h4 className="font-bold text-foreground mb-1">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Recent <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Projects</span>
            </h3>
            <p className="text-muted-foreground">Examples of our web development work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <Card
                key={project.title}
                className="group overflow-hidden border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-500 transform hover:scale-105 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{project.image}</div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full group">
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Build Your Website?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your web development needs and create something amazing together.
              Get a free consultation and project quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="default" size="lg" className="animate-glow">
                Start Your Web Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Link to="/our-work" className="flex items-center">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WebDevelopment;