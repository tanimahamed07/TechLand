"use client";

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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Slides data (same as before)
const slides = [
  {
    badge: "New Arrivals 2025",
    title: "Next-Gen Electronics",
    highlight: "At Your Fingertips",
    subtitle:
      "Discover cutting-edge technology at unbeatable prices. Quality guaranteed on every purchase.",
    cta: "Shop Now",
    ctaLink: "/products",
    secondaryCta: "View Deals",
    secondaryLink: "/products?sort=-discount",
    Icon: ShoppingBag,
    iconColor: "text-primary",
    badge2: "Free Shipping",
    badge3: "Top Brands",
  },
  {
    badge: "Top Rated",
    title: "Premium Audio",
    highlight: "For Every Moment",
    subtitle:
      "Headphones, earbuds & speakers — immersive sound that transforms your world.",
    cta: "Explore Audio",
    ctaLink: "/products",
    secondaryCta: "Best Sellers",
    secondaryLink: "/products?sort=-sold",
    Icon: Headphones,
    iconColor: "text-primary",
    badge2: "Up to 40% Off",
    badge3: "4.8★ Rated",
  },
  {
    badge: "Best Sellers",
    title: "Smart Devices,",
    highlight: "Smarter Living",
    subtitle:
      "Transform your home with the latest smart technology. Free delivery on orders over ৳50.",
    cta: "Shop Smart",
    ctaLink: "/products",
    secondaryCta: "Learn More",
    secondaryLink: "/about",
    Icon: Cpu,
    iconColor: "text-primary",
    badge2: "Warranty Included",
    badge3: "Easy Returns",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper group"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            {/* Height reduced to 60vh - 70vh for a more compact look */}
            <div className="min-h-[60vh] lg:min-h-[65vh] flex items-center transition-all duration-700 bg-linear-to-br from-primary/5 via-background to-accent/5">
              {/* Max-w-7xl added to align perfectly with the Navbar */}
              <div className="container mx-auto max-w-7xl px-4 lg:px-6 py-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  {/* Left: Content */}
                  <div className="space-y-6 text-center lg:text-left z-20">
                    <Badge
                      variant="secondary"
                      className="gap-2 px-3 py-1 text-[10px] font-bold rounded-full border-primary/10 bg-secondary/80 backdrop-blur-md uppercase tracking-widest"
                    >
                      <Zap className="w-3 h-3 fill-primary text-primary" />
                      {slide.badge}
                    </Badge>

                    <div className="space-y-1">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                        {slide.title}
                      </h1>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary leading-[1.1]">
                        {slide.highlight}
                      </h1>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {[
                        { icon: Truck, text: "Free Delivery" },
                        { icon: Shield, text: "Secure Payment" },
                      ].map(({ icon: Icon, text }) => (
                        <div
                          key={text}
                          className="flex items-center gap-2 bg-secondary/30 backdrop-blur-md rounded-xl px-4 py-2 text-xs font-bold text-foreground/70 border border-border/50"
                        >
                          <Icon className="w-3.5 h-3.5 text-primary" />
                          {text}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full h-12 px-8 text-base font-bold shadow-lg bg-primary"
                      >
                        <Link
                          href={slide.ctaLink}
                          className="flex items-center gap-2"
                        >
                          {slide.cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full h-12 px-8 text-base font-bold border-border bg-background/20 backdrop-blur-lg hover:bg-secondary"
                      >
                        <Link href={slide.secondaryLink}>
                          {slide.secondaryCta}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right: Visual Section - Sizing Adjusted */}
                  <div className="hidden lg:flex items-center justify-center relative h-[400px]">
                    <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-[80px] animate-pulse" />

                    <div className="relative z-10 w-64 h-64 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl shadow-xl border border-border flex items-center justify-center">
                      <slide.Icon
                        className={`w-24 h-24 ${slide.iconColor} drop-shadow-2xl`}
                      />
                    </div>

                    <Badge className="absolute top-8 right-8 shadow-md py-1.5 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs">
                      {slide.badge2}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="absolute bottom-8 left-8 shadow-md py-1.5 px-4 rounded-full bg-background/80 backdrop-blur-md font-bold text-xs border-border"
                    >
                      {slide.badge3}
                    </Badge>

                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-card/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-border text-center min-w-[100px]">
                      <div className="text-2xl font-black text-primary leading-none mb-1">
                        50K+
                      </div>
                      <div className="text-[8px] uppercase tracking-widest font-black text-muted-foreground opacity-60">
                        Happy Users
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: oklch(var(--primary));
          opacity: 0.2;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 8px;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: oklch(var(--primary));
          background: oklch(var(--background) / 0.8);
          backdrop-filter: blur(8px);
          width: 45px;
          height: 45px;
          border-radius: 100%;
          border: 1px solid oklch(var(--border));
          opacity: 0;
          transition: all 0.3s ease;
        }
        .hero-swiper:hover .swiper-button-next,
        .hero-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: 900;
        }
      `}</style>
    </section>
  );
}
