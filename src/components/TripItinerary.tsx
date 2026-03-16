import { useTripContext } from "../context/TripContext";
import { createDay } from "../utils/tripFactory";
import TransportSegmentEditor from "./TransportSegment";
import { TransportSegment as TransportSegmentDisplay } from "./TransportSegment";
import styles from "./TripItinerary.module.css";

export default function TripItinerary({
  readOnly: readOnlyProp,
}: {
  readOnly?: boolean;
}) {
  const { activeTrip, updateTrip, readOnly: ctxReadOnly } = useTripContext();
  const readOnly = readOnlyProp ?? ctxReadOnly ?? false;

  if (!activeTrip) return null;

  const { days } = activeTrip;

  const updateDays = (newDays: typeof days) => {
    updateTrip(activeTrip.id, { days: newDays });
  };

  const updateDay = (dayId: string, updates: Partial<(typeof days)[0]>) => {
    updateDays(
      days.map((d) => (d.id === dayId ? { ...d, ...updates } : d))
    );
  };

  const addDay = () => {
    updateDays([...days, createDay()]);
  };

  const removeDay = (dayId: string) => {
    updateDays(days.filter((d) => d.id !== dayId));
  };

  const updateTransport = (
    dayId: string,
    transport: (typeof days)[0]["transport"]
  ) => {
    updateDay(dayId, { transport: transport ?? [] });
  };

  const LONG_DAY_THRESHOLD_MI = 11;
  const getMiles = (d: (typeof days)[0]) =>
    d.distanceMi ?? (d.distanceKm != null ? d.distanceKm / 1.609 : null);
  const isLongDay = (d: (typeof days)[0]) => {
    const mi = getMiles(d);
    return mi != null && mi >= LONG_DAY_THRESHOLD_MI;
  };

  const hikingDays = days.filter(
    (d) => (d.distanceMi ?? d.distanceKm) != null && d.hutFrom && d.hutTo
  );
  const totalMiles = hikingDays.reduce(
    (sum, d) => sum + (getMiles(d) ?? 0),
    0
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Itinerary</h2>
      <p className={styles.subtitle}>
        Day-by-day huts, distances, and transport between stays
      </p>

      {hikingDays.length > 0 && (
        <section className={styles.distanceSummary}>
          <h3 className={styles.summaryTitle}>Miles per day (Alta Via 1)</h3>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Date</th>
                <th>From → To</th>
                <th>Miles</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, i) => {
                const mi = getMiles(day);
                if (mi == null || (!day.hutFrom && !day.hutTo)) return null;
                const long = isLongDay(day);
                return (
                  <tr key={day.id} className={long ? styles.longDayRow : undefined}>
                    <td>{i + 1}</td>
                    <td>{day.date ? new Date(day.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                    <td>{day.hutFrom || "—"} → {day.hutTo || "—"}</td>
                    <td>
                      {mi.toFixed(1)}
                      {long && (
                        <span className={styles.longDayBadge} title="11+ miles – consider bus/cable car options">
                          Long day
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total hiking</td>
                <td><strong>{totalMiles.toFixed(1)} mi</strong></td>
              </tr>
            </tfoot>
          </table>
        </section>
      )}

      <div className={styles.days}>
        {days.map((day, i) => (
          <article key={day.id} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.dayNum}>Day {i + 1}</span>
              {!readOnly && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeDay(day.id)}
                  title="Remove day"
                >
                  Remove
                </button>
              )}
            </div>

            <div className={styles.grid}>
              <label>
                Date
                <input
                  type="date"
                  value={day.date}
                  onChange={(e) => updateDay(day.id, { date: e.target.value })}
                  readOnly={readOnly}
                />
              </label>
              <label>
                From (hut/start)
                <input
                  type="text"
                  placeholder="e.g. Milford Lodge"
                  value={day.hutFrom}
                  onChange={(e) =>
                    updateDay(day.id, { hutFrom: e.target.value })
                  }
                  readOnly={readOnly}
                />
              </label>
              <label>
                To (hut/end)
                <input
                  type="text"
                  placeholder="e.g. Clinton Hut"
                  value={day.hutTo}
                  onChange={(e) =>
                    updateDay(day.id, { hutTo: e.target.value })
                  }
                  readOnly={readOnly}
                />
              </label>
              <label>
                Distance (km)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="12.5"
                  value={day.distanceKm ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    updateDay(day.id, {
                      distanceKm: v ? parseFloat(v) : undefined,
                    });
                  }}
                  readOnly={readOnly}
                />
              </label>
              <label>
                Distance (mi)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="7.8"
                  value={day.distanceMi ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    updateDay(day.id, {
                      distanceMi: v ? parseFloat(v) : undefined,
                    });
                  }}
                  readOnly={readOnly}
                />
              </label>
            </div>

            {isLongDay(day) && (
              <div className={styles.longDayRecommendation}>
                <strong>Long day (11+ mi).</strong> Consider: Lagazuoi or Cinque Torri cable cars; SAD buses between valleys (Cortina, Dobbiaco); or splitting the stage with an extra overnight. Check{" "}
                <a
                  href="https://www.sii.bz.it/en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SAD buses
                </a>{" "}
                and{" "}
                <a
                  href="https://www.dolomiti.org/en/summer/cable-cars-and-lifts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dolomiti cable cars
                </a>
                .
              </div>
            )}

            {readOnly ? (
              (day.transport ?? []).length > 0 ? (
                <div className={styles.transportReadOnly}>
                  <strong>Transport:</strong>
                  {(day.transport ?? []).map((t, idx) => (
                    <TransportSegmentDisplay key={idx} transport={t} readOnly />
                  ))}
                </div>
              ) : null
            ) : (
              <TransportSegmentEditor
                transport={day.transport ?? []}
                onChange={(transport) => updateTransport(day.id, transport)}
              />
            )}

            <label className={styles.notesLabel}>
              Notes
              {readOnly ? (
                <div className={styles.notesReadOnly}>{day.notes || "—"}</div>
              ) : (
                <textarea
                  placeholder="Trail conditions, gear notes..."
                  value={day.notes ?? ""}
                  onChange={(e) =>
                    updateDay(day.id, { notes: e.target.value })
                  }
                  rows={2}
                />
              )}
            </label>
          </article>
        ))}
      </div>

      {!readOnly && (
        <button type="button" className={styles.addDay} onClick={addDay}>
          + Add day
        </button>
      )}
    </div>
  );
}
