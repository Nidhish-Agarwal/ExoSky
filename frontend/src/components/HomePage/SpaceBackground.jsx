import React, { useEffect, useState } from 'react';

const SpaceBackground = () => {
  const [stars, setStars] = useState([]);
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    // Create stars
    const newStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setStars(newStars);

    // Create realistic asteroids
    const newAsteroids = Array.from({ length: 20 }, (_, i) => {
      const size = Math.random() * 40 + 20;
      return {
        id: i,
        size,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        delay: Math.random() * 3,
        duration: Math.random() * 30 + 20,
        moveX: (Math.random() - 0.5) * 0.8,
        moveY: (Math.random() - 0.5) * 0.5,
        speed: Math.random() * 0.5 + 0.3,
        shape: Math.floor(Math.random() * 4), // Different asteroid shapes
        color: `rgb(${Math.random() * 30 + 80}, ${Math.random() * 30 + 80}, ${Math.random() * 30 + 90})`
      };
    });
    setAsteroids(newAsteroids);
  }, []);

  // Function to generate different asteroid shapes
  const getAsteroidShape = (shapeId, size) => {
    const baseStyle = `absolute w-full h-full rounded-full`;
    
    switch(shapeId) {
      case 0:
        return (
          <>
            <div className={`${baseStyle} bg-gray-800`}></div>
            <div className={`${baseStyle} bg-gray-700 w-3/4 h-3/4 m-auto mt-2`}></div>
            <div className={`${baseStyle} bg-gray-900 w-1/3 h-1/3 ml-3 mt-6`}></div>
          </>
        );
      case 1:
        return (
          <>
            <div className={`${baseStyle} bg-gray-800`} style={{clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 50% 100%, 10% 70%, 0% 35%, 20% 10%)'}}></div>
            <div className={`${baseStyle} bg-gray-700 w-2/3 h-2/3 m-auto mt-3`} style={{clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 50% 100%, 10% 70%, 0% 35%, 20% 10%)'}}></div>
          </>
        );
      case 2:
        return (
          <>
            <div className={`${baseStyle} bg-gray-800`} style={{borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'}}></div>
            <div className={`${baseStyle} bg-gray-700 w-3/4 h-3/4 m-auto mt-1 ml-2`} style={{borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'}}></div>
          </>
        );
      default:
        return (
          <>
            <div className={`${baseStyle} bg-gray-800`} style={{borderRadius: '40%'}}></div>
            <div className={`${baseStyle} bg-gray-700 w-2/3 h-2/3 m-auto mt-4`} style={{borderRadius: '40%'}}></div>
            <div className={`${baseStyle} bg-gray-900 w-1/4 h-1/4 ml-5 mt-1`} style={{borderRadius: '40%'}}></div>
          </>
        );
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-[#0a0a1a] to-[#000005] overflow-hidden -z-10">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star"
          style={{
            left: `${Math.random() * 20}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 50 + 30}px`,
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${Math.random() * 2 + 1}s`
          }}
        />
      ))}
      
      {/* Asteroids */}
      {asteroids.map(asteroid => (
        <div
          key={asteroid.id}
          className="absolute animate-asteroid-float"
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            left: `${asteroid.x}%`,
            top: `${asteroid.y}%`,
            animationDelay: `${asteroid.delay}s`,
            animationDuration: `${asteroid.duration}s`,
            color: asteroid.color
          }}
        >
          {getAsteroidShape(asteroid.shape, asteroid.size)}
        </div>
      ))}
      
      {/* Distant Galaxy */}
      <div className="absolute w-80 h-80 top-1/4 right-1/4 bg-radial-galaxy animate-pulse-slow" />
      
      {/* Add animation keyframes via style tag */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes asteroid-float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) rotate(90deg); }
            50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) rotate(180deg); }
            75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          @keyframes shooting-star {
            0% { opacity: 0; transform: translateX(0) translateY(0); }
            10% { opacity: 1; }
            100% { opacity: 0; transform: translateX(100vw) translateY(30vh); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          .bg-radial-galaxy {
            background: radial-gradient(circle at center, rgba(100, 100, 255, 0.15) 0%, transparent 70%);
            border-radius: 50%;
          }
          .animate-twinkle {
            animation: twinkle infinite ease-in-out;
          }
          .animate-asteroid-float {
            animation: asteroid-float infinite linear;
          }
          .animate-shooting-star {
            animation: shooting-star infinite ease-out;
          }
          .animate-pulse-slow {
            animation: pulse-slow 20s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SpaceBackground;