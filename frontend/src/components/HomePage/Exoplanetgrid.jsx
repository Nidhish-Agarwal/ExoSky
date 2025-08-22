// components/HomePage/ExoplanetGrid.jsx
import React, { useEffect, useRef, useCallback } from "react";
import ExoplanetCard from "./ExoplanetCard";

const ExoplanetGrid = ({ exoplanets, onLearnMore, galleryRef }) => {
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollSpeed = 0.5;

  // duplicate planets for infinite effect
  const loopedExoplanets = [...exoplanets, ...exoplanets];

  const autoScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollLeft += scrollSpeed;

    // when we reach halfway, reset to start
    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    }

    animationRef.current = requestAnimationFrame(autoScroll);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [autoScroll]);

  return (
    <section ref={galleryRef} className="py-16 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Exoplanets</h2>
          <p className="text-cyan-200 max-w-3xl mx-auto text-lg">
            Explore fascinating worlds beyond our solar system. Each exoplanet has a unique story waiting to be discovered.
          </p>
        </div>

        {/* Auto-scrolling horizontal strip */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-hidden pb-6"
        >
          {loopedExoplanets.map((planet, idx) => (
            <div key={idx} className="min-w-[300px] max-w-[320px] flex-shrink-0">
              <ExoplanetCard planet={planet} onLearnMore={onLearnMore} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExoplanetGrid;
