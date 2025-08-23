import React, { useState } from "react";
import {
  Users,
  Search,
  Book,
  Grid3X3,
  Satellite,
  Menu,
  X,
  Settings,
} from "lucide-react";

const Navbar = ({
  onLearnClick,
  onGalleryClick,
  onProfileClick,
  onSettingsClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand Name - Left side */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ExoSky
          </span>
        </div>

        {/* Desktop Navigation Buttons - Right side */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <button
            onClick={onLearnClick}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-3 py-2 rounded-lg"
          >
            <Book className="w-4 h-4" />
            <span className="hidden lg:inline">Learn</span>
          </button>
          <button
            onClick={onGalleryClick}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-3 py-2 rounded-lg"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden lg:inline">Gallery</span>
          </button>
          <button
            onClick={onSettingsClick}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-3 py-2 rounded-lg"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Settings</span>
          </button>

          {/* Profile Button - Far right */}
          <button
            onClick={onProfileClick}
            className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Users className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-cyan-500/30">
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={() => {
                onLearnClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-gray-300 hover:text-white transition-colors flex items-center gap-3 hover:bg-cyan-900/30 px-4 py-3 rounded-lg"
            >
              <Book className="w-5 h-5" />
              Learn
            </button>
            <button
              onClick={() => {
                onGalleryClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-gray-300 hover:text-white transition-colors flex items-center gap-3 hover:bg-cyan-900/30 px-4 py-3 rounded-lg"
            >
              <Grid3X3 className="w-5 h-5" />
              Gallery
            </button>
            <button
              onClick={() => {
                onProfileClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-gray-300 hover:text-white transition-colors flex items-center gap-3 hover:bg-cyan-900/30 px-4 py-3 rounded-lg"
            >
              <Users className="w-5 h-5" />
              Profile
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
