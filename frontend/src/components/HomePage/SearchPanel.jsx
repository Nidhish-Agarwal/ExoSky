// components/HomePage/SearchPanel.jsx
import React from 'react';
import { Search, Filter, Satellite } from 'lucide-react';

const SearchPanel = ({ searchTerm, setSearchTerm, onOpenFilters, searchRef }) => (
  <section ref={searchRef} className="py-16 px-6 bg-black/20">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 text-sm">Cosmic Database Access</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Explore the Cosmos</h2>
        <p className="text-cyan-200 max-w-2xl mx-auto">
          Search through thousands of documented exoplanets and celestial bodies
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search exoplanets (Kepler-452b, TRAPPIST-1e, etc.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-black/40 border border-cyan-500/40 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors backdrop-blur-sm"
          />
        </div>
        <button 
          onClick={onOpenFilters}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center sm:justify-start transform hover:-translate-y-0.5"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {['Earth-like', 'Habitable Zone', 'Super Earth', 'Gas Giant', 'Rocky', 'Water World'].map((tag, index) => (
          <button 
            key={index} 
            className="px-4 py-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 rounded-full text-cyan-300 hover:text-white transition-all duration-300 text-sm transform hover:-translate-y-0.5"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default SearchPanel;