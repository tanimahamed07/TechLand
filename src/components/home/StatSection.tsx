"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Globe, Zap } from "lucide-react";
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
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    hoverBorder: "hover:border-blue-300",
  },
  {
    id: 2,
    label: "Total Products",
    value: "1200+",
    Icon: ShoppingBag,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    id: 3,
    label: "Cities Covered",
    value: "64",
    Icon: Globe,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
    hoverBorder: "hover:border-orange-300",
  },
  {
    id: 4,
    label: "Fast Delivery",
    value: "24h",
    Icon: Zap,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    hoverBorder: "hover:border-amber-300",
  },
];

export default function StatSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header - Category Section এর সাথে হুবহু মিল রাখা হয়েছে */}
        <div className="text-center mb-16">
          <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
            Our Milestones
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            We take pride in our growth and the community we've built. TechLand
            continues to set new benchmarks.
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
                  bg-white border border-slate-100 ${item.hoverBorder}
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-lg
                  text-center
                `}
              >
                {/* Icon Container - Category Section এর স্টাইল */}
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>

                {/* Counter Content */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                    <Counter value={item.value} />
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                </div>

                {/* Arrow Accent - Category Section এর ডেকোরেশনের সাথে মিল রাখতে */}
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
