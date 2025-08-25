import React from "react";
import { Rocket } from "lucide-react";

export default function IntroScreen({ onStart }) {
  // Generate stars
  const stars = Array.from({ length: 80 }, (_, i) => {
    const size =
      Math.random() > 0.7
        ? "w-1.5 h-1.5"
        : Math.random() > 0.4
        ? "w-1 h-1"
        : "w-px h-px";
    const color = Math.random() > 0.6 ? "bg-blue-300" : "bg-white";
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const animX =
      Math.random() > 0.5
        ? "animate-[moveX_6s_linear_infinite]"
        : "animate-[moveX_9s_linear_infinite]";
    const animY =
      Math.random() > 0.5
        ? "animate-[moveY_6s_linear_infinite]"
        : "animate-[moveY_11s_linear_infinite]";

    return (
      <div
        key={i}
        className={`absolute rounded-full opacity-80 ${size} ${color} ${animX} ${animY}`}
        style={{ top, left }}
      />
    );
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden relative">
      {/* Starfield */}
      <div className="absolute inset-0">{stars}</div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between items-center h-full px-8 text-center py-6">
        {/* Logo */}
        <div className="mt-6">
          <div className="relative">
            <Rocket className="w-24 h-24 text-blue-400 mx-auto drop-shadow-lg" />
            <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Main text */}
       <div className="max-w-2xl text-center">
  <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-8 leading-snug">
    ExoSky
  </h1>

         <p className="text-xl md:text-2xl font-medium text-gray-200 mb-6 leading-relaxed">
    Help us uncover what ignites your cosmic curiosity.
  </p>

<p className="text-xl md:text-2xl font-sans text-blue-300 mb-12 leading-snug">
    Each choice you make crafts your personalized journey — explore planets, stars, and wonders that excite you most.
  </p>

        </div>

        {/* Button */}
         <button
    onClick={onStart}
    className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-lg md:text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 mb-12"
  >
    Start Your Adventure
  </button>

        {/* Footer */}
        <p className="text-gray-400 text-sm md:text-base font-semibold mt-4 mb-6 italic">
          A universe of wonders awaits
        </p>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes moveX {
          0% { transform: translateX(0); }
          50% { transform: translateX(25px); }
          100% { transform: translateX(0); }
        }
        @keyframes moveY {
          0% { transform: translateY(0); }
          50% { transform: translateY(25px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
