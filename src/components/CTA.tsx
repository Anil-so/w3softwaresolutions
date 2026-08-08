import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: Users, label: "Happy Clients", value: "25+" },
  { icon: Trophy, label: "Projects Completed", value: "50+" },
  { icon: Star, label: "Average Rating", value: "4.8" },
  { icon: Clock, label: "Years Experience", value: "3+" }
];

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join hundreds of satisfied clients who have revolutionized their digital presence with our 
            cutting-edge solutions. Let's build something amazing together.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/80 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg group"
            asChild
          >
            <Link to="/#contact">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 text-lg"
            asChild
          >
            <Link to="/our-work">
              View Our Portfolio
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-white/80 mb-4">Trusted by businesses worldwide</p>
          <div className="flex justify-center items-center gap-2 text-white/60">
            <Star className="h-5 w-5 fill-current text-yellow-400" />
            <Star className="h-5 w-5 fill-current text-yellow-400" />
            <Star className="h-5 w-5 fill-current text-yellow-400" />
            <Star className="h-5 w-5 fill-current text-yellow-400" />
            <Star className="h-5 w-5 fill-current text-yellow-400" />
            <span className="ml-2 text-white font-medium">4.8/5</span>
            <span className="ml-1">based on 55+ reviews</span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
};

export default CTA;