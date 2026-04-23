"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Globe, Zap, BarChart3 } from "lucide-react"; // BarChart3 আইকনটি হেডারের জন্য যোগ করা হয়েছে
import { motion, animate } from "framer-motion";

// --- কাউন্টার কম্পোনেন্ট ---
const Counter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [numericValue]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const stats = [
  {
    id: 1,
    label: "Happy Customers",
    value: "50k+",
    Icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 2,
    label: "Total Products",
    value: "1200+",
    Icon: ShoppingBag,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 3,
    label: "Cities Covered",
    value: "64",
    Icon: Globe,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 4,
    label: "Fast Delivery",
    value: "24h",
    Icon: Zap,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function StatSection() {
  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header - WhyTechLand এর হেডারের সাথে হুবহু মিল রাখা হয়েছে */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            Our Milestones
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We take pride in our growth and the community we've built. TechLand
            continues to set new benchmarks in the industry.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`
                  relative flex flex-col items-center gap-4 p-8 rounded-2xl
                  bg-card border border-border hover:border-primary/50
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5
                  text-center
                `}
              >
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>

                {/* Counter Content */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                    <Counter value={item.value} />
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                </div>

                {/* Arrow Accent */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className={`w-5 h-5 rounded-full ${item.iconBg} flex items-center justify-center`}
                  >
                    <svg
                      className={`w-3 h-3 ${item.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
