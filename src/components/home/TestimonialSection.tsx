"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
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
    text: "TechLand has the best collection of high-end gadgets. I bought my mechanical keyboard and the delivery was incredibly fast!",
    product: "Keychron K2 V2",
    avatarColor: "bg-blue-500/10 text-blue-600",
    hoverBorder: "hover:border-blue-300",
  },
  {
    name: "Samiul Islam",
    role: "Graphic Designer",
    avatar: "SI",
    rating: 5,
    text: "Genuine products and very competitive pricing. Their customer support helped me choose the right color-accurate monitor.",
    product: "ASUS ProArt Display",
    avatarColor: "bg-emerald-500/10 text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    name: "Rahat Kabir",
    role: "Tech Reviewer",
    avatar: "RK",
    rating: 5,
    text: "I've tried many shops, but TechLand's warranty service and genuine product assurance keep me coming back. Best in Dhaka!",
    product: "Sony WH-1000XM5",
    avatarColor: "bg-orange-500/10 text-orange-600",
    hoverBorder: "hover:border-orange-300",
  },
  {
    name: "Nabil Murtaza",
    role: "Photography Hobbyist",
    avatar: "NM",
    rating: 5,
    text: "Lightning fast shipping across the country with real-time tracking. My drone arrived in perfect condition. Highly impressed!",
    product: "DJI Mini 3 Pro",
    avatarColor: "bg-cyan-500/10 text-cyan-600",
    hoverBorder: "hover:border-cyan-300",
  },
  {
    name: "Zayan Khan",
    role: "Student",
    avatar: "ZK",
    rating: 4,
    text: "The student discounts are amazing. Got my laptop at a much lower price than other physical stores. Smooth checkout experience.",
    product: "MacBook Air M2",
    avatarColor: "bg-indigo-500/10 text-indigo-600",
    hoverBorder: "hover:border-indigo-300",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }
      />
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 lg:px-8">
        {/* Header - consistent with WhyTechLand section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Customer Stories
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Real reviews from tech enthusiasts who trust TechLand for their
            daily gadgets and hardware.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-14"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div
                className={`
                  relative flex flex-col h-full p-8 rounded-2xl border border-slate-100 bg-white 
                  shadow-sm transition-all duration-300 ${t.hoverBorder} hover:shadow-lg hover:-translate-y-2
                `}
              >
                {/* Quote Icon Accent */}
                <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Quote size={40} className="text-primary" />
                </div>

                {/* Top Row: Avatar & Rating */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${t.avatarColor} flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {t.avatar}
                  </div>
                  <StarRating rating={t.rating} />
                </div>

                {/* Content */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic flex-1">
                  "{t.text}"
                </p>

                {/* Product Tag */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {t.product}
                  </span>
                </div>

                {/* Footer Divider */}
                <div className="h-px bg-slate-100 w-full mb-6" />

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">
                      {t.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">
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
