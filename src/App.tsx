import { useState, useEffect, useCallback } from "react";
import LenisProvider from "./components/providers/LenisProvider";
import CustomCursor from "./components/ui/CustomCursor";
import PageTransition from "./components/ui/PageTransition";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import IntroLoader from "./components/sections/IntroLoader";
import Hero from "./components/sections/Hero";
import PainPoints from "./components/sections/PainPoints";
import Cases from "./components/sections/Cases";
import Services from "./components/sections/Services";

import Testimonials from "./components/sections/Testimonials";
import CTASection from "./components/sections/CTASection";

export default function App() {
  const [heroStart, setHeroStart] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  // Trigger blue overlay page transition
  const handleNavigate = () => {
    setTransitionKey(prev => prev + 1);
  };

  const handleHeroStart = useCallback(() => setHeroStart(true), []);
  const handleLoaderComplete = useCallback(() => setLoaderComplete(true), []);

  return (
    <LenisProvider>
      <CustomCursor />
      <PageTransition triggerKey={transitionKey} />
      
      {!loaderComplete && <IntroLoader onHeroStart={handleHeroStart} onComplete={handleLoaderComplete} />}
      
      <div>
        <Navbar onNavigate={handleNavigate} isLoaded={heroStart} />
        <Hero isLoaded={heroStart} />
        <PainPoints />
        <Cases />
        <Services />

        <Testimonials />
        <CTASection onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate} />
      </div>

    </LenisProvider>
  );
}
