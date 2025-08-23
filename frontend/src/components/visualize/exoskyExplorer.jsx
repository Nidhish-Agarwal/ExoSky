import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import NightSkyStarMap from "../StarMap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect } from "react";

const ExoSkyExplorer = () => {
  const { plName } = useParams();
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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    console.log(plName);
    if (!plName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosPrivate.get(
          `/visualization/exosky/${encodeURIComponent(plName)}`
        );
        console.log(response.data);

        setData(response.data);
        setSelectedPlanet(response.data.planet);
      } catch (err) {
        console.error("Error fetching exosky:", err);
        setError(
          err.response?.data?.error || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plName]);

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
      {loading && (
        <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg shadow-md animate-pulse">
          <p className="text-gray-500 text-lg">Loading planet data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-2">Error fetching data</h2>
          <p>{error}</p>
        </div>
      )}
      {data && (
        <div className="flex h-screen">
          <Sidebar
            sidebarSection={sidebarSection}
            setSidebarSection={setSidebarSection}
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            exoplanets={data.planet}
            selectedPlanetData={data.planet_data}
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
            <NightSkyStarMap
              starData={data}
              magnitudeLimit={magnitudeLimit}
              brightness={brightness}
              starSize={starSize}
            />
            {/* <StarCanvas
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
          /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExoSkyExplorer;
