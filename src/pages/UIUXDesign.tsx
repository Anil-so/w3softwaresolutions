import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Paintbrush,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  Eye,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";


const UIUXDesign = () => {
  const features = [
    "User Research & Testing",
    "Wireframing & Prototyping",
    "Visual Design & Branding",
    "Design Systems Creation",
    "Responsive Design",
    "Accessibility Compliance",
    "User Journey Mapping",
    "A/B Testing",
    "Conversion Optimization",
    "Design Handoff"
  ];

  const packages = [
    {
      name: "Design Essentials",
      price: "$1,999",
      duration: "1-2 weeks",
      description: "Perfect for startups and small projects",
      features: [
        "Basic UI design",
        "Mobile-first approach",
        "Color palette & typography",
        "Basic prototyping",
        "Design guidelines",
        "Source files included"
      ],
      popular: false
    },
    {
      name: "Complete UX Design",
      price: "$4,999",
      duration: "3-5 weeks",
      description: "Comprehensive design solution for businesses",
      features: [
        "User research & personas",
        "Wireframing & prototyping",
        "High-fidelity designs",
        "Design system creation",
        "Usability testing",
        "Design documentation",
        "3 revision rounds"
      ],
      popular: true
    },
    {
      name: "Enterprise Design",
      price: "$9,999+",
      duration: "6-10 weeks",
      description: "Advanced design solutions for large projects",
      features: [
        "Comprehensive user research",
        "Advanced prototyping",
        "Design system architecture",
        "Accessibility compliance",
        "Multi-platform designs",
        "Design team training",
        "Ongoing design support"
      ],
      popular: false
    }
  ];

  const tools = [
    { name: "Figma", icon: "🎨", desc: "Design & Prototyping" },
    { name: "Adobe XD", icon: "🎯", desc: "User Experience" },
    { name: "Sketch", icon: "✏️", desc: "Interface Design" },
    { name: "InVision", icon: "👁️", desc: "Design Collaboration" },
    { name: "Principle", icon: "⚡", desc: "Animation & Motion" },
    { name: "Miro", icon: "🗺️", desc: "User Journey Mapping" }
  ];

  const portfolio = [
    {
      title: "E-commerce Redesign",
      description: "Complete UX overhaul increasing conversions by 150%",
      tech: ["User Research", "A/B Testing", "Figma"],
      image: "🛍️"
    },
    {
      title: "SaaS Dashboard",
      description: "Intuitive analytics dashboard for business intelligence",
      tech: ["Data Visualization", "UX Research", "Prototyping"],
      image: "📊"
    },
    {
      title: "Mobile Banking App",
      description: "Secure and user-friendly banking experience",
      tech: ["Mobile Design", "Security UX", "Accessibility"],
      image: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-500/10 via-background to-red-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full mb-6">
              <Paintbrush className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">UI/UX Design</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Beautiful <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">User Experiences</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              We create intuitive and engaging designs that users love. From research to final design,
              we craft experiences that convert visitors into loyal customers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="default" size="lg" className="animate-glow">
                Start Design Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                View Design Portfolio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Designs Created", value: "200+", icon: Paintbrush },
                { label: "User Satisfaction", value: "96%", icon: Star },
                { label: "Conversion Increase", value: "180%", icon: TrendingUp },
                { label: "Design Awards", value: "15+", icon: Eye }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className="h-6 w-6 text-orange-500 mx-auto mb-2" />
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
              What We <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Design</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive UI/UX design services that put users at the center
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-2 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 animate-slide-in-right"
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
                className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 animate-slide-in-right ${pkg.popular ? 'border-orange-500 shadow-elegant' : 'border-border/50'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <CardHeader className={pkg.popular ? 'pt-12' : 'pt-6'}>
                  <div className="text-center">
                    <CardTitle className="text-xl font-bold text-foreground mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-orange-500 mb-2">{pkg.price}</div>
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

      {/* Design Tools */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Tools We <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Master</span>
            </h3>
            <p className="text-muted-foreground">Industry-leading design tools for exceptional results</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-orange-500/50 hover:shadow-elegant transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h4 className="font-bold text-foreground mb-1">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
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
              Recent <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Designs</span>
            </h3>
            <p className="text-muted-foreground">Examples of our UI/UX design work</p>
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
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors">
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
                    View Design
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 to-red-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Create Amazing Designs?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your design needs and create user experiences that drive results.
              Get a free design consultation and see how we can transform your product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="default" size="lg" className="animate-glow">
                Start Your Design Project
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

export default UIUXDesign;