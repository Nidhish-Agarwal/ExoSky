import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import CentralPlanet from "./CentralPlanet";

// Configuration for the night sky
const SKY_RADIUS = 100; // Large sphere radius for the sky dome
const MIN_STAR_SIZE = 0.03; // Smaller, more realistic
const MAX_STAR_SIZE = 0.25; // Reduced maximum size
const TWINKLE_SPEED = 1.2;

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

// Convert 3D coordinates to spherical sky dome positions
const convertToSkyPosition = (star, planetPosition) => {
  // Calculate relative position from planet
  const dx = star.x - planetPosition.x;
  const dy = star.y - planetPosition.y;
  const dz = star.z - planetPosition.z;

  // Convert to spherical coordinates (as if viewing from planet surface)
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const phi = Math.atan2(dz, dx); // Azimuth angle
  const theta = Math.acos(dy / distance); // Polar angle

  // Project onto sky dome
  const x = SKY_RADIUS * Math.sin(theta) * Math.cos(phi);
  const y = SKY_RADIUS * Math.cos(theta);
  const z = SKY_RADIUS * Math.sin(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
};

// Individual star component with twinkling effect
const SkylineStar = ({
  star,
  onClick,
  onHover,
  isSelected,
  planetPosition,
  brightness,
  starSize,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [twinkleOffset] = useState(Math.random() * Math.PI * 2);

  const position = useMemo(
    () => convertToSkyPosition(star, planetPosition),
    [star, planetPosition]
  );

  // Calculate star size based on magnitude (brighter stars are bigger)
  const size = useMemo(() => {
    // Convert percentage to multiplier (e.g., 100% = 1.0, 150% = 1.5, 50% = 0.5)
    const sizeMultiplier = starSize / 100;

    const minSize = MIN_STAR_SIZE * sizeMultiplier;
    const maxSize = MAX_STAR_SIZE * sizeMultiplier;

    const baseSizeFromMag = Math.max(minSize, maxSize - star.mag * 0.02);
    let finalSize = baseSizeFromMag;

    if (isSelected) finalSize *= 3;
    if (hovered) finalSize *= 2;

    return finalSize;
  }, [star.mag, isSelected, hovered, starSize]);

  const color = getStarColorBySpectralType(star.spectral_type, star.color);

  // Simplified twinkling animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const sizeVariation =
        1 + Math.sin(time * TWINKLE_SPEED + twinkleOffset) * 0.3;
      meshRef.current.scale.setScalar(sizeVariation);
    }
  });

  return (
    <group position={position}>
      {/* Main star */}
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
        <sphereGeometry args={[size * 3, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Simple glow effect for bright stars */}
      {star.mag < 2 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[size * 5, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={Math.max(0.3, Math.min(1.0, brightness * 0.8))}
          />
        </mesh>
      )}

      {/* Star name label for very bright stars or when selected/hovered */}
      {(star.mag < 0.5 || isSelected || hovered) && (
        <Text
          position={[0, size * 3, 0]}
          fontSize={size * 8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {star.name}
        </Text>
      )}
    </group>
  );
};

// Night sky gradient background
const NightSkyBackground = () => {
  return (
    <mesh>
      <sphereGeometry args={[SKY_RADIUS * 1.5, 32, 16]} />
      <meshBasicMaterial
        color="#001122"
        side={THREE.BackSide}
        transparent
        opacity={0.8}
      />
    </mesh>
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
    <div className="absolute top-4 left-4 z-10 w-xs">
      <div className="bg-black bg-opacity-80 backdrop-blur-sm text-white p-4 rounded-lg border border-blue-400 shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-blue-300">
            Night Sky Navigator
          </h2>
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
                    {hoveredStar.distance_pc_from_planet?.toFixed(2) ||
                      "Unknown"}{" "}
                    pc
                  </p>
                  <p>
                    <span className="text-blue-300">Magnitude:</span>{" "}
                    {hoveredStar.mag}
                  </p>
                  <p>
                    <span className="text-blue-300">Spectral Type:</span>{" "}
                    {hoveredStar.spectral_type || "Unknown"}
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
                  onClick={onSave}
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

// Main StarMap Component with night sky view
const NightSkyStarMap = ({
  starData,
  magnitudeLimit,
  brightness,
  starSize,
}) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedStarsConnections, setSelectedStarsConnections] = useState([]); // new
  const [constellationName, setConstellationName] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const visibleStars = useMemo(() => {
    return starData.stars.filter((star) => star.mag >= magnitudeLimit);
  }, [starData.stars, magnitudeLimit]);

  const planetPosition = starData?.planet_coords_pc || { x: 0, y: 0, z: 0 };

  // Handle star click
  const handleStarClick = (star) => {
    setSelectedStars((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === star.id);

      if (existsIndex !== -1) {
        // Deselect: remove the star and any lines touching it
        setSelectedStarsConnections((conns) =>
          conns.filter(([a, b]) => a.id !== star.id && b.id !== star.id)
        );
        return prev.filter((s) => s.id !== star.id);
      }

      // Select: only connect from the last star in the list
      const last = prev[prev.length - 1];
      if (last) {
        setSelectedStarsConnections((conns) => {
          // Avoid duplicate connection if it already exists
          const alreadyExists = conns.some(
            ([a, b]) =>
              (a.id === last.id && b.id === star.id) ||
              (a.id === star.id && b.id === last.id)
          );
          if (!alreadyExists) {
            return [...conns, [last, star]];
          }
          return conns;
        });
      }

      return [...prev, star];
    });
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

    // Build stars array for schema
    const stars = selectedStars.map((s) => ({
      id: s.id,
      name: s.name,
      x: s.x,
      y: s.y,
      z: s.z,
      mag: s.mag,
      color: s.color,
      spectral_type: s.spectral_type,
      bv: s.bv,
      distance_pc_from_planet: s.distance_pc_from_planet ?? null,
      catalog_distance_pc: s.catalog_distance_pc ?? null,
      catalog_mag: s.catalog_mag ?? s.mag,
    }));

    // Build connections as index pairs (as required in schema)
    const connections = selectedStarsConnections.map(([a, b]) => {
      const aIndex = stars.findIndex((s) => s.id === a.id);
      const bIndex = stars.findIndex((s) => s.id === b.id);
      return [aIndex, bIndex];
    });

    const constellation = {
      name: constellationName,
      planet: starData?.planet,
      planet_coords_pc: starData?.planet_coords_pc,
      stars,
      connections,
      // ⚠️ createdBy will come from backend JWT (don’t send from client)
    };

    try {
      console.log("constellation (to send):", constellation);
      const response = await axiosPrivate.post("/constellation", constellation);
      console.log("Saved constellation:", response.data);

      // Reset selection
      setSelectedStars([]);
      setSelectedStarsConnections([]);
      setConstellationName("");
      toast.success("Constellation saved! 🌌 View it in the Gallery.");
    } catch (error) {
      console.error("Error saving constellation:", error);
      toast.error("Failed to save constellation. Please try again!");
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 ">
        <InfoPanel
          hoveredStar={hoveredStar}
          selectedStars={selectedStars}
          onSave={handleSaveConstellation}
          constellationName={constellationName}
          setConstellationName={setConstellationName}
        />
      </div>
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg text-sm z-10">
        <p>
          🌟 Click stars to select • 🔄 Drag to look around • 🔍 Scroll to zoom
        </p>
        <p className="text-xs text-gray-300 mt-1">
          You're viewing from the planet's surface
        </p>
      </div>

      <Canvas
        camera={{
          position: [15, 25, 2],
          fov: 75,
          near: 0.1,
          far: SKY_RADIUS * 2,
        }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color("#000428"))}
      >
        <ambientLight intensity={0.1 * brightness} color="#2244aa" />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.001}
          maxDistance={25}
          target={[0, 0, 0]}
          autoRotate={false}
          zoomSpeed={4}
          rotateSpeed={0.8}
        />

        <NightSkyBackground />
        <CentralPlanet planetData={starData} />
        <pointLight position={[2, 2, 2]} intensity={0.3} color="#ffffff" />

        {visibleStars.slice(0, 1500).map((star) => (
          <SkylineStar
            key={star.id}
            star={star}
            onClick={handleStarClick}
            onHover={setHoveredStar}
            isSelected={!!selectedStars.find((s) => s.id === star.id)}
            planetPosition={planetPosition}
            brightness={brightness} // ADD THIS
            starSize={starSize} // ADD THIS
          />
        ))}

        {/* Draw lines based on selected connections */}
        {selectedStarsConnections.map(([a, b], index) => {
          const points = [
            convertToSkyPosition(a, planetPosition),
            convertToSkyPosition(b, planetPosition),
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={index}>
              <primitive object={geometry} attach="geometry" />
              <lineBasicMaterial
                color="#ff6b35"
                transparent
                opacity={0.8}
                linewidth={2}
              />
            </line>
          );
        })}
      </Canvas>
    </div>
  );
};

export default NightSkyStarMap;
