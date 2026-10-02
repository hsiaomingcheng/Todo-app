import "@fontsource-variable/geist";

import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ScreenshotsSection from "../components/landing/ScreenshotsSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-[Geist_Variable,ui-sans-serif,system-ui,sans-serif] text-[#14161A]">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <ScreenshotsSection />
            </main>
            <LandingFooter />
        </div>
    );
}
