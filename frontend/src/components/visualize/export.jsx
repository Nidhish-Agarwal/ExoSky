import React, { useRef, useCallback } from "react";
import { Download, Check } from "lucide-react";

const Export = ({
  exportQuality = "High (Poster)",
  setExportQuality,
  includeLabels = true,
  setIncludeLabels,
  includeGrid = false,
  setIncludeGrid,
  includeExoplanetInfo = true,
  setIncludeExoplanetInfo,
  selectedPlanet = "Earth",
  canvasRef, 
  skyViewData 
}) => {
  const hiddenCanvasRef = useRef(null);

  // Calculate estimated file size based on quality
  const getEstimatedSize = useCallback(() => {
    const qualityMultiplier = {
      "High (Poster)": 1.0,
      "Medium (Screen)": 0.6,
      "Low (Web)": 0.3
    };
    const baseSize = 5.6; // MB
    return (baseSize * qualityMultiplier[exportQuality]).toFixed(1);
  }, [exportQuality]);

  // Get quality settings for canvas export
  const getQualitySettings = useCallback(() => {
    switch (exportQuality) {
      case "High (Poster)":
        return { quality: 0.95, scale: 2 };
      case "Medium (Screen)":
        return { quality: 0.85, scale: 1.5 };
      case "Low (Web)":
        return { quality: 0.75, scale: 1 };
      default:
        return { quality: 0.95, scale: 2 };
    }
  }, [exportQuality]);

  // Create enhanced canvas with additional elements
  const createEnhancedCanvas = useCallback((sourceCanvas) => {
    if (!sourceCanvas) return null;

    const { scale } = getQualitySettings();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions with scaling
    canvas.width = sourceCanvas.width * scale;
    canvas.height = sourceCanvas.height * scale;
    
    // Scale context for high DPI
    ctx.scale(scale, scale);
    
    // Draw the original canvas
    ctx.drawImage(sourceCanvas, 0, 0);

    // Add grid if requested
    if (includeGrid) {
      drawCoordinateGrid(ctx, sourceCanvas.width, sourceCanvas.height);
    }

    // Add labels if requested
    if (includeLabels) {
      drawStarLabels(ctx, sourceCanvas.width, sourceCanvas.height);
    }

    // Add exoplanet info if requested
    if (includeExoplanetInfo) {
      drawExoplanetInfo(ctx, sourceCanvas.width, sourceCanvas.height);
    }

    // Add timestamp and planet info
    drawMetadata(ctx, sourceCanvas.width, sourceCanvas.height);

    return canvas;
  }, [includeGrid, includeLabels, includeExoplanetInfo, getQualitySettings]);

  // Draw coordinate grid overlay
  const drawCoordinateGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Draw grid lines
    const gridSpacing = 50;
    for (let x = 0; x <= width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  // Draw star labels (placeholder implementation)
  const drawStarLabels = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '12px Arial';
    
    // Example star labels - in real implementation, this would use actual star data
    const sampleStars = [
      { name: 'Sirius', x: width * 0.3, y: height * 0.4 },
      { name: 'Vega', x: width * 0.7, y: height * 0.2 },
      { name: 'Polaris', x: width * 0.5, y: height * 0.1 }
    ];

    sampleStars.forEach(star => {
      ctx.fillText(star.name, star.x + 5, star.y - 5);
    });
  };

  // Draw exoplanet information
  const drawExoplanetInfo = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.font = 'bold 10px Arial';
    
    // Example exoplanet markers
    const exoplanets = [
      { name: 'Kepler-452b', x: width * 0.6, y: height * 0.6 },
      { name: 'TRAPPIST-1e', x: width * 0.4, y: height * 0.7 }
    ];

    exoplanets.forEach(planet => {
      // Draw marker circle
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label
      ctx.fillText(planet.name, planet.x + 8, planet.y - 8);
    });
  };

  // Draw metadata (timestamp, planet info)
  const drawMetadata = (ctx, width, height) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    
    const timestamp = new Date().toLocaleString();
    const metadata = [
      `Sky view from ${selectedPlanet}`,
      `Generated: ${timestamp}`,
      `Quality: ${exportQuality}`
    ];

    metadata.forEach((text, index) => {
      ctx.fillText(text, 20, height - 60 + (index * 15));
    });
  };

  // Main export function
  const handleExport = useCallback(() => {
    try {
      let sourceCanvas = null;
      
      // Try to get canvas from ref or find it in the DOM
      if (canvasRef?.current) {
        sourceCanvas = canvasRef.current;
      } else {
        // Fallback: try to find a canvas element
        sourceCanvas = document.querySelector('canvas');
      }

      if (!sourceCanvas) {
        alert('No canvas found to export. Please make sure the sky view is loaded.');
        return;
      }

      // Create enhanced canvas with overlays
      const exportCanvas = createEnhancedCanvas(sourceCanvas);
      if (!exportCanvas) {
        alert('Failed to create export canvas.');
        return;
      }

      // Convert to PNG and trigger download
      const { quality } = getQualitySettings();
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image.');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sky-view-${selectedPlanet.toLowerCase()}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Sky view exported successfully!');
      }, 'image/png', quality);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [canvasRef, selectedPlanet, createEnhancedCanvas, getQualitySettings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Download className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">
          Export Sky View
        </h3>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quality
        </label>
        <select
          value={exportQuality}
          onChange={(e) => setExportQuality?.(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option>High (Poster)</option>
          <option>Medium (Screen)</option>
          <option>Low (Web)</option>
        </select>
      </div>

      {/* Include in Export */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Include in Export
        </label>
        <div className="space-y-3">
          {[
            {
              label: "Star labels and names",
              checked: includeLabels,
              setter: setIncludeLabels,
            },
            {
              label: "Coordinate grid",
              checked: includeGrid,
              setter: setIncludeGrid,
            },
            {
              label: "Exoplanet information",
              checked: includeExoplanetInfo,
              setter: setIncludeExoplanetInfo,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-300">{item.label}</span>
              <button
                onClick={() => item.setter?.(!item.checked)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-500"
                }`}
              >
                {item.checked && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Size Estimate */}
      <div className="bg-gray-800/50 rounded-lg p-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Estimated file size:</span>
          <span className="text-white font-medium">{getEstimatedSize()} MB</span>
        </div>
      </div>

      {/* Export Button */}
      <button 
        onClick={handleExport}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Export PNG</span>
      </button>

      <p className="text-xs text-gray-400">
        Export will include the current sky view from{" "}
        <span className="text-orange-300 font-medium">
          {selectedPlanet}
        </span>{" "}
        with your current zoom and orientation settings.
      </p>
    </div>
  );
};

export default Export;