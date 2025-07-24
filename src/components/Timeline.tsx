'use client';

import { useState, useRef, useEffect } from 'react';
import { Incident } from '@/types';

interface TimelineProps {
  incidents: Incident[];
  onTimeChange: (time: number) => void;
  currentTime: number;
}

const Timeline = ({ incidents, onTimeChange, currentTime }: TimelineProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  // 24 hours in seconds
  const TIMELINE_DURATION = 24 * 60 * 60;
  
  // Get timeline bounds
  const getTimelineBounds = () => {
    if (!timelineRef.current) return { left: 0, width: 0 };
    const rect = timelineRef.current.getBoundingClientRect();
    return { left: rect.left, width: rect.width };
  };

  // Convert time to pixel position
  const timeToPixels = (timeInSeconds: number) => {
    const { width } = getTimelineBounds();
    return (timeInSeconds / TIMELINE_DURATION) * width;
  };

  // Convert pixel position to time
  const pixelsToTime = (pixels: number) => {
    const { width } = getTimelineBounds();
    return (pixels / width) * TIMELINE_DURATION;
  };

  // Get incident position based on timestamp
  const getIncidentPosition = (incident: Incident) => {
    const now = new Date();
    const incidentTime = new Date(incident.tsStart);
    const timeDiff = now.getTime() - incidentTime.getTime();
    const secondsAgo = Math.max(0, Math.min(TIMELINE_DURATION, timeDiff / 1000));
    return timeToPixels(TIMELINE_DURATION - secondsAgo);
  };

  // Handle mouse down on scrubber
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const { left, width } = getTimelineBounds();
    const x = e.clientX - left;
    const clampedX = Math.max(0, Math.min(width, x));
    const newTime = pixelsToTime(clampedX);
    
    onTimeChange(newTime);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle click on timeline
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const { left, width } = getTimelineBounds();
    const x = e.clientX - left;
    const clampedX = Math.max(0, Math.min(width, x));
    const newTime = pixelsToTime(clampedX);
    
    onTimeChange(newTime);
  };

  // Set up global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Format time for display
  const formatTimeLabel = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Generate hour markers
  const hourMarkers = Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    const position = timeToPixels(hour * 3600);
    return { hour, position };
  });

  // Get incident color
  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return '#ef4444'; // red
      case 'Unauthorized Access':
        return '#f97316'; // orange
      case 'Face Recognised':
        return '#3b82f6'; // blue
      case 'Traffic congestion':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="bg-[#1a2332] border-t border-gray-700 p-4">
      <div className="mb-4">
        <h3 className="text-white font-medium mb-2">24-Hour Timeline</h3>
        <div className="text-sm text-gray-400">
          Current time: {formatTimeLabel(currentTime)} • Drag the scrubber or click to navigate
        </div>
      </div>

      <div className="relative">
        {/* Timeline background */}
        <div
          ref={timelineRef}
          className="relative h-16 bg-gray-800 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Hour markers */}
          {hourMarkers.map(({ hour, position }) => (
            <div
              key={hour}
              className="absolute top-0 h-full border-l border-gray-600"
              style={{ left: `${position}px` }}
            >
              <div className="absolute -top-6 -translate-x-1/2 text-xs text-gray-400">
                {formatTimeLabel(hour * 3600)}
              </div>
            </div>
          ))}

          {/* Incident markers */}
          {incidents.map((incident) => {
            const position = getIncidentPosition(incident);
            const color = getIncidentColor(incident.type);
            
            return (
              <div
                key={incident.id}
                className="absolute top-2 w-3 h-12 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${position}px`,
                  backgroundColor: color,
                  transform: 'translateX(-50%)',
                }}
                title={`${incident.type} - ${incident.camera.name} - ${new Date(incident.tsStart).toLocaleString()}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Snap to incident time
                  const now = new Date();
                  const incidentTime = new Date(incident.tsStart);
                  const timeDiff = now.getTime() - incidentTime.getTime();
                  const secondsAgo = Math.max(0, Math.min(TIMELINE_DURATION, timeDiff / 1000));
                  onTimeChange(TIMELINE_DURATION - secondsAgo);
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-white opacity-90"></div>
              </div>
            );
          })}

          {/* Current time scrubber */}
          <div
            ref={scrubberRef}
            className={`absolute top-0 w-1 h-full bg-yellow-400 cursor-grab ${
              isDragging ? 'cursor-grabbing scale-x-150' : ''
            } transition-transform`}
            style={{ left: `${timeToPixels(currentTime)}px` }}
            onMouseDown={handleMouseDown}
          >
            {/* Scrubber handle */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg"></div>
            
            {/* Time tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {formatTimeLabel(currentTime)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Gun Threat</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-400">Unauthorized Access</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Face Recognised</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Traffic Congestion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
