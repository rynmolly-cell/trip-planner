import type { Trip, Day, ActionItem } from "../types/trip";

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function createTrip(): Trip {
  const id = generateId();
  const start = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 86400000 * 9).toISOString().slice(0, 10);
  return {
    id,
    name: "New Trip",
    startDate: start,
    endDate: end,
    notes: "",
    days: [createDay()],
    actionItems: [],
    routeWaypoints: [],
  };
}

export function createDay(): Day {
  return {
    id: generateId(),
    date: "",
    hutFrom: "",
    hutTo: "",
    distanceKm: undefined,
    distanceMi: undefined,
    transport: [],
    notes: "",
  };
}

export function createActionItem(text = ""): ActionItem {
  return {
    id: generateId(),
    text,
    dueDate: undefined,
    done: false,
  };
}
