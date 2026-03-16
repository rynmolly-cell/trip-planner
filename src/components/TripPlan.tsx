import { useTripContext } from "../context/TripContext";
import type { RouteWaypoint } from "../types/trip";
import styles from "./TripPlan.module.css";

function generateId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function TripPlan({ readOnly = false }: { readOnly?: boolean }) {
  const { activeTrip, updateTrip } = useTripContext();

  if (!activeTrip) return null;

  const handleChange = (field: keyof typeof activeTrip) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (readOnly) return;
      const value = e.target.value;
      if (field === "routeWaypoints") return;
      updateTrip(activeTrip.id, { [field]: value });
    };

  const waypoints = activeTrip.routeWaypoints ?? [];

  const addWaypoint = () => {
    if (readOnly) return;
    updateTrip(activeTrip.id, {
      routeWaypoints: [
        ...waypoints,
        { lat: 0, lng: 0, label: `Waypoint ${waypoints.length + 1}` },
      ],
    });
  };

  const updateWaypoint = (i: number, upd: Partial<RouteWaypoint>) => {
    if (readOnly) return;
    const next = waypoints.map((w, j) =>
      j === i ? { ...w, ...upd } : w
    );
    updateTrip(activeTrip.id, { routeWaypoints: next });
  };

  const removeWaypoint = (i: number) => {
    if (readOnly) return;
    updateTrip(activeTrip.id, {
      routeWaypoints: waypoints.filter((_, j) => j !== i),
    });
  };

  return (
    <div className={styles.plan}>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Trip overview</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="trip-name">Trip name</label>
            <input
              id="trip-name"
              type="text"
              value={activeTrip.name}
              onChange={handleChange("name")}
              placeholder="e.g. Milford Track"
              readOnly={readOnly}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="start-date">Start date</label>
            <input
              id="start-date"
              type="date"
              value={activeTrip.startDate}
              onChange={handleChange("startDate")}
              readOnly={readOnly}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="end-date">End date</label>
            <input
              id="end-date"
              type="date"
              value={activeTrip.endDate}
              onChange={handleChange("endDate")}
              readOnly={readOnly}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={activeTrip.notes ?? ""}
            onChange={handleChange("notes")}
            placeholder="General notes, packing list, weather considerations..."
            rows={4}
            readOnly={readOnly}
          />
        </div>

        {!readOnly && (
          <div className={styles.waypoints}>
            <h3 className={styles.waypointsTitle}>Route waypoints (for map)</h3>
            {(activeTrip.routeWaypoints ?? []).map((wp, i) => (
              <div key={i} className={styles.waypointRow}>
                <input
                  type="number"
                  step="any"
                  placeholder="Lat"
                  value={wp.lat || ""}
                  onChange={(e) => {
                    const wps = [...(activeTrip.routeWaypoints ?? [])];
                    wps[i] = { ...wp, lat: parseFloat(e.target.value) || 0 };
                    updateTrip(activeTrip.id, { routeWaypoints: wps });
                  }}
                  className={styles.waypointInput}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Lng"
                  value={wp.lng || ""}
                  onChange={(e) => {
                    const wps = [...(activeTrip.routeWaypoints ?? [])];
                    wps[i] = { ...wp, lng: parseFloat(e.target.value) || 0 };
                    updateTrip(activeTrip.id, { routeWaypoints: wps });
                  }}
                  className={styles.waypointInput}
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={wp.label || ""}
                  onChange={(e) => {
                    const wps = [...(activeTrip.routeWaypoints ?? [])];
                    wps[i] = { ...wp, label: e.target.value };
                    updateTrip(activeTrip.id, { routeWaypoints: wps });
                  }}
                  className={styles.waypointLabel}
                />
                <button
                  type="button"
                  className={styles.removeWaypoint}
                  onClick={() => {
                    const wps = (activeTrip.routeWaypoints ?? []).filter(
                      (_, idx) => idx !== i
                    );
                    updateTrip(activeTrip.id, { routeWaypoints: wps });
                  }}
                  aria-label="Remove waypoint"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addWaypoint}
              onClick={() => {
                const wps = [...(activeTrip.routeWaypoints ?? []), { lat: 0, lng: 0, label: "" }];
                updateTrip(activeTrip.id, { routeWaypoints: wps });
              }}
            >
              + Add waypoint
            </button>
          </div>
        )}

        {readOnly && (activeTrip.routeWaypoints ?? []).length > 0 && (
          <div className={styles.waypointsReadOnly}>
            <h3 className={styles.waypointsTitle}>Route waypoints</h3>
            <ul>
              {(activeTrip.routeWaypoints ?? []).map((wp, i) => (
                <li key={i}>
                  {wp.label || `Point ${i + 1}`}: {wp.lat}, {wp.lng}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
