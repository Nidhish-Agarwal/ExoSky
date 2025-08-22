// import Navbar from "../components/Navbar";
// import HeroSection from "../components/HeroSection";
// src/pages/LandingPage.jsx
import { useEffect, useRef } from "react";
import HeroSection from "../components/LandingPagecomponents/HeroSection";
import FeaturesSection from "../components/LandingPagecomponents/FeaturesSection";
import ShowcaseSection from "../components/LandingPagecomponents/ShowcaseSection";
import CTASection from "../components/LandingPagecomponents/CTASection";
import TeamFooter from "../components/LandingPagecomponents/Footer";

const sections = [
  <HeroSection key="hero" />,
  <FeaturesSection key="features" />,
  <ShowcaseSection key="showcase" />,
  <CTASection key="cta" />,
  //   <TeamFooter />,
];

export default function LandingPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;

    const handleScroll = () => {
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        // reached bottom → reset to top seamlessly
        el.scrollTop = 1;
      } else if (el.scrollTop <= 0) {
        // reached top → jump to near-bottom
        el.scrollTop = el.scrollHeight - el.clientHeight - 2;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
    >
      {/* duplicate content to fake loop */}
      {sections}
      {sections}
    </div>
  );
}
