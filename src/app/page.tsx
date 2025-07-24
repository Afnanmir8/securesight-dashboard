'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import IncidentPlayer from '@/components/IncidentPlayer';
import IncidentList from '@/components/IncidentList';
import Timeline from '@/components/Timeline';
import { useIncidents } from '@/hooks/useIncidents';
import { Incident } from '@/types';

export default function Home() {
  const { incidents, loading, error, resolveIncident } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);
  const resolvedIncidents = incidents.filter(incident => incident.resolved);

  const handleIncidentResolve = async (incidentId: number) => {
    try {
      await resolveIncident(incidentId);
      // If the resolved incident was selected, keep it selected to show the resolved state
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      // Error handling could include showing a toast notification
    }
  };

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
    // Here you could also update video playback position
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Loading SecureSight Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      <Navbar 
        unresolvedCount={unresolvedIncidents.length}
        resolvedCount={resolvedIncidents.length}
      />
      
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <IncidentPlayer 
            selectedIncident={selectedIncident}
          />
          
          {/* Optional Timeline Component */}
          <Timeline
            incidents={incidents}
            onTimeChange={handleTimeChange}
            currentTime={currentTime}
          />
        </div>
        
        <IncidentList
          incidents={incidents}
          onIncidentSelect={setSelectedIncident}
          onIncidentResolve={handleIncidentResolve}
          selectedIncident={selectedIncident}
        />
      </div>
    </div>
  );
}
