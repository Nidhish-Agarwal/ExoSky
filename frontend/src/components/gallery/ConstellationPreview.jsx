import React, { useEffect, useRef } from "react";

const ConstellationPreview = ({ stars = [], connections = [], width = 250, height = 150 }) => {
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

      const offsetX = (width - constellationWidth) / 2 - minX;
      const offsetY = (height - constellationHeight) / 2 - minY;

      // Draw connections in bright white
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      connections.forEach(([a, b]) => {
        const starA = stars[a];
        const starB = stars[b];
        if (starA && starB) {
          ctx.beginPath();
          ctx.moveTo(starA.x + offsetX, starA.y + offsetY);
          ctx.lineTo(starB.x + offsetX, starB.y + offsetY);
          ctx.stroke();
        }
      });

      // Draw stars as white glowing circles
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x + offsetX, s.y + offsetY, 3, 0, Math.PI * 2);
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
