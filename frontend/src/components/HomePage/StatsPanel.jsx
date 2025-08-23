// components/HomePage/StatsPanel.jsx
import React from 'react';
import { Globe, Star, Heart, Zap } from 'lucide-react';

const StatsPanel = () => {
  const stats = [
    {
      icon: Globe,
      title: "Confirmed Exoplanets",
      value: "5,983+",
      description: "Worlds beyond our solar system",
      color: "from-blue-500 to-indigo-600",
      delay: 0
    },
    {
      icon: Star,
      title: "Planetary Systems",
      value: "4,460+",
      description: "Stars with orbiting planets",
      color: "from-blue-500 to-indigo-600",
      delay: 100
    },
    {
      icon: Heart,
      title: "Habitable Zone",
      value: "156",
      description: "Potential life-supporting worlds",
      color: "from-blue-500 to-indigo-600",
      delay: 200
    },
    {
      icon: Zap,
      title: "New Discoveries",
      value: "127",
      description: "In the past year alone",
      color: "from-blue-500 to-indigo-600",
      delay: 300
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 transform-gpu"
              style={{ transitionDelay: `${stat.delay}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mr-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-cyan-200 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsPanel;