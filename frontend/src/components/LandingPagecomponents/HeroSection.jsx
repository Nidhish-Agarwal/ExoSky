import React from "react";
import { World } from "./Globe"; // Adjust import path as needed
// (No need to import Canvas/Stars here; World already renders its own Canvas)

export default function HeroSection() {
  // Configuration for the globe colors and lighting
  const globeConfig = {
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.95)",
    ambientLight: "#cccccc",
    directionalLeftLight: "#364fc7",
    directionalTopLight: "#4c6ef5",
    pointLight: "#a3bffa",
  };

  // Example data for arcs (add or change as needed)
  const data = [
    {
      order: 1,
      startLat: 37.7749, // San Francisco
      startLng: -122.4194,
      endLat: 51.5074, // London
      endLng: -0.1278,
      arcAlt: 0.2,
      color: "#7df9ff",
    },
    {
      order: 2,
      startLat: -33.8688, // Sydney
      startLng: 151.2093,
      endLat: 35.6762, // Tokyo
      endLng: 139.6503,
      arcAlt: 0.3,
      color: "#ff69b4",
    },
    {
      order: 3,
      startLat: 40.7128, // New York
      startLng: -74.006,
      endLat: 48.8566, // Paris
      endLng: 2.3522,
      arcAlt: 0.25,
      color: "#00ffff",
    },
    {
      order: 4,
      startLat: 28.6139, // Delhi
      startLng: 77.209,
      endLat: -23.5505, // São Paulo
      endLng: -46.6333,
      arcAlt: 0.35,
      color: "#ffa500",
    },
    {
      order: 5,
      startLat: 55.7558, // Moscow
      startLng: 37.6173,
      endLat: -1.2921, // Nairobi
      endLng: 36.8219,
      arcAlt: 0.22,
      color: "#39ff14",
    },
    {
      order: 6,
      startLat: 52.52, // Berlin
      startLng: 13.405,
      endLat: 34.0522, // Los Angeles
      endLng: -118.2437,
      arcAlt: 0.28,
      color: "#ff1493",
    },
    {
      order: 7,
      startLat: -26.2041, // Johannesburg
      startLng: 28.0473,
      endLat: 19.4326, // Mexico City
      endLng: -99.1332,
      arcAlt: 0.3,
      color: "#1e90ff",
    },
    {
      order: 8,
      startLat: 35.6895, // Tokyo
      startLng: 139.6917,
      endLat: 55.9533, // Edinburgh
      endLng: -3.1883,
      arcAlt: 0.27,
      color: "#ff6347",
    },
    {
      order: 9,
      startLat: -34.6037, // Buenos Aires
      startLng: -58.3816,
      endLat: 31.2304, // Shanghai
      endLng: 121.4737,
      arcAlt: 0.33,
      color: "#adff2f",
    },
    {
      order: 10,
      startLat: 59.3293, // Stockholm
      startLng: 18.0686,
      endLat: -41.2865, // Wellington
      endLng: 174.7762,
      arcAlt: 0.4,
      color: "#00ced1",
    },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* World renders its own Canvas; stars are added inside World */}
      <World globeConfig={globeConfig} data={data} />

      {/* EXOSKY Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10 pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 tracking-wider drop-shadow-lg">
          EXOSKY
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1 opacity-80"></div>
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Discover New Worlds
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-8">
          Explore stars, exoplanets, and galaxies through an interactive 3D
          universe.
        </p>
        <br />
        <p>Scroll down for more.</p>
        {/* <button
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg pointer-events-auto"
          onClick={() => alert("Get Started clicked!")}
        >
          Get Started
        </button> */}
      </div>
    </section>
  );
}
