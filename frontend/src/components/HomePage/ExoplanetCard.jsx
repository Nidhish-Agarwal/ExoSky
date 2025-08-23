import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  MessageSquare,
  MapPin,
  Zap,
  Navigation,
  Gauge,
  Thermometer,
} from "lucide-react";
import { Link } from "react-router-dom";

const PlanetModel = ({ color }) => {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.4} />
    </mesh>
  );
};

const ExoplanetCard = ({ planet, onLearnMore }) => (
  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm transform-gpu">
    <div className="relative z-10 flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-200 transition-colors">
            {planet.name}
          </h3>
          <div className="flex items-center text-gray-400 text-xs mt-1 truncate">
            <MapPin className="w-3 h-3 mr-1" />
            {planet.system}
          </div>
        </div>
        <div className="flex flex-col items-end pl-2">
          <span className="text-xs text-gray-400 mb-1">Distance</span>
          <span className="text-white font-medium text-sm">
            {planet.distance} ly
          </span>
        </div>
      </div>

      {/* 3D Planet Viewer */}
      <div className="mb-4 relative h-44 rounded-xl overflow-hidden bg-gray-900/40 border border-gray-600/20 shadow-inner">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <Suspense fallback={null}>
            <PlanetModel color={planet.color} />
          </Suspense>
          <Stars radius={100} depth={50} count={100} factor={4} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center">
          <Zap className="w-3 h-3 mr-1 text-gray-400" />
          <div>
            <div className="text-gray-400 mb-1">Type</div>
            <div className="text-white font-medium truncate">{planet.type}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Navigation className="w-3 h-3 mr-1 text-gray-400" />
          <div>
            <div className="text-gray-400 mb-1">Zone</div>
            <div className="text-white font-medium truncate">{planet.zone}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Gauge className="w-3 h-3 mr-1 text-gray-400" />
          <div>
            <div className="text-gray-400 mb-1">Mass</div>
            <div className="text-white font-medium truncate">{planet.mass}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Thermometer className="w-3 h-3 mr-1 text-gray-400" />
          <div>
            <div className="text-gray-400 mb-1">Radius</div>
            <div className="text-white font-medium truncate">{planet.radius}</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {planet.tags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded-full text-xs font-medium border border-gray-600/20"
          >
            {tag}
          </span>
        ))}
        {planet.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-700/30 text-gray-300 rounded-full text-xs font-medium border border-gray-600/20">
            +{planet.tags.length - 3}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Link
          to={`/visualize/${encodeURIComponent(planet.name)}`}
          className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Navigation className="w-4 h-4" />
          Visualize Planet
        </Link>

        <button
          onClick={() => onLearnMore(planet)}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Get AI Insights
        </button>
      </div>
    </div>
  </div>
);

export default ExoplanetCard;