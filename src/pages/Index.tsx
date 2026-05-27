import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

const Index = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <HeroSection />

    <ScrollReveal direction="up" duration={800} distance={50}>
      <section id="features">
        <FeatureGrid />
      </section>
    </ScrollReveal>

    <ScrollReveal direction="up" duration={800} distance={50} delay={100}>
      <section id="how-it-works">
        <HowItWorks />
      </section>
    </ScrollReveal>

    <ScrollReveal direction="up" duration={700} distance={30}>
      <Footer />
    </ScrollReveal>
  </main>
);

export default Index;
