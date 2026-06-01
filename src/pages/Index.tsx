import { useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { scrollToSection } from "@/lib/smoothScroll";

const Index = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = setTimeout(() => scrollToSection(hash), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <ScrollReveal direction="up" duration={950} distance={40}>
        <section id="features" className="section-anchor">
          <FeatureGrid />
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" duration={950} distance={40} delay={80}>
        <section id="how-it-works" className="section-anchor">
          <HowItWorks />
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" duration={850} distance={28}>
        <Footer />
      </ScrollReveal>
    </main>
  );
};

export default Index;
