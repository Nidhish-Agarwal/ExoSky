import HeroSection from "../components/LandingPagecomponents/HeroSection";
import FeaturesSection from "../components/LandingPagecomponents/FeaturesSection";
import ShowcaseSection from "../components/LandingPagecomponents/ShowcaseSection";
import CTASection from "../components/LandingPagecomponents/CTASection";
import "./LandingPage.css";
// import TeamFooter from "../components/LandingPagecomponents/Footer";

export default function LandingPage() {
  return (
    <div className="landing-page lh-screen w-full overflow-y-scroll snap-y snap-mandatory">
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <CTASection />
    </div>
  );
}
