import { useState, useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LenisProvider from "./components/providers/LenisProvider";
import CustomCursor from "./components/ui/CustomCursor";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import IntroLoader from "./components/sections/IntroLoader";
import Hero from "./components/sections/Hero";
import PainPoints from "./components/sections/PainPoints";
import Cases from "./components/sections/Cases";
import Services from "./components/sections/Services";

import Testimonials from "./components/sections/Testimonials";
import CTASection from "./components/sections/CTASection";
import OrderPage from "./components/sections/OrderPage";
import AboutPage from "./components/sections/AboutPage";
import PlaceholderPage from "./components/sections/PlaceholderPage";
import SustainabilityPage from "./components/sections/SustainabilityPage";

import { LanguageProvider } from "./components/providers/LanguageContext";

export default function App() {
  const [heroStart, setHeroStart] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "order" | "about" | "blog" | "resources" | "sustainability">("home");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Reset scroll periodically while loading to override browser behavior
    const interval = setInterval(() => {
      window.scrollTo(0, 0);
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleHeroStart = useCallback(() => {
    window.scrollTo(0, 0);
    setHeroStart(true);
  }, []);
  
  const handleLoaderComplete = useCallback(() => {
    window.scrollTo(0, 0);
    setLoaderComplete(true);
    // Recalculate ScrollTrigger markers now that DOM loader is gone and page layout shifts
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  return (
    <LenisProvider>
      <LanguageProvider>
        <CustomCursor />
        
        {!loaderComplete && <IntroLoader onHeroStart={handleHeroStart} onComplete={handleLoaderComplete} />}
        
        <div>
          <Navbar isLoaded={heroStart} currentView={currentView} onViewChange={setCurrentView} />
          
          {currentView === "home" && (
            <>
              <Hero isLoaded={heroStart} />
              <PainPoints />
              <Cases />
              <Services />
              <Testimonials />
              <CTASection />
            </>
          )}
          
          {currentView === "order" && <OrderPage />}
          {currentView === "about" && <AboutPage />}
          {(currentView === "blog" || currentView === "resources") && (
            <PlaceholderPage type={currentView} />
          )}
          {currentView === "sustainability" && <SustainabilityPage />}

          <Footer onViewChange={setCurrentView} />
        </div>
      </LanguageProvider>
    </LenisProvider>
  );
}
