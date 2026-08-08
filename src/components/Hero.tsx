import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Crafting Digital Excellence
            <span className="block text-primary-light">One Solution at a Time</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            We transform your ideas into powerful websites and applications. 
            Professional development solutions tailored for your business success.
          </p>

          {/* Services Preview */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Code className="h-6 w-6" />
              </div>
              <span className="font-medium">Web Development</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/30"></div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Smartphone className="h-6 w-6" />
              </div>
              <span className="font-medium">App Development</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="premium" size="lg" className="group" asChild>
              <Link to="/#contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
              <Link to="/our-work">View Our Work</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/5 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
};

export default Hero;