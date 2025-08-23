import React, { useRef, useEffect } from "react";
import { Maximize } from "lucide-react";
import StarTooltip from "./StarTooltip";

const StarCanvas = ({
  stars,
  brightness,
  starSize,
  magnitudeLimit,
  selectedPlanet,
  horizontalPos,
  verticalPos,
  skyRotation,
  showStarTooltip,
  setShowStarTooltip,
  isFullscreen,
  setIsFullscreen
}) => {
  const canvasRef = useRef(null);

  // Render star field
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas with dark background
    ctx.fillStyle = "#0a0f1c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply rotation and positioning transforms
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((skyRotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.translate(horizontalPos, verticalPos);

    // Draw background stars
    const numBackgroundStars = 200;
    for (let i = 0; i < numBackgroundStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * (brightness / 100)})`;
      ctx.fill();
    }

    // Draw main stars
    stars.forEach((star, index) => {
      if (star.magnitude > magnitudeLimit) return;

      const x = star.x * canvas.width;
      const y = star.y * canvas.height;
      const baseSize = Math.max(2, 8 - star.magnitude) * (starSize / 100);

      // Draw star glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, baseSize * 3);
      gradient.addColorStop(0, star.color + "AA");
      gradient.addColorStop(0.5, star.color + "44");
      gradient.addColorStop(1, star.color + "00");

      ctx.fillStyle = gradient;
      ctx.fillRect(
        x - baseSize * 3,
        y - baseSize * 3,
        baseSize * 6,
        baseSize * 6
      );

      // Draw star core
      ctx.beginPath();
      ctx.arc(x, y, baseSize, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();

      // Draw star spikes for bright stars
      if (star.magnitude < 0) {
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - baseSize * 2, y);
        ctx.lineTo(x + baseSize * 2, y);
        ctx.moveTo(x, y - baseSize * 2);
        ctx.lineTo(x, y + baseSize * 2);
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [
    brightness,
    starSize,
    magnitudeLimit,
    selectedPlanet,
    horizontalPos,
    verticalPos,
    skyRotation,
    stars,
  ]);

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Check if click is on a star
    const clickedStar = stars.find((star) => {
      const distance = Math.sqrt(
        Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2)
      );
      return distance < 0.05;
    });

    if (clickedStar) {
      setShowStarTooltip({
        star: clickedStar,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    } else {
      setShowStarTooltip(null);
    }
  };

  const handleFullscreen = async () => {
    const container = canvasRef.current.parentElement;
    
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <div className="flex-1 relative bg-gray-900">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
      />

      {/* Star Tooltip */}
      {showStarTooltip && (
        <StarTooltip
          showStarTooltip={showStarTooltip}
          setShowStarTooltip={setShowStarTooltip}
        />
      )}

      {/* Fullscreen Button - Top Left Corner */}
      <div className="absolute top-4 left-4">
        <button
          onClick={handleFullscreen}
          className="flex items-center justify-center w-10 h-10 bg-gray-900/80 hover:bg-gray-800/90 rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-gray-900/80 px-3 py-2 rounded-lg">
        Click and drag to pan • Scroll to zoom • Click stars for details
      </div>
    </div>
  );
};

export default StarCanvas;