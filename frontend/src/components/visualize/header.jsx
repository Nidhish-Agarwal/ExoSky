import React from "react";
import { Telescope } from "lucide-react";

const Header = ({ viewMode, selectedPlanet }) => {
  return (
    <div className="border-b border-slate-700/30 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <Telescope className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-slate-100">
            {viewMode === "planetarium"
              ? "Planetarium View"
              : "Static View"}
          </span>
          <span className="text-slate-400 text-sm">
            from {selectedPlanet}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span>Sky Map</span>
            <span className="text-slate-100">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;