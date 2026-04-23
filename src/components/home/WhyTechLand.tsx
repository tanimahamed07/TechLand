import React from "react";
import { 
  ShieldCheck, 
  Truck, 
  HeadphonesIcon, 
  CreditCard, 
  CheckCircle,
  Cpu
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Genuine Products",
    description: "100% authentic electronic gadgets sourced directly from official brands.",
    Icon: ShieldCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Express Delivery",
    description: "Lightning fast shipping across the country with real-time tracking.",
    Icon: Truck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Expert Support",
    description: "Dedicated tech experts available 24/7 to help with your queries.",
    Icon: HeadphonesIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Secure Payments",
    description: "Multiple secure payment gateways and EMI facilities for your ease.",
    Icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

export default function WhyTechLand() {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Header - consistent with other sections */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Why TechLand
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3">
            The TechLand <span className="text-primary">Difference</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We don't just sell gadgets; we provide a premium tech experience backed by trust and quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl overflow-hidden"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <feature.Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  {feature.title}
                  <CheckCircle className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Banner/Note */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Official Warranty</p>
              <p className="text-xs text-muted-foreground">All products come with brand authorized warranty cards.</p>
            </div>
          </div>
          <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
            Learn More About Our Policy →
          </button>
        </div>
      </div>
    </section>
  );
}