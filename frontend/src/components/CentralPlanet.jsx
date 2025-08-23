import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const CentralPlanet = ({ planetData }) => {
  const meshRef = useRef();
  const atmosphereRef = useRef();
  const cloudsRef = useRef();
  const { scene } = useThree();

  // Create procedural planet texture
  useEffect(() => {
    if (meshRef.current) {
      // Create a canvas for the planet texture
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // Generate planet surface texture
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Enhanced noise function for more realistic terrain
      const noise = (x, y, frequency, amplitude) => {
        return Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
      };

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;

          // Normalize coordinates
          const nx = x / canvas.width;
          const ny = y / canvas.height;

          // Multiple octaves of noise for more complex terrain
          const noise1 = noise(x, y, 0.01, 0.5) + 0.5;
          const noise2 = noise(x, y, 0.02, 0.3) + 0.5;
          const noise3 = noise(x, y, 0.05, 0.2) + 0.5;
          const noise4 = noise(x, y, 0.1, 0.1) + 0.5;

          const combined = (noise1 + noise2 + noise3 + noise4) / 4;

          // Add latitude-based variation (polar ice caps)
          const latitudeFactor = Math.abs(ny - 0.5) * 2; // 0 at equator, 1 at poles
          const tempFactor = 1 - latitudeFactor * 0.7;

          let r, g, b;

          if (combined < 0.25) {
            // Deep ocean - darker blue
            r = 10 + Math.random() * 20;
            g = 30 + Math.random() * 40;
            b = 80 + Math.random() * 60;
          } else if (combined < 0.35) {
            // Shallow water/coasts - lighter blue
            r = 30 + Math.random() * 30;
            g = 80 + Math.random() * 40;
            b = 120 + Math.random() * 40;
          } else if (combined < 0.45) {
            // Beaches/deserts - sandy colors
            r = 180 + Math.random() * 40;
            g = 150 + Math.random() * 30;
            b = 90 + Math.random() * 30;
          } else if (combined < 0.65) {
            // Grasslands/forests - green variations
            const greenIntensity = tempFactor;
            r = 40 + Math.random() * 60 + (1 - greenIntensity) * 80;
            g = 80 + Math.random() * 80 + greenIntensity * 60;
            b = 30 + Math.random() * 40;
          } else if (combined < 0.8) {
            // Hills/rocky terrain - brown/gray
            r = 100 + Math.random() * 60;
            g = 80 + Math.random() * 50;
            b = 60 + Math.random() * 40;
          } else {
            // Mountains/snow caps - rocky gray or white
            if (latitudeFactor > 0.6 || combined > 0.9) {
              // Snow/ice
              r = 220 + Math.random() * 35;
              g = 220 + Math.random() * 35;
              b = 240 + Math.random() * 15;
            } else {
              // Rocky mountains
              r = 80 + Math.random() * 60;
              g = 75 + Math.random() * 50;
              b = 70 + Math.random() * 40;
            }
          }

          data[index] = Math.min(255, r);
          data[index + 1] = Math.min(255, g);
          data[index + 2] = Math.min(255, b);
          data[index + 3] = 255; // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Create a normal map for surface detail
      const normalCanvas = document.createElement("canvas");
      normalCanvas.width = 512;
      normalCanvas.height = 256;
      const normalCtx = normalCanvas.getContext("2d");
      const normalImageData = normalCtx.createImageData(
        normalCanvas.width,
        normalCanvas.height
      );
      const normalData = normalImageData.data;

      for (let y = 0; y < normalCanvas.height; y++) {
        for (let x = 0; x < normalCanvas.width; x++) {
          const index = (y * normalCanvas.width + x) * 4;

          // Simple normal map generation
          const height = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;

          normalData[index] = 128 + height * 50; // R (normal X)
          normalData[index + 1] = 128 + height * 50; // G (normal Y)
          normalData[index + 2] = 255; // B (normal Z)
          normalData[index + 3] = 255; // Alpha
        }
      }

      normalCtx.putImageData(normalImageData, 0, 0);
      const normalTexture = new THREE.CanvasTexture(normalCanvas);
      normalTexture.wrapS = THREE.RepeatWrapping;
      normalTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Apply textures to planet
      if (meshRef.current.material) {
        meshRef.current.material.map = texture;
        meshRef.current.material.normalMap = normalTexture;
        meshRef.current.material.normalScale = new THREE.Vector2(0.2, 0.2);
        meshRef.current.material.needsUpdate = true;
      }

      // Create cloud texture
      if (cloudsRef.current) {
        const cloudCanvas = document.createElement("canvas");
        cloudCanvas.width = 256;
        cloudCanvas.height = 128;
        const cloudCtx = cloudCanvas.getContext("2d");
        const cloudImageData = cloudCtx.createImageData(
          cloudCanvas.width,
          cloudCanvas.height
        );
        const cloudData = cloudImageData.data;

        for (let y = 0; y < cloudCanvas.height; y++) {
          for (let x = 0; x < cloudCanvas.width; x++) {
            const index = (y * cloudCanvas.width + x) * 4;

            const cloudNoise =
              Math.sin(x * 0.05) * Math.cos(y * 0.05) * 0.5 + 0.5;
            const cloudNoise2 =
              Math.sin(x * 0.02) * Math.cos(y * 0.03) * 0.3 + 0.5;
            const combined = (cloudNoise + cloudNoise2) / 2;

            const alpha = combined > 0.4 ? (combined - 0.4) * 2 * 255 : 0;

            cloudData[index] = 255; // R
            cloudData[index + 1] = 255; // G
            cloudData[index + 2] = 255; // B
            cloudData[index + 3] = Math.min(255, alpha * 0.3); // Alpha
          }
        }

        cloudCtx.putImageData(cloudImageData, 0, 0);
        const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
        cloudTexture.wrapS = THREE.RepeatWrapping;
        cloudTexture.wrapT = THREE.ClampToEdgeWrapping;

        if (cloudsRef.current.material) {
          cloudsRef.current.material.map = cloudTexture;
          cloudsRef.current.material.transparent = true;
          cloudsRef.current.material.opacity = 0.4;
          cloudsRef.current.material.needsUpdate = true;
        }
      }
    }
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0025; // Clouds rotate slightly faster
    }
    if (atmosphereRef.current) {
      // Subtle atmosphere pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      atmosphereRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Planet surface with enhanced terrain texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[4, 64, 32]} />
        <meshPhongMaterial
          color="#ffffff"
          emissive="#001122"
          emissiveIntensity={0.03}
          shininess={10}
          specular="#444444"
          // Textures applied in useEffect
        />
      </mesh>

      {/* Enhanced cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[4.08, 32, 16]} />
        <meshLambertMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          // Cloud texture applied in useEffect
        />
      </mesh>

      {/* Atmosphere glow with better blending */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[4.2, 32, 16]} />
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Planet name label */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {planetData?.planet || "Your Planet"}
      </Text>
    </group>
  );
};

export default CentralPlanet;
