import React, { useState } from 'react';
import StarScene from './components/StarScene';
import ControlPanel from './components/ControlPanel';
import ChatInterface from './components/ChatInterface';
import { StarStage } from './types';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<StarStage>(StarStage.MAIN_SEQUENCE);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans bg-black">
      
      {/* 3D Scene Layer - Absolute and Full Screen */}
      <div className="absolute inset-0 z-0">
        <StarScene stage={currentStage} />
      </div>
      
      {/* Background Gradient Overlay (Optional, ensures text readability but keeps stars visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-900/50 pointer-events-none z-10" />

      {/* UI Overlay Layer */}
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
        {/* Top Header */}
        <div className="absolute top-0 left-0 p-6 pointer-events-auto">
            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                PULSAR<span className="text-accent-cyan">.GENESIS</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase mt-1 opacity-70">
                Interactive Stellar Evolution Model
            </p>
        </div>

        {/* Main UI Controls */}
        <ControlPanel currentStage={currentStage} setStage={setCurrentStage} />

        {/* Chat Bot */}
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;