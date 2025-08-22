// components/HomePage/Navbar.jsx
import React from 'react';
import { Users, Telescope, Search, Book, Grid3X3, Satellite } from 'lucide-react';

const Navbar = ({ onVisualizeClick, onLearnClick, onGalleryClick, onProfileClick }) => (
  <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-cyan-500/30">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
          <Satellite className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          ExoSky
        </span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <button 
          onClick={onVisualizeClick}
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-4 py-2 rounded-lg"
        >
          <Search className="w-4 h-4" />
          Visualize
        </button>
        <button 
          onClick={onLearnClick}
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-4 py-2 rounded-lg"
        >
          <Book className="w-4 h-4" />
          Learn
        </button>
        <button 
          onClick={onGalleryClick}
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 hover:bg-cyan-900/30 px-4 py-2 rounded-lg"
        >
          <Grid3X3 className="w-4 h-4" />
          Gallery
        </button>
      </div>
      
      <button 
        onClick={onProfileClick}
        className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Users className="w-5 h-5 text-white" />
      </button>
    </div>
  </nav>
);

export default Navbar;