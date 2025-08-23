/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { X, Filter, Search, ChevronLeft, ChevronRight, Star, MapPin, Calendar, Dice5, ExternalLink, Navigation } from 'lucide-react';
import exoplanetsData from '../../../../backend/exoplanets.json';
import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const SearchPanel = ({ onPlanetSelect }) => {
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const planetsPerPage = 25;
    const navigate = useNavigate();
  // Filter state with more inclusive defaults
  const [filters, setFilters] = useState({
    searchTerm: '',
    maxDistance: 10000, // Increased to include more distant planets
    minYear: 0,         // Changed to include all years
    maxYear: new Date().getFullYear(),
    sortBy: 'distance',
    sortOrder: 'asc'
  });

  // Quick filter options
  const quickFilters = [
    { id: 'closest', label: 'Closest', sortBy: 'distance', sortOrder: 'asc' },
    { id: 'farthest', label: 'Farthest', sortBy: 'distance', sortOrder: 'desc' },
    { id: 'newest', label: 'Newest', sortBy: 'year', sortOrder: 'desc' },
    { id: 'oldest', label: 'Oldest', sortBy: 'year', sortOrder: 'asc' },
    { id: 'fastest', label: 'Fastest Orbit', sortBy: 'orbit', sortOrder: 'asc' },
    { id: 'slowest', label: 'Slowest Orbit', sortBy: 'orbit', sortOrder: 'desc' }
  ];

  // Flatten planets data
  const getAllPlanets = () => {
    return exoplanetsData.flatMap(system => 
      system.planets.map(planet => ({
        ...planet,
        hostname: system.hostname,
        distance_ly: system.distance_ly,
        systemData: system
      }))
    );
  };

  // Apply filters when search is triggered
  const applyFilters = () => {
    setIsLoading(true);
    
    // Use setTimeout to allow UI to update before heavy operation
    setTimeout(() => {
      const allPlanets = getAllPlanets();

      // Apply filters
      let results = allPlanets.filter(planet => {
        // Search filter
        const matchesSearch = filters.searchTerm === '' || 
          planet.pl_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          planet.hostname.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        // Distance filter
        const matchesDistance = planet.distance_ly <= filters.maxDistance;
        
        // Year filter
        const matchesYear = planet.disc_year >= filters.minYear && 
                           planet.disc_year <= filters.maxYear;
        
        return matchesSearch && matchesDistance && matchesYear;
      });

      // Apply sorting
      results.sort((a, b) => {
        let valueA, valueB;
        
        switch (filters.sortBy) {
          case 'distance':
            valueA = a.distance_ly;
            valueB = b.distance_ly;
            break;
          case 'year':
            valueA = a.disc_year;
            valueB = b.disc_year;
            break;
          case 'orbit':
            valueA = a.pl_orbper || 0;
            valueB = b.pl_orbper || 0;
            break;
          default:
            valueA = a.distance_ly;
            valueB = b.distance_ly;
        }
        
        return filters.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });

      setFilteredPlanets(results);
      setCurrentPage(1);
      setHasSearched(true);
      setIsResultsOpen(true);
      setIsLoading(false);
    }, 0);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setFilters({...filters, searchTerm: value});
    
    if (value.length > 1) {
      const allPlanets = getAllPlanets();
      const suggestions = allPlanets.filter(planet => 
        planet.pl_name.toLowerCase().includes(value.toLowerCase()) ||
        planet.hostname.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (planet) => {
    setFilters({...filters, searchTerm: planet.pl_name});
    setSelectedPlanet(planet);
    setShowSuggestions(false);
  };

  // Apply quick filter
  const applyQuickFilter = (sortBy, sortOrder) => {
    setFilters({
      ...filters,
      sortBy,
      sortOrder
    });
    
    const allPlanets = getAllPlanets();
    
    let results = allPlanets.filter(planet => {
      // Search filter - ADDED
      const matchesSearch = filters.searchTerm === '' || 
        planet.pl_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        planet.hostname.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Distance filter
      const matchesDistance = planet.distance_ly <= filters.maxDistance;
      
      // Year filter
      const matchesYear = planet.disc_year >= filters.minYear && 
                         planet.disc_year <= filters.maxYear;
      
      return matchesSearch && matchesDistance && matchesYear; // UPDATED
    });

    results.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'distance':
          valueA = a.distance_ly;
          valueB = b.distance_ly;
          break;
        case 'year':
          valueA = a.disc_year;
          valueB = b.disc_year;
          break;
        case 'orbit':
          valueA = a.pl_orbper || 0;
          valueB = b.pl_orbper || 0;
          break;
        default:
          valueA = a.distance_ly;
          valueB = b.distance_ly;
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });

    setFilteredPlanets(results);
    setCurrentPage(1);
    setHasSearched(true);
    setIsResultsOpen(true);
  };

  // Random planet selection
  const selectRandomPlanet = () => {
    const allPlanets = getAllPlanets();
    const randomIndex = Math.floor(Math.random() * allPlanets.length);
    const randomPlanet = allPlanets[randomIndex];
    
    setFilteredPlanets([randomPlanet]);
    setCurrentPage(1);
    setHasSearched(true);
    setIsResultsOpen(true);
  };

  // Close results popup
  const closeResults = () => {
    setIsResultsOpen(false);
  };

  // Handle planet selection from search results
  const handlePlanetSelect = (planet) => {
    setFilters({...filters, searchTerm: planet.pl_name});
    setSelectedPlanet(planet);
    setIsResultsOpen(false);
  };


const navigateToVisualization = () => {
  if (selectedPlanet) {
    // Format planet name for URL (replace spaces with %20)
    const planetNameForUrl = selectedPlanet.pl_name.replace(/\s+/g, '%20');
    navigate(`/visualize/${planetNameForUrl}`);
  }
};

  // Pagination calculations
  const indexOfLastPlanet = currentPage * planetsPerPage;
  const indexOfFirstPlanet = indexOfLastPlanet - planetsPerPage;
  const currentPlanets = filteredPlanets.slice(indexOfFirstPlanet, indexOfLastPlanet);
  const totalPages = Math.ceil(filteredPlanets.length / planetsPerPage);

  // Filter modal component
  const FilterModal = () => {
    if (!isFilterOpen) return null;

    return (
      <div ref={onPlanetSelect} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cyan-500/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 sticky top-0 bg-gray-900/90 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white">Advanced Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Options */}
          <div className="p-6 space-y-6">
            {/* Distance Filter */}
            <div>
              <label className="block text-cyan-300 mb-2">
                Maximum Distance: {filters.maxDistance} light years
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.maxDistance}
                onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                className="w-full h-2 bg-cyan-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-cyan-400 mt-1">
                <span>0 ly</span>
                <span>10000 ly</span>
              </div>
            </div>

            {/* Year Range */}
            <div>
              <h3 className="text-cyan-300 mb-3">Discovery Year Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 mb-2 text-sm">From</label>
                  <input
                    type="number"
                    min="0"
                    max={new Date().getFullYear()}
                    value={filters.minYear}
                    onChange={(e) => setFilters({...filters, minYear: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800/70 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 mb-2 text-sm">To</label>
                  <input
                    type="number"
                    min="0"
                    max={new Date().getFullYear()}
                    value={filters.maxYear}
                    onChange={(e) => setFilters({...filters, maxYear: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800/70 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between p-6 border-t border-cyan-500/20">
            <button
              onClick={() => {
                setFilters({
                  searchTerm: '',
                  maxDistance: 10000,
                  minYear: 0,
                  maxYear: new Date().getFullYear(),
                  sortBy: 'distance',
                  sortOrder: 'asc'
                });
              }}
              className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600/70 rounded-lg text-white transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                applyFilters();
                setIsFilterOpen(false);
              }}
              className="px-4 py-2 bg-cyan-600/70 hover:bg-cyan-500/70 rounded-lg text-white transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Results popup component
  const ResultsPopup = () => {
    if (!isResultsOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col border border-cyan-500/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
            <h2 className="text-xl font-bold text-white">
              Search Results: {filteredPlanets.length} planets found
            </h2>
            <button onClick={closeResults} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="p-3 border-b border-cyan-500/20">
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => applyQuickFilter(filter.sortBy, filter.sortOrder)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.sortBy === filter.sortBy && filters.sortOrder === filter.sortOrder
                      ? 'bg-cyan-600/70 text-white'
                      : 'bg-gray-700/70 text-cyan-300 hover:bg-gray-600/70'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="p-3 border-b border-cyan-500/20 flex justify-between items-center text-sm text-cyan-300">
            <span>
              Showing {Math.min(planetsPerPage, currentPlanets.length)} of {filteredPlanets.length} planets
              {currentPage > 1 && ` (Page ${currentPage}/${totalPages})`}
            </span>
          </div>

          {/* Planets Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-6">
                <div className="text-cyan-300 text-lg mb-2">Loading planets...</div>
                <p className="text-gray-400 text-sm">Please wait while we process your search</p>
              </div>
            ) : filteredPlanets.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-cyan-300 text-lg mb-2">No planets found matching your criteria</div>
                <p className="text-gray-400 text-sm">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentPlanets.map((planet) => (
                  <div
                    key={`${planet.hostname}-${planet.pl_name}`}
                    onClick={() => handlePlanetSelect(planet)}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer hover:scale-105 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-white truncate">{planet.pl_name}</h3>
                      <ExternalLink className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                    </div>
                    <p className="text-cyan-300 text-xs mb-2 truncate">Around {planet.hostname}</p>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <MapPin className="w-3 h-3" />
                        <span>{planet.distance_ly} ly</span>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Calendar className="w-3 h-3" />
                        <span>{planet.disc_year}</span>
                      </div>
                      {planet.pl_orbper && (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Star className="w-3 h-3" />
                          <span>{planet.pl_orbper}d orbit</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-cyan-500/20 flex justify-center items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gray-700/70 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-cyan-300 text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gray-700/70 transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-transparent p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Exoplanet Explorer</h1>
        <p className="text-cyan-200/80 text-sm md:text-base">
          Discover {getAllPlanets().length} planets beyond our solar system
        </p>
      </div>

      {/* Search Controls */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for planets or stars..."
            value={filters.searchTerm}
            onChange={handleSearchInput}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => filters.searchTerm.length > 1 && setShowSuggestions(true)}
            className="w-full pl-10 pr-20 py-3 bg-gray-800/70 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 backdrop-blur-sm"
          />
          
          {/* Go button that appears when a planet is selected */}
          {selectedPlanet && (
  <Link
    to={`/visualize/${encodeURIComponent(selectedPlanet.pl_name)}`}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-600/70 hover:bg-cyan-500/70 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
    title="View this planet in 3D"
  >
    <Navigation className="w-8 h-5" />
    <span className="hidden sm:inline">Visualize</span>
  </Link>
)}
          
          {/* Search suggestions dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800/90 backdrop-blur-lg border border-cyan-500/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchSuggestions.map((planet, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(planet)}
                  className="px-4 py-3 cursor-pointer hover:bg-cyan-900/50 transition-colors border-b border-cyan-500/20 last:border-b-0"
                >
                  <div className="font-medium text-white">{planet.pl_name}</div>
                  <div className="text-sm text-cyan-300">Around {planet.hostname} • {planet.distance_ly} ly</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => applyQuickFilter(filter.sortBy, filter.sortOrder)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors backdrop-blur-sm ${
                  filters.sortBy === filter.sortBy && filters.sortOrder === filter.sortOrder
                    ? 'bg-cyan-600/70 text-white'
                    : 'bg-gray-700/50 text-cyan-300 hover:bg-gray-600/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-3 py-1.5 bg-cyan-600/60 hover:bg-cyan-500/60 text-white rounded-lg text-xs md:text-sm flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Filter className="w-4 h-4" />
              Advanced
            </button>
            
            <button
              onClick={selectRandomPlanet}
              className="px-3 py-1.5 bg-purple-600/60 hover:bg-purple-500/60 text-white rounded-lg text-xs md:text-sm flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Dice5 className="w-4 h-4" />
              Random
            </button>
            
            <button
              onClick={applyFilters}
              className="px-3 py-1.5 bg-green-600/60 hover:bg-green-500/60 text-white rounded-lg text-xs md:text-sm flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Search className="w-4 h-4" />
              Search All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal />
      
      {/* Results Popup */}
      <ResultsPopup />
    </div>
  );
};

export default SearchPanel;