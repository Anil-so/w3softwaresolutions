import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Phone } from "lucide-react";

const faqs = [
  {
    question: "What technologies do you specialize in?",
    answer: "We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Tailwind CSS, and cloud platforms like AWS and Vercel. We also work with mobile technologies like React Native and Flutter."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. A simple website typically takes 2-4 weeks, while complex web applications can take 8-16 weeks. We provide detailed timelines during the planning phase and keep you updated throughout development."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes, we offer comprehensive support and maintenance packages. This includes regular updates, security patches, performance monitoring, backup management, and 24/7 technical support to ensure your application runs smoothly."
  },
  {
    question: "What is your development process?",
    answer: "We follow an agile development approach with 6 key phases: Discovery & Consultation, Strategy & Planning, Development, Testing & QA, Launch & Deployment, and ongoing Support & Maintenance. We maintain transparent communication throughout."
  },
  {
    question: "Can you work with existing systems or do you only build from scratch?",
    answer: "We can work with both! We offer integration services for existing systems, legacy system modernization, API development, and database migration. We also build solutions from scratch when that's the best approach."
  },
  {
    question: "What is included in your web development service?",
    answer: "Our web development includes responsive design, SEO optimization, performance optimization, security implementation, content management systems, e-commerce functionality, and cross-browser compatibility testing."
  },
  {
    question: "Do you offer mobile app development?",
    answer: "Yes, we develop both native and cross-platform mobile applications. We use React Native and Flutter for cross-platform development, and also provide native iOS and Android development when specific platform features are required."
  },
  {
    question: "How do you ensure the security of applications?",
    answer: "We implement industry-standard security practices including SSL certificates, data encryption, secure authentication, regular security audits, GDPR compliance, and protection against common vulnerabilities like SQL injection and XSS attacks."
  },
  {
    question: "What are your payment terms?",
    answer: "We typically work with a 50% upfront payment and 50% upon completion for smaller projects. For larger projects, we can arrange milestone-based payments. We accept various payment methods and provide detailed invoicing."
  },
  {
    question: "Can you help with SEO and digital marketing?",
    answer: "Yes, we provide SEO optimization, Google Analytics setup, social media integration, email marketing setup, and basic digital marketing consultation. We ensure all websites are built with SEO best practices."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services, process, and policies
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Accordion */}
          <Card className="mb-12 bg-card/60 dark:bg-card/40 backdrop-blur-md border-primary/10">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-primary/10 rounded-lg px-4 bg-gradient-to-r from-background/50 to-primary/5 dark:from-background/30 dark:to-primary/10"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-semibold text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Still have questions?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
                </p>
                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-hover transition-colors font-medium">
                  Contact Support
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Need immediate help?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For urgent matters or immediate consultation, feel free to give us a call during business hours.
                </p>
                <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors font-medium">
                  Schedule Call
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;