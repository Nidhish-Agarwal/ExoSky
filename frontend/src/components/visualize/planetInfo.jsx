import React from "react";
import { Star, Eye, Map, Telescope } from "lucide-react";

const PlanetInfo = ({
  selectedPlanet,
  selectedPlanetData,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="space-y-6">
      {/* Planet Info */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {selectedPlanet}
            </h3>
            <p className="text-sm text-blue-300">
              {selectedPlanetData.distance}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Host Star:</span>
            <span className="text-white">{selectedPlanetData.hostname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Discovery Year:</span>
            <span className="text-white">{selectedPlanetData.disc_year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Discovery Method:</span>
            <span className="text-white">{selectedPlanetData.disc_method}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Compare with Earth</span>
          <button className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
            <Eye className="w-4 h-4" />
            <span>Show</span>
          </button>
        </div>
      </div>

      {/* View Mode Selection */}
      <div className="border-t border-slate-700 pt-6">
        <div className="space-y-3">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              viewMode === "static"
                ? "bg-blue-900/30 border border-blue-500"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
            onClick={() => setViewMode("static")}
          >
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">Static Chart</div>
              <div className="text-xs text-slate-400">
                Traditional star chart view
              </div>
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              viewMode === "planetarium"
                ? "bg-blue-900/30 border border-blue-500"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
            onClick={() => setViewMode("planetarium")}
          >
            <div className="w-6 h-6 bg-indigo-600 rounded-sm flex items-center justify-center">
              <Telescope className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">Planetarium</div>
              <div className="text-xs text-slate-400">
                Interactive dome projection
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;
