import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  Paintbrush,
  Rocket,
  ArrowRight,
  Zap,
  Shield,
  Users,
  CheckCircle,
  Star,
  Clock,
  TrendingUp
} from "lucide-react";

const OurWork = () => {
  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern, responsive websites that drive results and engage your audience across all devices with cutting-edge technologies.",
      longDescription: "We specialize in creating high-performance web applications using React, Next.js, and modern frontend frameworks. Our websites are not just visually appealing but also optimized for search engines, fast loading times, and seamless user experiences across all devices.",
      features: [
        "React & Next.js Development",
        "Responsive & Mobile-First Design",
        "SEO Optimization & Performance",
        "Progressive Web Apps (PWA)",
        "E-commerce Solutions",
        "Content Management Systems"
      ],
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
      price: "Starting from $2,999",
      delivery: "2-4 weeks"
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native iOS & Android applications with seamless user experiences, robust functionality, and modern design principles.",
      longDescription: "Our mobile development team creates cross-platform applications using React Native and Flutter, ensuring your app works perfectly on both iOS and Android while maintaining native performance and user experience.",
      features: [
        "React Native & Flutter",
        "Cross-Platform Development",
        "App Store Optimization",
        "Push Notifications & Analytics",
        "Offline Functionality",
        "Third-party Integrations"
      ],
      color: "from-purple-500 to-pink-500",
      badge: "Trending",
      price: "Starting from $4,999",
      delivery: "4-8 weeks"
    },
    {
      icon: Database,
      title: "Backend & API Development",
      description: "Scalable backend solutions with secure APIs, real-time features, cloud infrastructure, and robust database management.",
      longDescription: "We build powerful backend systems using Node.js, Python, and modern frameworks. Our APIs are designed for scalability, security, and performance, with comprehensive documentation and testing.",
      features: [
        "RESTful & GraphQL APIs",
        "Node.js & Python Development",
        "PostgreSQL & MongoDB",
        "Real-time Features",
        "Cloud Infrastructure (AWS/GCP)",
        "Microservices Architecture"
      ],
      color: "from-green-500 to-emerald-500",
      badge: "Enterprise Ready",
      price: "Starting from $3,999",
      delivery: "3-6 weeks"
    },
    {
      icon: Paintbrush,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers with modern aesthetics and user-centered approach.",
      longDescription: "Our design team creates stunning user interfaces and experiences that not only look beautiful but also drive conversions and user engagement through strategic design thinking and user research.",
      features: [
        "User Research & Testing",
        "Wireframing & Prototyping",
        "Visual Design & Branding",
        "Design Systems Creation",
        "Figma & Adobe Creative Suite",
        "Conversion Optimization"
      ],
      color: "from-orange-500 to-red-500",
      badge: "Creative Excellence",
      price: "Starting from $1,999",
      delivery: "1-3 weeks"
    },
    {
      icon: Shield,
      title: "DevOps & Security",
      description: "Secure deployment pipelines, monitoring, infrastructure management, and comprehensive security audits for your applications.",
      longDescription: "We ensure your applications are deployed securely and efficiently with automated CI/CD pipelines, comprehensive monitoring, and robust security measures to protect your business and users.",
      features: [
        "CI/CD Pipeline Setup",
        "Docker & Kubernetes",
        "AWS/GCP Cloud Management",
        "Security Audits & Testing",
        "Performance Monitoring",
        "Backup & Disaster Recovery"
      ],
      color: "from-indigo-500 to-purple-600",
      badge: "Security First",
      price: "Starting from $2,499",
      delivery: "1-2 weeks"
    },
    {
      icon: Users,
      title: "Technology Consulting",
      description: "Strategic technology consulting to help your business make informed decisions, scale effectively, and optimize processes.",
      longDescription: "Our experienced consultants help you navigate complex technology decisions, optimize your existing systems, and plan for future growth with strategic technology roadmaps.",
      features: [
        "Technology Strategy Planning",
        "Architecture Review & Design",
        "Team Training & Mentoring",
        "Code Audits & Optimization",
        "Digital Transformation",
        "Startup Technology Advisory"
      ],
      color: "from-teal-500 to-blue-600",
      badge: "Expert Guidance",
      price: "Starting from $199/hour",
      delivery: "Ongoing"
    }
  ];

  const stats = [
    { label: "Projects Completed", value: "150+", icon: CheckCircle },
    { label: "Happy Clients", value: "98%", icon: Star },
    { label: "Years Experience", value: "8+", icon: Clock },
    { label: "Success Rate", value: "100%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6">
              What We <span className="bg-gradient-primary bg-clip-text text-transparent">Build</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              From innovative web applications to scalable mobile solutions, we craft digital experiences
              that transform ideas into successful businesses and drive meaningful growth.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-500 transform hover:scale-[1.02] animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                        <service.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                          {service.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {service.badge}
                          </Badge>
                          <span className="text-sm font-semibold text-primary">{service.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.delivery}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <p className="text-sm text-muted-foreground/80 leading-relaxed">
                    {service.longDescription}
                  </p>
                </CardHeader>

                <CardContent className="relative pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="default" className="flex-1 group/btn">
                      <span>Get Quote</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's discuss your requirements and create something amazing together. We're here to turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="lg" className="animate-glow">
                Start Your Project Today
              </Button>
              <Button variant="outline" size="lg" className="group">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWork;