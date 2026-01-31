import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "Contact@w3softwaresolutions.com",
      description: "Get in touch for project inquiries",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91-7597881864",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Niwaru Rd, Jhotwara, Jaipur, 302012 Rajasthan",
      description: "Schedule an appointment",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon-Fri: 9:00 AM - 6:00 PM",
      description: "Weekend consultations available",
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full mb-6 border border-primary/10">
            <Send className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Let's Build Something{" "}
            <span className="text-primary relative inline-block">
              Amazing
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to transform your ideas into reality? We're here to help you bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <Card className="bg-card/70 dark:bg-card/30 backdrop-blur-md border-border/50 shadow-strong animate-slide-in-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
            <CardHeader className="pb-2 pt-8 px-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form
                className="space-y-6"
                action="https://formsubmit.co/web3softwaresolutionsinfo@gmail.com"
                method="POST"
              >
                {/* Anti-spam & Redirect */}
                <input type="text" name="_honey" style={{ display: "none" }} />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="hidden"
                  value="https://w3softwaresolutions.com/thank-you"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground/80">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      className="bg-background/50 dark:bg-background/30 border-input/50 focus:border-primary/50 transition-colors h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground/80">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="bg-background/50 dark:bg-background/30 border-input/50 focus:border-primary/50 transition-colors h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-foreground/80">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your Company"
                    className="bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-medium text-foreground/80">Project Type</Label>
                  <Input
                    id="projectType"
                    name="projectType"
                    placeholder="Website, Mobile App, Custom Software..."
                    className="bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-foreground/80">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    className="min-h-[140px] bg-background/50 border-input/50 focus:border-primary/50 transition-colors resize-none"
                    required
                  />
                </div>

                <Button variant="hero" size="lg" className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-right lg:pt-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We'd love to hear about your project. Whether you have a
                detailed brief or just an idea, we're here to help you bring it
                to life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactInfo.map((info, index) => (
                <Card
                  key={info.title}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1 text-sm">
                          {info.title}
                        </h4>
                        <p className="text-primary font-semibold mb-1 text-xs break-all">
                          {info.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-primary text-primary-foreground shadow-glow relative overflow-hidden border-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <CardContent className="p-8 text-center relative z-10">
                <h4 className="text-xl font-bold mb-3">
                  Ready to Start Your Project?
                </h4>
                <p className="text-primary-foreground/90 mb-6">
                  Book a free consultation call to discuss your requirements.
                </p>
                <a
                  href="https://tidycal.com/chilkniyo/project-discussion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md px-8 h-12"
                  >
                    Schedule Free Consultation
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
