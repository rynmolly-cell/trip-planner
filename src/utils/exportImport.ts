import type { Trip } from "../types/trip";

export function exportTrip(trip: Trip): void {
  const json = JSON.stringify(trip, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trip-${trip.name.replace(/\s+/g, "-")}-${trip.startDate}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseTripJson(json: string): Trip | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "days" in parsed &&
      Array.isArray(parsed.days)
    ) {
      return parsed as Trip;
    }
    return null;
  } catch {
    return null;
  }
}

export function parseTripsJson(json: string): Trip[] | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.every(
        (p) =>
          p &&
          typeof p === "object" &&
          "name" in p &&
          "days" in p &&
          Array.isArray((p as Trip).days)
      );
      return valid ? (parsed as Trip[]) : null;
    }
    const single = parseTripJson(json);
    return single ? [single] : null;
  } catch {
    return null;
  }
}

export function importTripFromFile(
  onImport: (trips: Trip[]) => void
): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const trips = parseTripsJson(text);
      if (trips?.length) onImport(trips);
    };
    reader.readAsText(file);
    input.value = "";
  };
  input.click();
}
