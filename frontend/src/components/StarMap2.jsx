import React, { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars, Text } from "@react-three/drei";
import * as THREE from "three";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AirVent } from "lucide-react";

// Enhanced scaling and positioning
const SCALE = 0.0001; // Smaller scale for better distribution
const MIN_STAR_SIZE = 0.15;
const MAX_STAR_SIZE = 0.6;
const PLANET_RADIUS = 2;

// Star color mapping based on spectral type
const getStarColorBySpectralType = (spectralType, bvColor) => {
  if (!spectralType) return bvColor || "#ffffff";

  const type = spectralType.charAt(0).toLowerCase();
  const colorMap = {
    o: "#9bb2ff", // Blue
    b: "#aabfff", // Blue-white
    a: "#cad8ff", // White
    f: "#fff4ea", // Yellow-white
    g: "#ffeed2", // Yellow (like our Sun)
    k: "#ffd2a1", // Orange
    m: "#ffcc6f", // Red
    l: "#ff6b6b", // Brown dwarf
    t: "#8b4513", // Brown dwarf
  };

  return colorMap[type] || bvColor || "#ffffff";
};

// Animated twinkling star component
const Star = ({ star, onClick, onHover, isSelected, planetPosition }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [twinkle, setTwinkle] = useState(Math.random());

  // Position relative to planet
  const position = useMemo(
    () => [
      (star.x - planetPosition.x) * SCALE,
      (star.y - planetPosition.y) * SCALE,
      (star.z - planetPosition.z) * SCALE,
    ],
    [star, planetPosition]
  );

  // Calculate size based on magnitude and distance
  const size = useMemo(() => {
    const baseSizeFromMag = Math.max(
      MIN_STAR_SIZE,
      MAX_STAR_SIZE - star.mag * 0.1
    );
    const distanceScale = Math.max(
      0.5,
      Math.min(2, 100 / star.distance_pc_from_planet)
    );
    let finalSize = baseSizeFromMag * distanceScale;

    if (isSelected) finalSize *= 2;
    if (hovered) finalSize *= 1.5;

    return finalSize;
  }, [star.mag, star.distance_pc_from_planet, isSelected, hovered]);

  const color = getStarColorBySpectralType(star.spectral_type, star.color);

  // Twinkling animation
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.y += 0.002;

      // Twinkling effect
      const time = state.clock.elapsedTime;
      const twinkleIntensity = 0.3 + Math.sin(time * 2 + twinkle * 10) * 0.2;
      meshRef.current.material.emissiveIntensity = twinkleIntensity;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(star);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(star);
        }}
      >
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glow effect for brighter stars */}
      {star.mag < 2 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[size * 2, 8, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.1} />
        </mesh>
      )}

      {/* Star name label for bright/selected stars */}
      {(star.mag < 1 || isSelected || hovered) && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          fillOpacity={hovered || isSelected ? 1 : 0.7}
        >
          {star.name}
        </Text>
      )}
    </group>
  );
};

// Constellation lines with smooth curves
const ConstellationLines = ({ stars, planetPosition }) => {
  if (stars.length < 2) return null;

  const points = stars.map(
    (star) =>
      new THREE.Vector3(
        (star.x - planetPosition.x) * SCALE,
        (star.y - planetPosition.y) * SCALE,
        (star.z - planetPosition.z) * SCALE
      )
  );

  // Create geometry for lines
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#ff6b35" transparent opacity={0.8} />
    </line>
  );
};

// Planet at the center
const CentralPlanet = ({ planetData }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Planet surface */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[PLANET_RADIUS, 32, 32]} />
        <meshPhongMaterial
          color="#4a90e2"
          emissive="#1a4480"
          emissiveIntensity={0.1}
          shininess={100}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[PLANET_RADIUS * 1.1, 32, 32]} />
        <meshBasicMaterial color="#87ceeb" transparent opacity={0.1} />
      </mesh>

      {/* Planet name */}
      <Text
        position={[0, PLANET_RADIUS + 1, 0]}
        fontSize={0.5}
        color="#87ceeb"
        anchorX="center"
        anchorY="middle"
      >
        {planetData?.planet || "Planet"}
      </Text>
    </group>
  );
};

