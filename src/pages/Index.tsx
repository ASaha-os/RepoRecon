import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <section id="features">
        <FeatureGrid />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <Footer />
    </main>
  );
};

export default Index;
