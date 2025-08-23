// components/HomePage/ExoplanetGrid.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import ExoplanetCard from "./ExoplanetCard";

const ExoplanetGrid = ({ exoplanets, onLearnMore, galleryRef }) => {
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollSpeed = 0.8;

  // Duplicate planets for infinite effect
  const loopedExoplanets = [...exoplanets, ...exoplanets];

  // Auto-scroll function with smooth animation
  const autoScroll = useCallback(() => {
    if (isPaused) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth / 2;
    const currentScroll = container.scrollLeft;
    
    // Calculate and update scroll progress
    const progress = (currentScroll / maxScroll) * 100;
    setScrollProgress(progress);
    
    // Apply smooth scrolling
    container.scrollLeft += scrollSpeed;

    // When we reach halfway, reset to start with smooth transition
    if (container.scrollLeft >= maxScroll) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft = 0;
      setTimeout(() => {
        if (container) container.style.scrollBehavior = "smooth";
      }, 50);
    }

    animationRef.current = requestAnimationFrame(autoScroll);
  }, [isPaused]);

  // Initialize scrolling on component mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.scrollBehavior = "smooth";
    }
    
    animationRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [autoScroll]);

  // Handle manual scroll events
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const maxScroll = container.scrollWidth / 2;
    const currentScroll = container.scrollLeft;
    const progress = (currentScroll / maxScroll) * 100;
    setScrollProgress(progress);
  };

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);


  return (
    <section ref={galleryRef} className="py-16 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Exoplanets</h2>
          <p className="text-cyan-200 max-w-3xl mx-auto text-lg">
            Explore fascinating worlds beyond our solar system. Each exoplanet has a unique story waiting to be discovered.
          </p>
        </div>


        {/* Auto-scrolling horizontal strip with gradient edges */}
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"
          ></div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"
          ></div>
          
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex gap-6 overflow-x-scroll hide-scrollbar py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loopedExoplanets.map((planet, idx) => (
              <div 
                key={`${planet.id}-${idx}`} 
                className="min-w-[300px] max-w-[320px] flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
              >
                <ExoplanetCard planet={planet} onLearnMore={onLearnMore} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ExoplanetGrid;