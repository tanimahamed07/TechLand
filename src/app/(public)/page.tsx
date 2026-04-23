import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StatSection from "@/components/home/StatSection";
import WhyTechLand from "@/components/home/WhyTechLand";
import TestimonialSection from "@/components/home/TestimonialSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="mx-auto">
        {" "}
        {/* mx-auto add kora hoyeche */}
        <HeroSection />
        <CategorySection></CategorySection>
        <FeaturedProducts></FeaturedProducts>
        <StatSection/>
        <WhyTechLand/>
        <TestimonialSection/>
        <NewsletterSection/>
        <FAQSection/>
        <CTASection/>
      </main>
    </div>
  );
}
