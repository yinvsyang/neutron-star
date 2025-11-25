import React, { useEffect, useState, useRef } from 'react';
import { StarStage } from '../types';
import { STAGE_DATA } from '../constants';
import { Activity, Info, ThermometerSun, Play, Pause, Circle, Disc, Star, Zap } from 'lucide-react';
import { generateStageExplanation } from '../services/geminiService';

interface ControlPanelProps {
  currentStage: StarStage;
  setStage: React.Dispatch<React.SetStateAction<StarStage>>;
}

const STAGE_ORDER = [
  StarStage.MAIN_SEQUENCE,
  StarStage.RED_SUPERGIANT,
  StarStage.SUPERNOVA,
  StarStage.NEUTRON_STAR
];

const STAGE_CONFIG: Record<StarStage, { label: string; icon: React.FC<any> }> = {
  [StarStage.MAIN_SEQUENCE]: { label: "Main Sequence", icon: Circle },
  [StarStage.RED_SUPERGIANT]: { label: "Red Supergiant", icon: Disc },
  [StarStage.SUPERNOVA]: { label: "Supernova", icon: Zap },
  [StarStage.NEUTRON_STAR]: { label: "Neutron Star", icon: Star }
};

const ControlPanel: React.FC<ControlPanelProps> = ({ currentStage, setStage }) => {
  const [aiFact, setAiFact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const data = STAGE_DATA[currentStage];
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  // Auto-play logic to "Show how the star formed"
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setStage((prev) => {
          const idx = STAGE_ORDER.indexOf(prev);
          if (idx < STAGE_ORDER.length - 1) {
            return STAGE_ORDER[idx + 1];
          } else {
            // Stop at the end
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5000); // Change every 5 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, setStage]);

  useEffect(() => {
    let isMounted = true;
    const fetchFact = async () => {
      setLoading(true);
      const fact = await generateStageExplanation(currentStage);
      if (isMounted) {
        setAiFact(fact);
        setLoading(false);
      }
    };
    fetchFact();
    return () => { isMounted = false; };
  }, [currentStage]);

  return (
    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col md:flex-row items-end justify-between gap-4 pointer-events-none">
      
      {/* Left: Info Card */}
      <div className="bg-space-800/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-full md:max-w-md pointer-events-auto shadow-2xl order-2 md:order-1">
        <div className="flex items-center gap-3 mb-3">
          <span 
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: data.color, color: data.color }} 
          />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">{data.title}</h1>
        </div>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed border-l-2 border-white/10 pl-3">
          {data.details}
        </p>

        {/* AI Fact Section */}
        <div className="bg-space-900/50 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold mb-1 uppercase tracking-wider">
             <Activity size={12} /> AI Insight
          </div>
          <p className="text-xs text-gray-400 italic">
            {loading ? "Analyzing stellar data..." : aiFact}
          </p>
        </div>
      </div>

      {/* Center/Bottom: Timeline Controls */}
      <div className="pointer-events-auto flex flex-col items-center gap-4 w-full md:w-auto order-1 md:order-2">
        
        {/* Playback Control */}
        <button
          onClick={() => {
            if (!isPlaying && currentIndex === STAGE_ORDER.length - 1) {
                setStage(STAGE_ORDER[0]); // Reset if at end
            }
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg backdrop-blur-sm ${
            isPlaying 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 shadow-red-500/10' 
              : 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/50 hover:bg-accent-cyan/20 shadow-accent-cyan/10'
          }`}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          {isPlaying ? 'PAUSE EVOLUTION' : 'WATCH FORMATION'}
        </button>

        {/* Stage Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-2 bg-space-900/60 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
          {STAGE_ORDER.map((s) => {
            const Config = STAGE_CONFIG[s];
            const isActive = currentStage === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setIsPlaying(false);
                  setStage(s);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-white/10 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105'
                    : 'bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Config.icon size={16} className={isActive ? "text-accent-cyan" : ""} />
                {Config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Stats HUD */}
      <div className="hidden md:flex flex-col gap-3 pointer-events-auto min-w-[200px] order-3">
        <div className="bg-space-800/90 backdrop-blur-md border border-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
                <ThermometerSun size={14} /> Core Temp
            </div>
            <div className="text-xl font-mono font-bold text-white tracking-wider">
                {currentStage === StarStage.MAIN_SEQUENCE && "30,000 K"}
                {currentStage === StarStage.RED_SUPERGIANT && "3,500 K"}
                {currentStage === StarStage.SUPERNOVA && "100 Billion K"}
                {currentStage === StarStage.NEUTRON_STAR && "1,000,000 K"}
            </div>
        </div>
        
         <div className="bg-space-800/90 backdrop-blur-md border border-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
                <Info size={14} /> Radius
            </div>
            <div className="text-xl font-mono font-bold text-white tracking-wider">
                {currentStage === StarStage.MAIN_SEQUENCE && "10 Gm"}
                {currentStage === StarStage.RED_SUPERGIANT && "600 Gm"}
                {currentStage === StarStage.SUPERNOVA && "Expanding..."}
                {currentStage === StarStage.NEUTRON_STAR && "12 km"}
            </div>
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;