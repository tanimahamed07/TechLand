"use client";

import React from "react";
import { Star, Quote, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Anas Ahmed",
    role: "Full Stack Developer",
    avatar: "AA",
    rating: 5,
    text: "TechLand has the best collection of high-end gadgets. Fast delivery!",
    product: "Keychron K2 V2",
    avatarColor: "bg-primary/10 text-primary",
  },
  {
    name: "Samiul Islam",
    role: "Graphic Designer",
    avatar: "SI",
    rating: 5,
    text: "Genuine products and very competitive pricing. Expert support from the team.",
    product: "ASUS ProArt Display",
    avatarColor: "bg-primary/10 text-primary",
  },
  {
    name: "Rahat Kabir",
    role: "Tech Reviewer",
    avatar: "RK",
    rating: 5,
    text: "I've tried many shops, but TechLand's warranty is the best in Dhaka! Highly recommended.",
    product: "Sony WH-1000XM5",
    avatarColor: "bg-primary/10 text-primary",
  },
  {
    name: "Nabil Murtaza",
    role: "Photographer",
    avatar: "NM",
    rating: 5,
    text: "My drone arrived in perfect condition. Highly impressed with the packaging!",
    product: "DJI Mini 3 Pro",
    avatarColor: "bg-primary/10 text-primary",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={10}
        className={
          i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
        }
      />
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Customer Stories
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Real reviews from tech enthusiasts who trust TechLand for their
            premium hardware and gadget needs.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          spaceBetween={24} // কার্ডগুলোর গ্যাপ কিছুটা বাড়ানো হয়েছে
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3, // ৩.২ থেকে কমিয়ে ৩ করা হয়েছে যাতে আংশিক দেখা না যায়
              spaceBetween: 24,
            },
          }}
          className="!pb-14 !flex !items-stretch"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <div className="relative flex flex-col h-full p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all duration-300 hover:shadow-md group">
                {/* Slim Quote Icon */}
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                  <Quote size={30} className="text-primary" />
                </div>

                {/* Top Row: Avatar & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${t.avatarColor} flex items-center justify-center font-black text-xs`}
                  >
                    {t.avatar}
                  </div>
                  <StarRating rating={t.rating} />
                </div>

                {/* Content - flex-1 keeps heights equal */}
                <p className="text-muted-foreground text-[13px] leading-relaxed mb-4 italic flex-1">
                  "{t.text}"
                </p>

                {/* Product Tag */}
                <div className="mb-4 mt-auto">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-[9px] font-bold text-muted-foreground uppercase">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {t.product}
                  </span>
                </div>

                <div className="h-px bg-border w-full mb-4" />

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      {t.name}
                    </h4>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                      {t.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    <CheckCircle2 size={8} />
                    <span className="text-[8px] font-bold uppercase">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
