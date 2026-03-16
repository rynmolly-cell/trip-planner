export interface TransportSegment {
  type: 'bus' | 'train' | 'shuttle' | 'other';
  description: string;
  required: boolean;
  url?: string;
}

export interface Day {
  id: string;
  date: string;
  hutFrom: string;
  hutTo: string;
  distanceKm?: number;
  distanceMi?: number;
  transport?: TransportSegment[];
  notes?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  dueDate?: string;
  done: boolean;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  days: Day[];
  actionItems: ActionItem[];
  routeWaypoints?: RouteWaypoint[];
}

