import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Trip } from "../types/trip";
import { createTrip, createDay } from "../utils/tripFactory";
import { createDolomites2026Trip } from "../data/dolomites2026";

const DEFAULT_TRIPS: Trip[] = (() => {
  const t = createDolomites2026Trip();
  return [t];
})();

interface TripContextValue {
  trips: Trip[];
  activeTripId: string | null;
  activeTrip: Trip | null;
  setActiveTripId: (id: string | null) => void;
  addTrip: () => void;
  addTripFromTemplate: (template: Trip) => void;
  importTrips: (trips: Trip[]) => void;
  deleteTrip: (id: string) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  readOnly?: boolean;
}

const TripContext = createContext<TripContextValue | null>(null);

export function ShareTripProvider({
  trip,
  children,
}: {
  trip: Trip;
  children: ReactNode;
}) {
  const noop = useCallback(() => {}, []);
  const addTripFromTemplate = useCallback(() => {}, []);
  const importTrips = useCallback(() => {}, []);
  const value: TripContextValue = {
    trips: [trip],
    activeTripId: trip.id,
    activeTrip: trip,
    setActiveTripId: noop,
    addTrip: noop,
    addTripFromTemplate,
    importTrips,
    deleteTrip: noop,
    updateTrip: noop,
    readOnly: true,
  };
  return (
    <TripContext.Provider value={value}>{children}</TripContext.Provider>
  );
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useLocalStorage<Trip[]>("trip-planner-trips", []);
  const [activeTripId, setActiveTripId] = useLocalStorage<string | null>(
    "trip-planner-active",
    null
  );

  const activeTrip = trips.find((t) => t.id === activeTripId) ?? null;

  const addTrip = useCallback(() => {
    const newTrip = createTrip();
    setTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
  }, [setTrips, setActiveTripId]);

  const addTripFromTemplate = useCallback(
    (template: Trip) => {
      const newId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
      const newTrip: Trip = {
        ...template,
        id: newId,
        days: template.days.map((d) => ({
          ...d,
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11),
          transport: d.transport ?? [],
        })),
        actionItems: template.actionItems.map((a) => ({
          ...a,
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11),
        })),
      };
      setTrips((prev) => [...prev, newTrip]);
      setActiveTripId(newTrip.id);
    },
    [setTrips, setActiveTripId]
  );

  const deleteTrip = useCallback(
    (id: string) => {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (activeTripId === id) {
        const remaining = trips.filter((t) => t.id !== id);
        setActiveTripId(remaining[0]?.id ?? null);
      }
    },
    [trips, activeTripId, setTrips, setActiveTripId]
  );

  const updateTrip = useCallback(
    (id: string, updates: Partial<Trip>) => {
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [setTrips]
  );

  const importTrips = useCallback(
    (tripsToImport: Trip[]) => {
      if (tripsToImport.length === 0) return;
      const withNewIds = tripsToImport.map((t) => {
        const newId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
        return {
          ...t,
          id: newId,
          days: (t.days ?? []).map((d) => ({
            ...d,
            id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11),
            transport: d.transport ?? [],
          })),
          actionItems: (t.actionItems ?? []).map((a) => ({
            ...a,
            id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11),
          })),
        };
      });
      setTrips((prev) => [...prev, ...withNewIds]);
      setActiveTripId(withNewIds[0].id);
    },
    [setTrips, setActiveTripId]
  );

  const value: TripContextValue = {
    trips,
    activeTripId,
    activeTrip,
    setActiveTripId,
    addTrip,
    addTripFromTemplate,
    importTrips,
    deleteTrip,
    updateTrip,
  };

  return (
    <TripContext.Provider value={value}>{children}</TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTripContext must be used within TripProvider");
  }
  return ctx;
}
