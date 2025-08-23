import React, { useRef, useEffect } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.01,
    }));

    function draw() {
      ctx.fillStyle = "#0B0F2C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 3;
        ctx.fill();

        s.alpha += s.delta;
        if (s.alpha > 1 || s.alpha < 0) s.delta *= -1;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
}