// Cosmic background with nebula effects
const CosmicBackground = () => {
  return (
    <>
      {/* Base starfield */}
      <DreiStars
        radius={300}
        depth={100}
        count={1000}
        factor={4}
        saturation={0.5}
        fade
      />

      {/* Nebula clouds */}
      <mesh position={[0, 0, -200]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial color="#4a148c" transparent opacity={0.1} />
      </mesh>

      <mesh position={[100, 50, -150]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.05} />
      </mesh>
    </>
  );
};

// Enhanced UI Panel
const InfoPanel = ({
  hoveredStar,
  selectedStars,
  onSave,
  constellationName,
  setConstellationName,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-10 max-w-md">
      <div className="bg-black bg-opacity-80 backdrop-blur-sm text-white p-4 rounded-lg border border-blue-400 shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-blue-300">Star Navigator</h2>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-blue-400 hover:text-white"
          >
            {isMinimized ? "▲" : "▼"}
          </button>
        </div>

        {!isMinimized && (
          <>
            {hoveredStar ? (
              <div className="mb-4 p-3 bg-blue-900 bg-opacity-30 rounded">
                <h3 className="font-bold text-lg text-yellow-300">
                  {hoveredStar.name}
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-blue-300">Distance:</span>{" "}
                    {hoveredStar.distance_pc_from_planet.toFixed(2)} pc
                  </p>
                  <p>
                    <span className="text-blue-300">Magnitude:</span>{" "}
                    {hoveredStar.mag}
                  </p>
                  <p>
                    <span className="text-blue-300">Spectral Type:</span>{" "}
                    {hoveredStar.spectral_type}
                  </p>
                  <p>
                    <span className="text-blue-300">Catalog ID:</span>{" "}
                    {hoveredStar.id}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-gray-300 italic">
                Hover over a star to see details
              </p>
            )}

            <div className="mb-4">
              <p className="mb-2">
                <span className="text-orange-300">Selected Stars:</span>{" "}
                {selectedStars.length}
              </p>

              {selectedStars.length > 0 && (
                <div className="max-h-32 overflow-y-auto">
                  {selectedStars.map((star, index) => (
                    <div key={star.id} className="text-xs text-gray-300 mb-1">
                      {index + 1}. {star.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedStars.length >= 2 && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name your constellation..."
                  value={constellationName}
                  onChange={(e) => setConstellationName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-orange-400 focus:outline-none"
                />
                <button
                  onClick={() => {
                    console.log(constellationName);
                    onSave();
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg"
                >
                  Save Constellation
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Main StarMap Component
const StarMap = ({ starData }) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStars, setSelectedStars] = useState([]);
  const [constellationName, setConstellationName] = useState("");
  const [selectedStarsConnections, setSelectedStarsConnections] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  // Planet position from data
  const planetPosition = starData?.planet_coords_pc || { x: 0, y: 0, z: 0 };

  const handleStarClick = (star) => {
    setSelectedStars((prev) => {
      const exists = prev.find((s) => s.id === star.id);
      if (exists) {
        return prev.filter((s) => s.id !== star.id);
      }
      return [...prev, star];
    });

    if (selectedStars.length > 1) {
      const lastIndex = selectedStars.length - 2;
      const newIndex = selectedStars.length - 1;

      setSelectedStarsConnections((prev) => [...prev, [lastIndex, newIndex]]);
    }
  };

  const handleSaveConstellation = async () => {
    if (selectedStars.length < 2) {
      alert("Select at least 2 stars to create a constellation.");
      return;
    }

    if (!constellationName.trim()) {
      alert("Please name your constellation.");
      return;
    }

    const constellation = {
      name: constellationName,
      stars: selectedStars.map((s) => ({
        id: s.id,
        name: s.name,
        x: s.x,
        y: s.y,
        z: s.z,
        mag: s.mag,
        color: s.color,
        spectral_type: s.spectral_type,
        bv: s.bv,
      })),
      connections: selectedStarsConnections,
      planet: starData?.planet,
      planet_coords_pc: starData?.planet_coords_pc,
    };

    console.log("Saving constellation:", constellation);
    // TODO: POST to backend

    try {
      // POST to backend
      const response = await axiosPrivate.post("/constellation", constellation);

      if (response.status === 201) {
        alert(`Constellation "${constellationName}" saved successfully!`);

        // Reset selections
        setSelectedStars([]);
        setConstellationName("");
        setSelectedStarsConnections([]);
      }

      const ans = await axiosPrivate.get("/constellation");
      console.log("constellation data", ans.data);
    } catch (error) {
      console.error("Error saving constellation:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred while saving the constellation."
      );
    }
  };

  if (!starData || !starData.stars) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading cosmic data...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <InfoPanel
        hoveredStar={hoveredStar}
        selectedStars={selectedStars}
        onSave={handleSaveConstellation}
        constellationName={constellationName}
        setConstellationName={setConstellationName}
        selectedStarsConnections={selectedStarsConnections}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg text-sm z-10">
        <p>🖱️ Click stars to select • 🔄 Drag to rotate • 🔍 Scroll to zoom</p>
      </div>

      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#000011"));
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} color="#4444ff" />
        <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffffff" />
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.3}
          color="#aaaaff"
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={200}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />

        {/* Cosmic background */}
        <CosmicBackground />

        {/* Central planet */}
        <CentralPlanet planetData={starData} />

        {/* Stars */}
        {starData.stars.slice(0, 1000).map((star) => (
          <Star
            key={star.id}
            star={star}
            onClick={handleStarClick}
            onHover={setHoveredStar}
            isSelected={!!selectedStars.find((s) => s.id === star.id)}
            planetPosition={planetPosition}
          />
        ))}

        {/* Constellation lines */}
        <ConstellationLines
          stars={selectedStars}
          planetPosition={planetPosition}
        />
      </Canvas>
    </div>
  );
};

export default StarMap;
