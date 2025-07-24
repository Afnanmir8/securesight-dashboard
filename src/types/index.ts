export interface Camera {
  id: number;
  name: string;
  location: string;
}

export interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
}

export type IncidentType = 'Gun Threat' | 'Unauthorized Access' | 'Face Recognised' | 'Traffic congestion';
