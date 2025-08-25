import React from "react";

export default function Questions({ q, selected, onAnswer }) {
  if (!q) return null;

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden flex flex-col">
      
      {/* Starfield */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() > 0.7 ? "w-1.5 h-1.5" : Math.random() > 0.4 ? "w-1 h-1" : "w-px h-px";
          const color = Math.random() > 0.6 ? "bg-blue-300" : "bg-white";
          const top = `${Math.random() * 100}%`;
          const left = `${Math.random() * 100}%`;
          return <div key={i} className={`absolute rounded-full opacity-70 ${size} ${color}`} style={{ top, left }} />;
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-2xl">
          {/* Question header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
              {q.question}
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Choose what resonates with you
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(option)}
                className={`group w-full p-6 rounded-xl border transition-all duration-300 text-left relative overflow-hidden ${
                  selected === option
                    ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-blue-400/60 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-gray-900/60 hover:bg-gray-800/80 border-gray-600/40 hover:border-blue-500/40 text-gray-300 hover:text-white'
                } backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-medium text-lg pr-4">{option}</span>
                  <div
                    className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all duration-300 ${
                      selected === option
                        ? 'border-blue-400 bg-blue-400 shadow-lg shadow-blue-400/30'
                        : 'border-gray-500 group-hover:border-blue-400/70'
                    }`}
                  >
                    {selected === option && (
                      <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
