import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import { 
  Code, 
  Smartphone, 
  Globe, 
  Database, 
  Paintbrush, 
=======
import { useNavigate } from "react-router-dom";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  Paintbrush,
>>>>>>> 4b3916bf9f528dd0584c8af32ea25d42586d12ac
  Rocket,
  ArrowRight,
  Zap,
  Shield,
  Users
} from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern, responsive websites that drive results and engage your audience across all devices.",
      features: ["React & Next.js", "Responsive Design", "SEO Optimized", "Performance First"],
      color: "from-blue-500 to-cyan-500",
      badge: "Popular"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native iOS & Android applications with seamless user experiences and robust functionality.",
      features: ["React Native", "Cross-Platform", "App Store Ready", "Push Notifications"],
      color: "from-purple-500 to-pink-500",
      badge: "Trending"
    },
    {
      icon: Database,
      title: "Backend & APIs",
      description: "Scalable backend solutions with secure APIs, real-time features, and cloud infrastructure.",
      features: ["Node.js & Python", "PostgreSQL", "RESTful APIs", "Cloud Deployment"],
      color: "from-green-500 to-emerald-500",
      badge: "Essential"
    },
    {
      icon: Paintbrush,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers with modern aesthetics.",
      features: ["Figma Design", "User Research", "Prototyping", "Design Systems"],
      color: "from-orange-500 to-red-500",
      badge: "Creative"
    },
    {
      icon: Shield,
      title: "DevOps & Security",
      description: "Secure deployment pipelines, monitoring, and infrastructure management for your applications.",
      features: ["Docker & K8s", "CI/CD Pipelines", "AWS/GCP", "Security Audits"],
      color: "from-indigo-500 to-purple-600",
      badge: "Secure"
    },
    {
      icon: Users,
      title: "Consulting",
      description: "Strategic technology consulting to help your business make informed decisions and scale effectively.",
      features: ["Tech Strategy", "Architecture Review", "Team Training", "Code Audits"],
      color: "from-teal-500 to-blue-600",
      badge: "Expert"
    }
  ];

  return (
    <>
      <section id="services" className="py-16 sm:py-28 bg-background relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-background dark:to-accent/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 sm:mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full mb-6 border border-primary/10">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-primary">Premium Services</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              What We <span className="text-primary relative inline-block">
                Create
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From innovative web applications to scalable mobile solutions, we craft digital experiences
              that transform ideas into successful businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group relative overflow-hidden border border-border/50 bg-card/70 dark:bg-card/30 backdrop-blur-md hover:shadow-strong transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                  <service.icon className="h-24 w-24 text-foreground/20" />
                </div>

                <CardHeader className="relative pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:shadow-glow transition-all duration-500`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="font-medium bg-background/50 backdrop-blur-sm border-border/50">
                      {service.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <p className="text-muted-foreground mb-6 leading-relaxed min-h-[80px]">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-primary hover:text-primary hover:bg-primary/5 justify-between group/btn border border-primary/10 hover:border-primary/30 transition-all duration-300"
                    onClick={() => {
                      const routes = {
                        "Web Development": "/web-development",
                        "Mobile Apps": "/mobile-apps",
                        "Backend & APIs": "/custom-software",
                        "UI/UX Design": "/ui-ux-design",
                        "DevOps & Security": "/custom-software",
                        "Consulting": "/our-work"
                      };
                      navigate(routes[service.title] || "/our-work");
                    }}
                  >
                    <span className="font-medium">Explore Service</span>
                    <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))
            }
          </div>

          <div className="text-center mt-16 sm:mt-24">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
<<<<<<< HEAD
              <Button variant="hero" size="lg" className="animate-glow" asChild>
                <Link to="/#contact">Start Your Project</Link>
              </Button>
              <Button variant="outline" size="lg" className="group" asChild>
                <Link to="/our-work">
                  View Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
