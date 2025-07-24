'use client';

import Image from 'next/image';
import { Incident } from '@/types';
import { useState } from 'react';

interface IncidentListProps {
  incidents: Incident[];
  onIncidentSelect: (incident: Incident) => void;
  onIncidentResolve: (incidentId: number) => void;
  selectedIncident?: Incident | null;
}

const IncidentList = ({ 
  incidents, 
  onIncidentSelect, 
  onIncidentResolve,
  selectedIncident 
}: IncidentListProps) => {
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set());
  
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return { icon: '🔫', color: 'bg-red-500', textColor: 'text-red-500' };
      case 'Unauthorized Access':
        return { icon: '⚠️', color: 'bg-orange-500', textColor: 'text-orange-500' };
      case 'Face Recognised':
        return { icon: '👤', color: 'bg-blue-500', textColor: 'text-blue-500' };
      case 'Traffic congestion':
        return { icon: '🚦', color: 'bg-green-500', textColor: 'text-green-500' };
      default:
        return { icon: '⚠️', color: 'bg-gray-500', textColor: 'text-gray-500' };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleResolve = async (incident: Incident) => {
    setResolvingIds(prev => new Set([...prev, incident.id]));
    
    try {
      await onIncidentResolve(incident.id);
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incident.id);
        return newSet;
      });
    }
  };

  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);
  const resolvedIncidents = incidents.filter(incident => incident.resolved);

  return (
    <div className="bg-[#1a2332] text-white w-96 flex flex-col border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚠</span>
          </div>
          <h2 className="text-lg font-bold">{unresolvedIncidents.length} Unresolved Incidents</h2>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>{unresolvedIncidents.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{resolvedIncidents.length} resolved incidents</span>
          </span>
        </div>
      </div>

      {/* Incidents List */}
      <div className="flex-1 overflow-y-auto">
        {/* Unresolved Incidents */}
        <div className="p-4 space-y-3">
          {unresolvedIncidents.map((incident) => {
            const { icon, color, textColor } = getIncidentIcon(incident.type);
            const isResolving = resolvingIds.has(incident.id);
            const isSelected = selectedIncident?.id === incident.id;
            
            return (
              <div 
                key={incident.id}
                className={`bg-[#2a3441] rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-[#324050] ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${isResolving ? 'opacity-50' : ''}`}
                onClick={() => !isResolving && onIncidentSelect(incident)}
              >
                <div className="flex space-x-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={incident.thumbnailUrl}
                      alt="Incident thumbnail"
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-4 h-4 ${color} rounded-full flex items-center justify-center`}>
                        <span className="text-xs">{icon}</span>
                      </div>
                      <span className={`text-sm font-medium ${textColor}`}>
                        {incident.type}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>📍</span>
                        <span>{incident.camera.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🕒</span>
                        <span>
                          {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)} on {formatDate(incident.tsStart)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(incident);
                      }}
                      disabled={isResolving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      {isResolving ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          <span>Resolving...</span>
                        </>
                      ) : (
                        <>
                          <span>✓</span>
                          <span>Resolve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolved Incidents Section */}
        {resolvedIncidents.length > 0 && (
          <div className="border-t border-gray-700">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Resolved Incidents</h3>
              <div className="space-y-2">
                {resolvedIncidents.slice(0, 3).map((incident) => {
                  const { icon, textColor } = getIncidentIcon(incident.type);
                  
                  return (
                    <div 
                      key={incident.id}
                      className="bg-[#2a3441] rounded-lg p-2 opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onIncidentSelect(incident)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-6 bg-gray-800 rounded overflow-hidden">
                          <Image
                            src={incident.thumbnailUrl}
                            alt="Incident thumbnail"
                            width={32}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">{icon}</span>
                            <span className={`text-xs ${textColor}`}>{incident.type}</span>
                          </div>
                          <div className="text-xs text-gray-500">{incident.camera.name}</div>
                        </div>
                        <span className="text-xs text-green-400">✓</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
