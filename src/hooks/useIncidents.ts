'use client';

import { useState, useEffect, useCallback } from 'react';
import { Incident } from '@/types';

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await response.json();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveIncident = useCallback(async (incidentId: number) => {
    try {
      // Optimistic update
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, resolved: !incident.resolved }
            : incident
        )
      );

      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }

      const updatedIncident = await response.json();
      
      // Update with server response
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      );
    } catch (err) {
      // Revert optimistic update on error
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, resolved: !incident.resolved }
            : incident
        )
      );
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    loading,
    error,
    refetch: fetchIncidents,
    resolveIncident,
  };
};
