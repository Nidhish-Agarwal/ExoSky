import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Brain } from 'lucide-react';
import axios from 'axios';

const AIChatBot = ({ isOpen, onClose, selectedPlanet }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Clear messages when planet changes
  useEffect(() => {
    setMessages([]);
  }, [selectedPlanet]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedPlanet || !isOpen) return;

    const fetchNarration = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/exoplanets/generate",
          {
            planetName: selectedPlanet.name,
            planetData: selectedPlanet,
          }
        );

        setMessages([{ text: res.data.narration, sender: "ai" }]);
      } catch (error) {
        console.error(error);
        setMessages([{ text: "Sorry, I couldn't fetch insights.", sender: "ai" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchNarration();
  }, [selectedPlanet, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to backend
      const res = await axios.post(
        "http://localhost:5000/exoplanets/generate",
        {
          planetName: selectedPlanet.name,
          planetData: selectedPlanet,
          userQuestion: input // Include the user's question
        }
      );

      // Add AI response to chat
      setMessages(prev => [...prev, { text: res.data.narration, sender: 'ai' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now.", 
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl h-96 flex flex-col border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">
                {selectedPlanet?.name || 'Exoplanet Guide'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 && !loading ? (
            <p className="text-gray-400 text-center">Ask me about {selectedPlanet?.name}</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-xl p-3 ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white max-w-xs lg:max-w-md rounded-xl p-3">
                    Please give a moment...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-purple-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl transition-all duration-300 disabled:opacity-50"
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