"use client";

import React from "react";
import { ShoppingCart, ArrowRight, Sparkles, Laptop } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-12 px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/30"
        >
          {/* Background Decor Shapes */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

          {/* Icon & Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade Your Setup Today
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Ready to Experience the <br /> 
              <span className="text-white/80">Next Level of Tech?</span>
            </h2>
            
            <p className="text-primary-foreground/80 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of tech enthusiasts. Get exclusive access to the latest gadgets, 
              members-only discounts, and lightning-fast delivery.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:bg-opacity-90"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop Now
              </motion.button>
              
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest px-6 py-4 transition-all"
              >
                View Catalog
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Floating Icon Accents */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-12 hidden lg:block opacity-20"
          >
            <Laptop size={120} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}