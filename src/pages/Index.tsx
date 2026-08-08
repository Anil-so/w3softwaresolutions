import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <Team />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
