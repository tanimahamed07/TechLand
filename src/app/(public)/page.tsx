import HeroSection from "@/components/banner/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StatSection from "@/components/home/StatSection";

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
      </main>
    </div>
  );
}
