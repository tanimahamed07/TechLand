"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Headphones,
  Cpu,
  Zap,
  Shield,
  Truck,
} from "lucide-react";

// Shadcn UI components (Assuming default installation)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    badge: "New Arrivals 2025",
    title: "Next-Gen Electronics",
    highlight: "At Your Fingertips",
    subtitle: "Discover cutting-edge technology at unbeatable prices. Quality guaranteed on every purchase.",
    cta: "Shop Now",
    ctaLink: "/products",
    secondaryCta: "View Deals",
    secondaryLink: "/products?sort=-discount",
    slideClass: "hero-slide-0",
    Icon: ShoppingBag,
    iconColor: "text-primary",
    badge2: "Free Shipping",
    badge3: "Top Brands",
    accentClass: "text-primary",
  },
  {
    badge: "Top Rated",
    title: "Premium Audio",
    highlight: "For Every Moment",
    subtitle: "Headphones, earbuds & speakers — immersive sound that transforms your world.",
    cta: "Explore Audio",
    ctaLink: "/products",
    secondaryCta: "Best Sellers",
    secondaryLink: "/products?sort=-sold",
    slideClass: "hero-slide-1",
    Icon: Headphones,
    iconColor: "text-secondary",
    badge2: "Up to 40% Off",
    badge3: "4.8★ Rated",
    accentClass: "text-secondary",
  },
  {
    badge: "Best Sellers",
    title: "Smart Devices,",
    highlight: "Smarter Living",
    subtitle: "Transform your home with the latest smart technology. Free delivery on orders over ৳50.",
    cta: "Shop Smart",
    ctaLink: "/products",
    secondaryCta: "Learn More",
    secondaryLink: "/about",
    slideClass: "hero-slide-2",
    Icon: Cpu,
    iconColor: "text-primary",
    badge2: "Warranty Included",
    badge3: "Easy Returns",
    accentClass: "text-primary",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            {/* Dynamic class using Template Literal instead of clsx */}
            <div className={`hero-slide ${slide.slideClass} min-h-[90vh] lg:min-h-[80vh] flex items-center transition-colors duration-500`}>
              <div className="container mx-auto px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Left: Content */}
                  <div className="space-y-6 text-center lg:text-left">
                    <Badge variant="default" className="gap-2 px-4 py-1.5 text-sm font-semibold rounded-full">
                      <Zap className="w-4 h-4 fill-current" />
                      {slide.badge}
                    </Badge>

                    <div className="space-y-1">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                        {slide.title}
                      </h1>
                      <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${slide.accentClass}`}>
                        {slide.highlight}
                      </h1>
                    </div>

                    <p className="text-muted-foreground text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {[{ icon: Truck, text: "Free Delivery" }, { icon: Shield, text: "Secure Payment" }].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-muted-foreground border border-border">
                          <Icon className="w-4 h-4 text-primary" />
                          {text}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <Button asChild size="lg" className="rounded-xl h-14 px-8">
                        <Link href={slide.ctaLink} className="flex items-center gap-2">
                          {slide.cta} <ArrowRight className="w-5 h-5" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="rounded-xl h-14 px-8 border-border bg-background/50">
                        <Link href={slide.secondaryLink}>{slide.secondaryCta}</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right: Visual */}
                  <div className="hidden lg:flex items-center justify-center relative h-96">
                    <div className="absolute w-80 h-80 rounded-full bg-primary/10 animate-pulse" />
                    <div className="absolute w-60 h-60 rounded-full bg-secondary/10" />
                    <div className="relative z-10 p-10 rounded-3xl bg-background/90 backdrop-blur-sm shadow-2xl border border-border">
                      <slide.Icon className={`w-28 h-28 ${slide.iconColor}`} />
                    </div>
                    <Badge className="absolute top-8 right-4 shadow-lg py-2 px-4 bg-primary text-primary-foreground">{slide.badge2}</Badge>
                    <Badge variant="secondary" className="absolute bottom-8 left-4 shadow-lg py-2 px-4">{slide.badge3}</Badge>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-slide-0 { background-image: linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--background)), hsl(var(--accent) / 0.05)); }
        .hero-slide-1 { background-image: linear-gradient(to bottom right, hsl(var(--accent) / 0.05), hsl(var(--background)), hsl(var(--primary) / 0.05)); }
        .hero-slide-2 { background-image: linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--background)), hsl(var(--muted) / 0.2)); }
        
        .hero-swiper .swiper-pagination-bullet { background: hsl(var(--primary)); opacity: 0.3; }
        .hero-swiper .swiper-pagination-bullet-active { opacity: 1; width: 30px; border-radius: 9999px; transition: all 0.3s ease; }
        
        .hero-swiper .swiper-button-next, .hero-swiper .swiper-button-prev {
          color: hsl(var(--primary)); background: hsl(var(--background));
          width: 44px; height: 44px; border-radius: 50%; border: 1px solid hsl(var(--border));
        }
      `}</style>
    </section>
  );
}