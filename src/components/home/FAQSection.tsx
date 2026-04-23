import React from "react";
import { 
  HelpCircle, 
  MessageCircleQuestion 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are the products at TechLand genuine?",
    answer: "Absolutely! We only source products directly from official brand distributors or the brands themselves. Every product comes with a 100% authenticity guarantee.",
  },
  {
    question: "What is your delivery timeline?",
    answer: "Inside Dhaka, we deliver within 24 hours. For outside Dhaka, it usually takes 2-3 business days through our premium courier partners.",
  },
  {
    question: "Do you provide official warranty?",
    answer: "Yes, all our electronic products come with brand-authorized official warranties. You can claim the warranty at any of the brand's official service centers.",
  },
  {
    question: "What is your return policy?",
    answer: "We have a 7-day easy return policy for manufacturing defects. The product must be in its original packaging and condition.",
  },
  {
    question: "Can I pay with EMI?",
    answer: "Yes, we offer EMI facilities on major credit cards for orders above 5,000 BDT. You can choose your preferred tenure during checkout.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Header - WhyTechLand এর সাথে মিল রাখা হয়েছে */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Questions
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3">
            Still Have <span className="text-primary">Questions?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Everything you need to know about our services, products, and policies in one place.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border bg-card px-6 rounded-2xl transition-all hover:border-primary/30 shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left font-bold text-foreground text-sm md:text-base group">
                  <span className="flex-1 pr-4 group-data-[state=open]:text-primary transition-colors">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-4 px-8 rounded-3xl bg-secondary/50 border border-border">
            <p className="text-sm font-medium text-muted-foreground">
              Didn&apos;t find what you were looking for?
            </p>
            <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline transition-all">
              <MessageCircleQuestion className="w-4 h-4" />
              Contact our Support Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}