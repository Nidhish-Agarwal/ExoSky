import { Globe, Settings, Compass, Download } from "lucide-react";
import ViewControls from "./ViewControls";
import SkyOrientation from "./SkyOrientation";
import Export from "./export";
import PlanetInfo from "./planetInfo";

const Sidebar = ({
  sidebarSection,
  setSidebarSection,
  selectedPlanet,
  setSelectedPlanet,
  exoplanets,
  selectedPlanetData,
  viewMode,
  setViewMode,
  brightness,
  setBrightness,
  starSize,
  setStarSize,
  magnitudeLimit,
  setMagnitudeLimit,
  resetControls,
  applyPreset,
  horizontalPos,
  setHorizontalPos,
  verticalPos,
  setVerticalPos,
  skyRotation,
  setSkyRotation,
  isFullscreen,
  setIsFullscreen,
  exportFormat,
  setExportFormat,
  exportQuality,
  setExportQuality,
  includeLabels,
  setIncludeLabels,
  includeGrid,
  setIncludeGrid,
  includeExoplanetInfo,
  setIncludeExoplanetInfo,
}) => {
  const renderSidebarContent = () => {
    switch (sidebarSection) {
      case "planet-info":
        return (
          <PlanetInfo
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            exoplanets={exoplanets}
            selectedPlanetData={selectedPlanetData}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        );
      case "tools":
        return (
          <Tools
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        );
      case "view-controls":
        return (
          <ViewControls
            brightness={brightness}
            setBrightness={setBrightness}
            starSize={starSize}
            setStarSize={setStarSize}
            magnitudeLimit={magnitudeLimit}
            setMagnitudeLimit={setMagnitudeLimit}
            resetControls={resetControls}
            applyPreset={applyPreset}
          />
        );
      case "sky-orientation":
        return (
          <SkyOrientation
            horizontalPos={horizontalPos}
            setHorizontalPos={setHorizontalPos}
            verticalPos={verticalPos}
            setVerticalPos={setVerticalPos}
            skyRotation={skyRotation}
            setSkyRotation={setSkyRotation}
            resetControls={resetControls}
            applyPreset={applyPreset}
          />
        );
      case "export":
        return (
          <Export
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
            selectedPlanet={selectedPlanet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-gray-900/80 border-r border-gray-700/50 overflow-y-auto">
      <div className="p-6">
        {/* Sidebar Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1 overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap">
            {[
              { id: "planet-info", icon: Globe, label: "Planet" },
              { id: "view-controls", icon: Settings, label: "View" },
              { id: "sky-orientation", icon: Compass, label: "Orient" },
              { id: "export", icon: Download, label: "Export" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setSidebarSection(id)}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm transition-colors whitespace-nowrap ${
                  sidebarSection === id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:block">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {renderSidebarContent()}
      </div>
    </div>
  );
};

export default Sidebar;
