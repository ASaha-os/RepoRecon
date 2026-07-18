import { useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { KineticMarquee } from "@/components/landing/KineticMarquee";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { scrollToSection } from "@/lib/smoothScroll";

const Index = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = setTimeout(() => scrollToSection(hash), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="mono-page">
      <Header />

      <main id="main-content">
        <HeroSection />

        {/* Marquee strip */}
        <KineticMarquee
          items={["40+ active users", "Public repositories", "Architecture in context", "No setup required"]}
        />

        {/* 4px rule */}
        <hr className="mono-rule" aria-hidden="true" />

        <ProductPreview />

        <hr className="mono-rule" aria-hidden="true" />

        <StatsSection />

        <hr className="mono-rule" aria-hidden="true" />

        <FeatureGrid />

        {/* Reverse marquee */}
        <KineticMarquee
          speed="slow"
          className="mono-marquee--light"
          items={["Map the system", "Find the friction", "Ask the codebase", "Ship the brief"]}
        />

        <hr className="mono-rule" aria-hidden="true" />

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
