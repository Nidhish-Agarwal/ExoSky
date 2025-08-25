import React from "react";

export default function ProgressLines({ current, total, onSelect }) {
  return (
    <div className="flex justify-center items-center gap-2 py-4 relative z-20">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`h-1 rounded-full transition-all duration-300 transform ${
            idx === current
              ? "bg-blue-400 w-8 shadow-lg shadow-blue-500/50"
              : "bg-blue-400/50 w-6 hover:bg-blue-400/80"
          }`}
          aria-label={`Go to question ${idx + 1}`}
        />
      ))}
    </div>
  );
}
