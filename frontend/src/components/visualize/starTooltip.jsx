import React from "react";
import { Star, Compass, Zap, X } from "lucide-react";

const StarTooltip = ({ showStarTooltip, setShowStarTooltip }) => {
  return (
    <div
      className="absolute bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-10 max-w-xs"
      style={{
        left:
          showStarTooltip.x > window.innerWidth - 300
            ? showStarTooltip.x - 310 // shift left if too close to right edge
            : showStarTooltip.x + 10,
        top:
          showStarTooltip.y < 220
            ? showStarTooltip.y + 20 // if too close to top, push below instead
            : showStarTooltip.y - 220, // default: show above
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">
          {showStarTooltip.star.name}
        </h3>
        <button
          onClick={() => setShowStarTooltip(null)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-400">Magnitude:</span>
          <span className="text-white">
            {showStarTooltip.star.magnitude}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: showStarTooltip.star.color }}
          ></div>
          <span className="text-gray-400">Star Type:</span>
          <span className="text-white">
            {showStarTooltip.star.type}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span className="text-gray-400">Distance:</span>
          <span className="text-white">
            {showStarTooltip.star.distance} light years
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-red-400" />
          <span className="text-gray-400">Temperature:</span>
          <span className="text-white">
            {showStarTooltip.star.temperature.toLocaleString()} K
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <p className="text-xs text-gray-400">
          {showStarTooltip.star.name} is a{" "}
          {showStarTooltip.star.type.toLowerCase()} located{" "}
          {showStarTooltip.star.distance} light years away from this
          exoplanet.
        </p>

        <div className="flex items-center space-x-2 mt-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: showStarTooltip.star.color }}
          ></div>
          <span className="text-xs text-gray-400">
            Actual star color
          </span>
        </div>
      </div>
    </div>
  );
};

export default StarTooltip;