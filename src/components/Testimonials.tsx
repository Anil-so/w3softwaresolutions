import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Globe, Search, MapPin, Briefcase } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Renato Harper",
    position: "CEO, Trexme.",
    company: "Trexme.",
    rating: 5,
    text: "W3 Software Solutions delivered an exceptional e-commerce platform for our business. Their attention to detail and technical expertise exceeded our expectations.",
    avatar: "/assets/p1.jpeg",
  },
  {
    id: 2,
    name: "Brandon Phelps",
    position: "CTO, decoreal",
    company: "Decoreal",
    rating: 5,
    text: "The mobile app they developed for us has been a game-changer. Professional, responsive, and delivered on time. Highly recommended!",
    avatar: "/assets/p2.jpeg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Marketing Director, GrowthCo",
    company: "GrowthCo",
    rating: 5,
    text: "Working with W3 was seamless. They understood our vision and created a website that perfectly represents our brand.",
    avatar: "/assets/Emily.jpg",
  }
];

const platformRatings = [
  {
    platform: "Clutch",
    rating: "4.8",
    maxRating: "5.0",
    reviews: "12",
    icon: Briefcase,
    color: "text-orange-500"
  },
  {
    platform: "Upwork",
    rating: "4.9",
    maxRating: "5.0",
    reviews: "15",
    icon: Globe,
    color: "text-green-500"
  },
  {
    platform: "Google",
    rating: "4.9",
    maxRating: "5.0",
    reviews: "18",
    icon: Search,
    color: "text-blue-500"
  },
  {
    platform: "Freelancer",
    rating: "4.8",
    maxRating: "5.0",
    reviews: "10",
    icon: MapPin,
    color: "text-purple-500"
  }
];

const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Free Consultation Button */}
        <div className="flex justify-center mb-16 animate-fade-in">
          <a
            href="https://wa.me/917597881864?text=Hello%2C%20I%20am%20interested%20in%20a%20free%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-gradient-primary text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
          >
            <span>Get Free Consultation</span>
            <span className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full mb-6 border border-primary/10">
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Client Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Trusted by <span className="text-primary">Visionaries</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it—see how we've helped ambitious businesses achieve their digital goals.
          </p>
        </div>

        {/* Platform Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {platformRatings.map((platform, index) => (
            <Card
              key={platform.platform}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-3 text-muted-foreground group-hover:text-primary transition-colors">
                  <platform.icon className={`h-6 w-6`} />
                  <h3 className="font-bold text-lg text-foreground">{platform.platform}</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {platform.rating}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.floor(parseFloat(platform.rating)))}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {platform.reviews} Verified Reviews
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="bg-card/70 dark:bg-card/30 backdrop-blur-md border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 group animate-fade-in flex flex-col h-full"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                <div className="relative mb-8 flex-1">
                  <Quote className="absolute -top-4 -left-2 h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors duration-500 transform group-hover:scale-110" />
                  <p className="text-muted-foreground leading-loose relative z-10 italic">
                    "{testimonial.text}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-background relative z-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground mb-0.5">{testimonial.position}</p>
                    <p className="text-xs text-primary font-bold tracking-wide">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges - Improved Layout */}
        <div className="mt-20 sm:mt-28 text-center border-t border-border/40 pt-16">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">Trusted & Certified Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-70 hover:opacity-100 transition-opacity duration-500">
            {["SSL Secured", "GDPR Compliant", "SOC 2 Type II", "ISO 27001"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border shadow-sm hover:border-primary/30 transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-bold text-foreground/80">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;