import { Newsletter, HeroSection, FeaturedProducts } from "./_components";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
      </main>

      <Newsletter />
    </div>
  );
}
