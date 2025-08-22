// components/AIChatBot.jsx
import React, { useState } from 'react';
import { X, Send, Brain } from 'lucide-react';

const AIChatBot = ({ isOpen, onClose, selectedPlanet }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `I'd love to tell you about ${selectedPlanet?.name || 'this exoplanet'}. This feature will be integrated with our AI storytelling system soon!`, 
          sender: 'ai' 
        }]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl h-96 flex flex-col border border-purple-500/30">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">
              AI Storyteller - {selectedPlanet?.name || 'Exoplanet Guide'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center h-full flex items-center justify-center">
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-gray-400">Ask me about {selectedPlanet?.name || 'this exoplanet'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-xl p-3 ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about this exoplanet..."
              className="flex-1 bg-gray-800 border border-purple-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400"
            />
            <button 
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;