"use client";

import React from "react";
import { Send, Mail, BellRing, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function NewsletterSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // সাবমিট লজিক এখানে হবে
  };

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 dark:bg-card px-8 py-12 md:px-16 md:py-20 shadow-2xl border border-white/5">
          {/* Background Decor - থিমের প্রাইমারি কালার ব্যবহার করা হয়েছে */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32 -mb-32" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                <BellRing className="w-3.5 h-3.5" />
                Stay Updated
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Get the latest tech <br />
                <span className="text-primary">deals first.</span>
              </h2>

              <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                Join our newsletter and receive exclusive discounts, product
                launches, and tech news directly in your inbox.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> No Spam
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Official
                  Warranty
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Free
                  Insights
                </div>
              </div>
            </div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-[2rem] shadow-xl"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-slate-900/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-slate-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-7 rounded-2xl flex items-center gap-2 transition-all group uppercase text-xs tracking-wider"
                >
                  Subscribe
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
              <p className="text-[10px] text-slate-500 mt-3 px-4 text-center sm:text-left">
                By subscribing, you agree to our Privacy Policy and Terms of
                Service.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
