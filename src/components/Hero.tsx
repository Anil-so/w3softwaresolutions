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
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/30 dark:from-background/95 dark:via-background/90 dark:to-primary/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight drop-shadow-sm">
            Crafting Digital Excellence
            <span className="block text-primary mt-2">One Solution at a Time</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            We transform your ideas into powerful websites and applications.
            Professional development solution tailored for your business success.
          </p>

          {/* Services Preview */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-3 text-foreground bg-background/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/20 shadow-sm">
              <Code className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-semibold text-sm sm:text-base">Web Development</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border/60"></div>
            <div className="flex items-center gap-3 text-foreground bg-background/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/20 shadow-sm">
              <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-semibold text-sm sm:text-base">App Development</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="premium" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all duration-300 group">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all duration-300 backdrop-blur-sm bg-background/30" asChild>
              <Link to="/our-work">View Our Work</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-24 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
};

export default Hero;