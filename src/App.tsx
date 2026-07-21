import { useState, useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LenisProvider from "./components/providers/LenisProvider";
import CustomCursor from "./components/ui/CustomCursor";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SpaceIntro from "./components/sections/SpaceIntro";
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
  const [spaceComplete, setSpaceComplete] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [heroStart, setHeroStart] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "order" | "about" | "blog" | "resources" | "sustainability">("home");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSpaceComplete = useCallback(() => {
    setSpaceComplete(true);
  }, []);

  const handleHeroStart = useCallback(() => {
    setHeroStart(true);
  }, []);
  
  const handleLoaderComplete = useCallback(() => {
    setLoaderComplete(true);
  }, []);

  // When loader completes and IntroLoader is unmounted from DOM, reset scroll & refresh triggers
  useEffect(() => {
    if (!loaderComplete) return;

    window.scrollTo(0, 0);
    setHeroStart(true);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("resize"));
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [loaderComplete]);

  return (
    <LenisProvider>
      <LanguageProvider>
        <CustomCursor />
        
        {/* Step 1: jupiter 1 (Space 3D intro) */}
        {!spaceComplete && (
          <SpaceIntro
            onHeroStart={() => {}}
            onComplete={handleSpaceComplete}
          />
        )}
        
        {/* Step 2: jupiter main animation (IntroLoader) */}
        {spaceComplete && !loaderComplete && (
          <IntroLoader
            onHeroStart={handleHeroStart}
            onComplete={handleLoaderComplete}
          />
        )}
        
        {/* Step 3: jupiter main website */}
        <div>
          <Navbar isLoaded={heroStart} currentView={currentView} onViewChange={setCurrentView} />
          
          {currentView === "home" && (
            <>
              <Hero isLoaded={heroStart} onViewChange={setCurrentView} />
              <PainPoints onViewChange={setCurrentView} />
              <Cases />
              <Services onViewChange={setCurrentView} />
              <Testimonials onViewChange={setCurrentView} />
              <CTASection onNavigate={() => { setCurrentView("order"); window.scrollTo(0, 0); }} />
            </>
          )}
          
          {currentView === "order" && <OrderPage />}
          {currentView === "about" && <AboutPage onViewChange={setCurrentView} />}
          {(currentView === "blog" || currentView === "resources") && (
            <PlaceholderPage type={currentView} />
          )}
          {currentView === "sustainability" && <SustainabilityPage onViewChange={setCurrentView} />}

          <Footer onViewChange={setCurrentView} />
        </div>
      </LanguageProvider>
    </LenisProvider>
  );
}

