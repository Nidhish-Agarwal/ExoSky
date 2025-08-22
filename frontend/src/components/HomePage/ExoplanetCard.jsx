// components/HomePage/ExoplanetCard.jsx
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { MessageSquare, MapPin, Zap, Navigation, Gauge, Thermometer } from 'lucide-react';

const PlanetModel = ({ color }) => {
  const meshRef = useRef();

  // rotate planet slowly
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </mesh>
  );
};

const ExoplanetCard = ({ planet, onLearnMore }) => (
  <div className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/70 rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm transform-gpu">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{planet.name}</h3>
          <div className="flex items-center text-cyan-300 text-xs mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{planet.system}</span>
          </div>
        </div>
        <div className="flex flex-col items-end pl-2">
          <span className="text-xs text-cyan-400 mb-1">Distance</span>
          <span className="text-white font-semibold text-sm">{planet.distance} ly</span>
        </div>
      </div>

      {/* 3D Planet Viewer */}
      <div className="mb-4 relative h-32 rounded-xl overflow-hidden bg-black/30 border border-cyan-500/20">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <PlanetModel color={planet.color} />
          </Suspense>
          <Stars radius={100} depth={50} count={100} factor={4} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center">
          <Zap className="w-3 h-3 mr-1 text-cyan-400" />
          <div>
            <div className="text-cyan-400 mb-1">Type</div>
            <div className="text-white font-medium truncate">{planet.type}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Navigation className="w-3 h-3 mr-1 text-cyan-400" />
          <div>
            <div className="text-cyan-400 mb-1">Zone</div>
            <div className="text-white font-medium truncate">{planet.zone}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Gauge className="w-3 h-3 mr-1 text-cyan-400" />
          <div>
            <div className="text-cyan-400 mb-1">Mass</div>
            <div className="text-white font-medium truncate">{planet.mass}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Thermometer className="w-3 h-3 mr-1 text-cyan-400" />
          <div>
            <div className="text-cyan-400 mb-1">Radius</div>
            <div className="text-white font-medium truncate">{planet.radius}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {planet.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/30">
            {tag}
          </span>
        ))}
        {planet.tags.length > 3 && (
          <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-xs border border-cyan-500/30">
            +{planet.tags.length - 3}
          </span>
        )}
      </div>

      {/* Single "Get AI Insights" button - removed the eye button */}
<button 
  onClick={() => onLearnMore(planet)}  // triggers chat opening
  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium group-hover:shadow-lg group-hover:shadow-cyan-500/20"
>
  <MessageSquare className="w-4 h-4" />
  <span>Get AI Insights</span>
</button>

    </div>
  </div>
);

export default ExoplanetCard;