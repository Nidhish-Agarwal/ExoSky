// pages/Explore.jsx
import React, { useState, useRef } from "react";
import SpaceBackground from "../components/HomePage/SpaceBackground";
import Navbar from "../components/HomePage/Navbar";
import StatsPanel from "../components/HomePage/StatsPanel";
import SearchPanel from "../components/HomePage/SearchPanel";
import ExoplanetGrid from "../components/HomePage/Exoplanetgrid";
import AIChatBot from "../components/HomePage/AIChatBot";
import exoplanetsData from "../components/HomePage/ExoplanetsData";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const searchRef = useRef(null);
  const galleryRef = useRef(null);
  const navigate = useNavigate();

  const handleLearnMore = (planet) => {
    setSelectedPlanet(planet);
    setShowChat(true);
  };

  const handleVisualizeClick = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnClick = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGalleryClick = () => {
    navigate("/gallary");
  };

  const onSettingsClick = () => {
    navigate("/settings");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  return (
    <div className="w-full min-h-screen text-white relative overflow-hidden">
      <SpaceBackground />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-blue-900/20 to-black -z-10" />

      <Navbar
        onVisualizeClick={handleVisualizeClick}
        onLearnClick={handleLearnClick}
        onGalleryClick={handleGalleryClick}
        onProfileClick={handleProfileClick}
        onSettingsClick={onSettingsClick}
      />

      <div className="mt-12">
        <StatsPanel />
        <SearchPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchRef={searchRef}
        />
        <ExoplanetGrid
          exoplanets={exoplanetsData}
          onLearnMore={handleLearnMore}
          galleryRef={galleryRef}
        />
      </div>

      <AIChatBot
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        selectedPlanet={selectedPlanet}
      />
    </div>
  );
};

export default Explore;
