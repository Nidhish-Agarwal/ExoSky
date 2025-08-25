import React from "react";
import { RotateCcw } from "lucide-react";

const ViewControls = ({
  brightness,
  setBrightness,
  starSize,
  setStarSize,
  magnitudeLimit,
  setMagnitudeLimit,
  resetControls,
  applyPreset
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          View Controls
        </h3>
        <button
          onClick={resetControls}
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Brightness Control */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">
            Brightness
          </label>
          <span className="text-sm text-gray-400">{brightness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Dim</span>
          <span>Bright</span>
        </div>
      </div>

      {/* Star Size Control */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">
            Star Size
          </label>
          <span className="text-sm text-gray-400">{starSize}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="200"
          value={starSize}
          onChange={(e) => setStarSize(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      {/* Magnitude Limit */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">
            Magnitude Limit
          </label>
          <span className="text-sm text-gray-400">{magnitudeLimit}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={magnitudeLimit}
          onChange={(e) => setMagnitudeLimit(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Bright</span>
          <span>Faint</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset("City View")}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            City View
          </button>
          <button
            onClick={() => applyPreset("Dark Sky")}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Dark Sky
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewControls;