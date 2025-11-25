import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your stellar guide. Ask me anything about neutron stars, gravity, or the universe.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let currentResponse = "";
    // Add a placeholder message for streaming
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: Date.now() }]);

    await streamChatResponse(
        messages.map(m => m.text), // Send simplified history
        userMsg.text,
        (chunk) => {
            currentResponse += chunk;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1].text = currentResponse;
                return newArr;
            });
        }
    );
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-6 right-6 bg-accent-cyan text-black p-3 rounded-full shadow-lg shadow-accent-cyan/20 hover:scale-110 transition-transform z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 w-80 md:w-96 bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
            <h3 className="font-bold text-sm text-white">Cosmic AI Guide</h3>
        </div>
        <div className="flex gap-2">
             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
             </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-accent-cyan text-black rounded-tr-none' 
                : 'bg-space-800 text-gray-200 border border-white/10 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about neutron stars..."
            className="w-full bg-space-800 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-accent-cyan/50 placeholder-gray-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-1.5 top-1.5 p-1.5 bg-accent-cyan text-black rounded-full hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-accent-cyan transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
