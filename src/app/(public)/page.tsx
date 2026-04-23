import HeroSection from "@/components/banner/HeroSection";
import CategorySection from "@/components/home/CategorySection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="mx-auto">
        {" "}
        {/* mx-auto add kora hoyeche */}
        <HeroSection />
        <CategorySection></CategorySection>
      </main>
    </div>
  );
}
