import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import StarCanvas from "./StarCanvas";


const ExoSkyExplorer = () => {
  const [selectedPlanet, setSelectedPlanet] = useState("Kepler-452b");
  const [viewMode, setViewMode] = useState("planetarium");
  const [sidebarSection, setSidebarSection] = useState("planet-info");
  const [showStarTooltip, setShowStarTooltip] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [starSize, setStarSize] = useState(100);
  const [magnitudeLimit, setMagnitudeLimit] = useState(6.0);
  const [horizontalPos, setHorizontalPos] = useState(0);
  const [verticalPos, setVerticalPos] = useState(0);
  const [skyRotation, setSkyRotation] = useState(0);
  const [exportFormat, setExportFormat] = useState("PNG Image");
  const [exportQuality, setExportQuality] = useState("High (Poster)");
  const [includeLabels, setIncludeLabels] = useState(true);
  const [includeGrid, setIncludeGrid] = useState(false);
  const [includeExoplanetInfo, setIncludeExoplanetInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const exoplanets = [
    {
      name: "Kepler-452b",
      distance: "1402 light years away",
      hostStar: "Kepler-452",
      constellation: "Cygnus",
      type: "Super Earth",
    },
  ];

  const selectedPlanetData =
    exoplanets.find((p) => p.name === selectedPlanet) || exoplanets[0];

  const stars = [
    {
      name: "Arcturus",
      magnitude: -0.1,
      type: "Orange Giant",
      distance: 36.7,
      temperature: 4500,
      x: 0.6,
      y: 0.35,
      color: "#FFA500",
    },
    {
      name: "Vega",
      magnitude: 0.03,
      type: "Main Sequence",
      distance: 25.3,
      temperature: 9600,
      x: 0.3,
      y: 0.2,
      color: "#B0E0E6",
    },
    {
      name: "Sirius",
      magnitude: -1.46,
      type: "Main Sequence",
      distance: 8.6,
      temperature: 9940,
      x: 0.8,
      y: 0.7,
      color: "#87CEEB",
    },
    {
      name: "Betelgeuse",
      magnitude: 0.5,
      type: "Red Supergiant",
      distance: 642,
      temperature: 3500,
      x: 0.15,
      y: 0.8,
      color: "#FF4500",
    },
    {
      name: "Capella",
      magnitude: 0.08,
      type: "Giant",
      distance: 42.9,
      temperature: 5200,
      x: 0.85,
      y: 0.25,
      color: "#FFFF99",
    },
  ];

  const resetControls = () => {
    setBrightness(100);
    setStarSize(100);
    setMagnitudeLimit(6.0);
    setHorizontalPos(0);
    setVerticalPos(0);
    setSkyRotation(0);
  };

  const applyPreset = (preset) => {
    switch (preset) {
      case "City View":
        setBrightness(50);
        setMagnitudeLimit(3.0);
        break;
      case "Dark Sky":
        setBrightness(150);
        setMagnitudeLimit(8.0);
        break;
      case "North":
        setHorizontalPos(0);
        setVerticalPos(0);
        setSkyRotation(0);
        break;
      case "East":
        setSkyRotation(90);
        break;
      case "South":
        setSkyRotation(180);
        break;
      case "West":
        setSkyRotation(270);
        break;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white">
      <div className="flex h-screen">
        <Sidebar
          sidebarSection={sidebarSection}
          setSidebarSection={setSidebarSection}
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
          exoplanets={exoplanets}
          selectedPlanetData={selectedPlanetData}
          viewMode={viewMode}
          setViewMode={setViewMode}
          brightness={brightness}
          setBrightness={setBrightness}
          starSize={starSize}
          setStarSize={setStarSize}
          magnitudeLimit={magnitudeLimit}
          setMagnitudeLimit={setMagnitudeLimit}
          resetControls={resetControls}
          applyPreset={applyPreset}
          horizontalPos={horizontalPos}
          setHorizontalPos={setHorizontalPos}
          verticalPos={verticalPos}
          setVerticalPos={setVerticalPos}
          skyRotation={skyRotation}
          setSkyRotation={setSkyRotation}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportQuality={exportQuality}
          setExportQuality={setExportQuality}
          includeLabels={includeLabels}
          setIncludeLabels={setIncludeLabels}
          includeGrid={includeGrid}
          setIncludeGrid={setIncludeGrid}
          includeExoplanetInfo={includeExoplanetInfo}
          setIncludeExoplanetInfo={setIncludeExoplanetInfo}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header viewMode={viewMode} selectedPlanet={selectedPlanet} />
          <StarCanvas
            stars={stars}
            brightness={brightness}
            starSize={starSize}
            magnitudeLimit={magnitudeLimit}
            selectedPlanet={selectedPlanet}
            horizontalPos={horizontalPos}
            verticalPos={verticalPos}
            skyRotation={skyRotation}
            showStarTooltip={showStarTooltip}
            setShowStarTooltip={setShowStarTooltip}
          />
        </div>
      </div>
    </div>
  );
};

export default ExoSkyExplorer;