import React from "react";
import { Navigation, RotateCcw, Move3D } from "lucide-react";

const SkyOrientation = ({
  horizontalPos,
  setHorizontalPos,
  verticalPos,
  setVerticalPos,
  skyRotation,
  setSkyRotation,
  resetControls,
  applyPreset
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Sky Orientation
        </h3>
        <button
          onClick={resetControls}
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Position Controls */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <label className="text-sm font-medium text-slate-300">
            Horizontal Position
          </label>
          <span className="text-sm text-slate-400">{horizontalPos}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={horizontalPos}
          onChange={(e) => setHorizontalPos(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Move left and right across the sky
        </p>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Move3D className="w-4 h-4 text-indigo-400" />
          <label className="text-sm font-medium text-slate-300">
            Vertical Position
          </label>
          <span className="text-sm text-slate-400">{verticalPos}°</span>
        </div>
        <input
          type="range"
          min="-90"
          max="90"
          value={verticalPos}
          onChange={(e) => setVerticalPos(parseInt(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Move up and down in the sky
        </p>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <label className="text-sm font-medium text-slate-300">
            Sky Rotation
          </label>
          <span className="text-sm text-slate-400">{skyRotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={skyRotation}
          onChange={(e) => setSkyRotation(parseInt(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Rotate the entire view
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["North", "East", "South", "West"].map((direction) => (
            <button
              key={direction}
              onClick={() => applyPreset(direction)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors border border-slate-600/50 hover:border-blue-500/50"
            >
              {direction}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkyOrientation;