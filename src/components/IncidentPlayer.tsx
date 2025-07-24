'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface IncidentPlayerProps {
  selectedIncident?: {
    id: number;
    type: string;
    camera: {
      name: string;
      location: string;
    };
    tsStart: string;
    thumbnailUrl: string;
  } | null;
}

const IncidentPlayer = ({ selectedIncident }: IncidentPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(100); // mock duration
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cameras = [
    { id: 1, name: 'Camera - 01', videoUrl: '/videos/mock-video-1.svg' },
    { id: 2, name: 'Camera - 02', videoUrl: '/videos/mock-video-2.svg' },
    { id: 3, name: 'Camera - 03', videoUrl: '/videos/mock-video-3.svg' },
  ];

  // Get the appropriate video based on selected incident
  const getVideoUrl = () => {
    if (!selectedIncident) return '/videos/mock-video-1.svg';
    
    // Map incident types to specific videos
    switch (selectedIncident.type) {
      case 'Gun Threat':
        return '/videos/mock-video-2.svg'; // Vault with weapon
      case 'Face Recognised':
        return '/videos/mock-video-3.svg'; // Entrance with face recognition
      case 'Unauthorized Access':
      case 'Traffic congestion':
      default:
        return '/videos/mock-video-1.svg'; // Shop floor
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => (prev < duration ? prev + 1 : duration));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  return (
    <div className="bg-[#0f1419] text-white flex-1 flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {selectedIncident ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={getVideoUrl()}
              alt="Camera Feed"
              fill
              className="object-contain"
              priority
            />
            <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded">
              <span className="text-yellow-400 text-sm font-medium">
                {selectedIncident.type.toUpperCase()}
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded">
              <span className="text-red-400 text-sm">● {selectedIncident.camera.name}</span>
            </div>
            {!isPlaying && (
              <button 
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <span className="text-2xl ml-1 text-white">▶</span>
                </div>
              </button>
            )}
            {isPlaying && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">REC</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-4xl">📹</span>
            </div>
            <p>Select an incident to view recording</p>
            <p className="text-sm mt-2">Static video records available</p>
          </div>
        )}
      </div>

      {/* Video Controls */}
      <div className="bg-[#2a1810] p-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="p-2 hover:bg-gray-700 rounded"
          >
            ⏪
          </button>
          
          <button 
            onClick={handlePlay}
            className="p-2 hover:bg-gray-700 rounded"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button 
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            className="p-2 hover:bg-gray-700 rounded"
          >
            ⏩
          </button>
          
          <span className="text-sm text-gray-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <span className="text-sm text-gray-300">
            {selectedIncident?.tsStart ? new Date(selectedIncident.tsStart).toLocaleString() : '--:--:-- (05-Jun-2025)'}
          </span>
        </div>
      </div>

      {/* Camera List */}
      <div className="bg-[#1a1a1a] p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Camera List</h3>
          <div className="flex space-x-4 text-xs">
            <span className="text-orange-400">⚠ Unauthorized Access</span>
            <span className="text-blue-400">👤 Face Recognised</span>
            <span className="text-red-400">🔫 Gun Threat</span>
            <span className="text-green-400">🚦 Traffic congestion</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          {cameras.map((camera, index) => (
            <div key={camera.id} className="flex-1 relative">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-400">📹</span>
                  <span className="text-sm text-white">{camera.name}</span>
                </div>
                
                <div className="bg-black rounded aspect-video flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={camera.videoUrl}
                    alt={`${camera.name} preview`}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Live Preview</span>
                  </div>
                </div>
                
                {/* Timeline indicators */}
                <div className="flex space-x-1 text-xs mt-2">
                  {index === 0 && (
                    <>
                      <span className="bg-orange-600 px-1 rounded">⚠</span>
                      <span className="bg-red-600 px-1 rounded">🔫</span>
                    </>
                  )}
                  {index === 1 && (
                    <span className="bg-red-600 px-1 rounded">�</span>
                  )}
                  {index === 2 && (
                    <>
                      <span className="bg-blue-600 px-1 rounded">👤</span>
                      <span className="bg-green-600 px-1 rounded">🚦</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentPlayer;
