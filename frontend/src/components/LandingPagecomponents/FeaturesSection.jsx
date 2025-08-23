import React, { useRef } from "react";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { FiArrowDownCircle } from "react-icons/fi";
import { CometCard } from "./CometCard";
import { Scene, Fog, PerspectiveCamera } from "three";
import { useNavigate } from "react-router-dom";

// ------ STAR SETTINGS: must match HeroSection ------
const aspect = 1.2;
const cameraZ = 300;

function StarsBackground() {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars
        radius={900}
        depth={120}
        count={18000}
        factor={4}
        saturation={0}
        fade={false}
        speed={0.5}
      />
    </group>
  );
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();
  React.useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0); // transparent for overlay
  }, [gl, size]);
  return null;
}

// --- Features data and Card as before ---
const features = [
  { title: "Real Data", desc: "Powered by Gaia & SIMBAD star catalogs." },
  {
    title: "3D Universe",
    desc: "Explore stars in a 360° immersive space.",
    interactive: true,
    href: "/login",
  },
  {
    title: "Constellations",
    desc: "View, learn, and interact with patterns in the night sky.",
  },
];

function FeatureCard({ title, desc, interactive, onClick }) {
  return (
    <CometCard className="my-10 w-full max-w-2xl mx-auto shadow-xl">
      <div
        className={`flex flex-col items-center text-center min-h-[14rem] py-10 px-5 rounded-2xl 
        ${
          interactive ? "cursor-pointer hover:bg-indigo-700/30 transition" : ""
        }`}
        onClick={interactive ? onClick : undefined}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
          {title}
        </h3>
        <p className="text-lg md:text-xl text-white/80 mb-2">{desc}</p>
        {interactive && (
          <div className="mt-6">
            <span className="inline-block px-4 py-2 rounded-xl text-indigo-300 bg-slate-900/30 border border-indigo-600 animate-pulse text-base">
              Click to Explore
            </span>
          </div>
        )}
      </div>
    </CometCard>
  );
}

// --- FeaturesSection: Stars Canvas as background layer ---
export default function FeaturesSection() {
  const navigate = useNavigate();
  const scene = React.useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0xffffff, 400, 2000);
    return s;
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-black overflow-hidden px-4 py-20">
      {/* Stars Canvas as absolute background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          scene={scene}
          camera={new PerspectiveCamera(50, aspect, 180, 1800)}
        >
          <WebGLRendererConfig />
          <StarsBackground />
          {/* Optionally, keep orbit controls for extra vibe, does nothing for stars */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={cameraZ}
            maxDistance={cameraZ}
            autoRotateSpeed={1}
            autoRotate={true}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI - Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Overlay DOM content */}
      <h2 className="z-10 text-4xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight">
        Features
      </h2>
      <div className="w-full flex flex-row items-center z-10 relative">
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            title={f.title}
            desc={f.desc}
            interactive={!!f.interactive}
            onClick={f.interactive ? () => navigate(f.href) : undefined}
          />
        ))}
        {/* CTA card here... */}
      </div>
    </section>
  );
}
