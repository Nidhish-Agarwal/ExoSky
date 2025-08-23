// StarsBackground.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

function RotatingStars() {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars
        radius={120} // how far the field extends
        depth={80} // layers
        count={8000} // number of stars
        factor={4} // star size factor
        saturation={0}
        fade={false}
        speed={0.5}
      />
    </group>
  );
}

export default function StarsBackground() {
  return (
    <Canvas
      className="absolute inset-0 z-0"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 1] }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <RotatingStars />
    </Canvas>
  );
}
