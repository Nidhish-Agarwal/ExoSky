import React from "react";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalScreen() {
     const navigate = useNavigate(); 
  // Generate 100 random stars
  const stars = Array.from({ length: 100 }).map((_, i) => {
    const size =
      Math.random() > 0.8
        ? "w-1.5 h-1.5"
        : Math.random() > 0.5
        ? "w-1 h-1"
        : "w-px h-px";
    const color = Math.random() > 0.7 ? "bg-blue-300" : "bg-white";
    const opacity = `opacity-${[30, 40, 50, 60, 70, 80][
      Math.floor(Math.random() * 6)
    ]}`;
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const duration = `${10 + Math.random() * 20}s`; // slow drifting
    const delay = `${Math.random() * 10}s`;

    return (
      <div
        key={i}
        className={`absolute rounded-full ${size} ${color} ${opacity}`}
        style={{
          top,
          left,
          animation: `drift ${duration} linear infinite`,
          animationDelay: delay,
        }}
      ></div>
    );
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0">{stars}</div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-8">
        <Rocket className="w-28 h-28 text-blue-400 drop-shadow-lg mb-6 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-thin text-white mb-4">
          Ready for Lift-Off!
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Your cosmic adventure awaits. <br /> Strap in and explore the wonders
          of the universe!
        </p>

        <button
         onClick={() => navigate("/explore")}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
        >
          Launch ExoSky
        </button>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
      `}</style>
    </div>
  );
}