=======
              <Button variant="hero" size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 w-full sm:w-auto h-12 px-8">
                Start Your Project
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 group bg-background/50 backdrop-blur-sm">
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
>>>>>>> 4b3916bf9f528dd0584c8af32ea25d42586d12ac
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Technology Stack</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Technologies We <span className="bg-gradient-primary bg-clip-text text-transparent">Master</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge tools and frameworks that power our innovative solutions and drive exceptional results
            </p>
          </div>

          {/* Primary Technologies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
            {[
              { name: "React", icon: "⚛️", image: "/assets/React.png", color: "from-blue-500 to-cyan-500", desc: "Frontend Framework" },
              { name: "Next.js", icon: "▲", image: null, color: "from-gray-700 to-gray-900", desc: "Full-stack Framework" },
              { name: "TypeScript", icon: "TS", image: "/assets/TypeScript.png", color: "from-blue-600 to-blue-700", desc: "Type Safety" },
              { name: "Tailwind", icon: "🎨", image: "/assets/Tailwind.png", color: "from-teal-500 to-blue-600", desc: "CSS Framework" },
              { name: "Node.js", icon: "🟢", image: "/assets/Node.png", color: "from-green-500 to-green-600", desc: "Backend Runtime" },
              { name: "PostgreSQL", icon: "🐘", image: "/assets/PostgreSQL.png", color: "from-blue-500 to-indigo-600", desc: "Database" },
            ].map((tech, index) => (
              <div
                key={tech.name}
                className="group relative p-4 sm:p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-elegant transition-all duration-500 transform hover:scale-105 animate-scale-in flex flex-col items-center justify-center gap-3 sm:gap-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                <div className="relative z-10 h-16 w-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {tech.image ? (
                    <img
                      src={tech.image}
                      alt={`${tech.name} logo`}
                      className="h-full w-full object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl">{tech.icon}</span>
                  )}
                </div>

                <div className="relative text-center z-10">
                  <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{tech.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scrolling Technologies Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm border border-border/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
            <div className="relative">
              <h4 className="text-xl font-bold text-center text-foreground mb-8">
                And Many More Technologies We Work With
              </h4>
              <div className="flex animate-scroll-right space-x-12 whitespace-nowrap">
                {/* First set */}
                <div className="flex space-x-12 animate-scroll-right">
                  {[
                    { name: "MongoDB", icon: "🍃" },
                    { name: "AWS", icon: "☁️" },
                    { name: "Docker", icon: "🐳" },
                    { name: "Firebase", icon: "🔥" },
                    { name: "Supabase", icon: "⚡" },
                    { name: "Vercel", icon: "◢" },
                    { name: "Python", icon: "🐍" },
                    { name: "GraphQL", icon: "◈" },
                    { name: "Redis", icon: "🔴" },
                    { name: "Prisma", icon: "◦" },
                    { name: "Figma", icon: "🎨" },
                    { name: "Stripe", icon: "💳" }
                  ].map((tech) => (
                    <div
                      key={`first-${tech.name}`}
                      className="flex items-center gap-3 min-w-[140px] p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{tech.name}</span>
                    </div>
                  ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex space-x-12 animate-scroll-right">
                  {[
                    { name: "MongoDB", icon: "🍃" },
                    { name: "AWS", icon: "☁️" },
                    { name: "Docker", icon: "🐳" },
                    { name: "Firebase", icon: "🔥" },
                    { name: "Supabase", icon: "⚡" },
                    { name: "Vercel", icon: "◢" },
                    { name: "Python", icon: "🐍" },
                    { name: "GraphQL", icon: "◈" },
                    { name: "Redis", icon: "🔴" },
                    { name: "Prisma", icon: "◦" },
                    { name: "Figma", icon: "🎨" },
                    { name: "Stripe", icon: "💳" }
                  ].map((tech) => (
                    <div
                      key={`second-${tech.name}`}
                      className="flex items-center gap-3 min-w-[140px] p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12 animate-bounce-in" style={{ animationDelay: '1s' }}>
            <Button variant="outline" size="lg" className="group">
              View All Technologies
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;