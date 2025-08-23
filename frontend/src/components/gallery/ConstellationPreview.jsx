import React, { useEffect, useRef } from "react";

const ConstellationPreview = ({
  stars = [],
  connections = [],
  width = 250,
  height = 150,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    if (stars.length > 0) {
      const xs = stars.map((s) => s.x);
      const ys = stars.map((s) => s.y);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const constellationWidth = maxX - minX;
      const constellationHeight = maxY - minY;

      const scaleX = width / constellationWidth;
      const scaleY = height / constellationHeight;
      const padding = 0.9;
      const scale = Math.min(scaleX, scaleY) * padding;

      const mapX = (x) =>
        (x - minX) * scale + (width - constellationWidth * scale) / 2;
      const mapY = (y) =>
        height -
        ((y - minY) * scale + (height - constellationHeight * scale) / 2);

      // Draw connections
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      connections.forEach(([a, b]) => {
        const starA = stars[a];
        const starB = stars[b];
        if (starA && starB) {
          ctx.beginPath();
          ctx.moveTo(mapX(starA.x), mapY(starA.y));
          ctx.lineTo(mapX(starB.x), mapY(starB.y));
          ctx.stroke();
        }
      });

      // Draw stars
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(mapX(s.x), mapY(s.y), 3, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "white";
        ctx.fill();
      });
    }
  }, [stars, connections, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg bg-black/90 border border-gray-700"
    />
  );
};

export default ConstellationPreview;
