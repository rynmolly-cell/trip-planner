import { useTripContext } from "../context/TripContext";
import { createDolomites2026Trip } from "../data/dolomites2026";
import styles from "./TabBar.module.css";

export function TabBar() {
  const {
    trips,
    activeTripId,
    setActiveTripId,
    addTrip,
    addTripFromTemplate,
    deleteTrip,
  } = useTripContext();

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabs}>
        {trips.map((trip) => (
          <button
            key={trip.id}
            className={`${styles.tab} ${activeTripId === trip.id ? styles.active : ""}`}
            onClick={() => setActiveTripId(trip.id)}
            title={trip.name}
          >
            <span className={styles.tabName}>{trip.name}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                deleteTrip(trip.id);
              }}
              aria-label={`Delete ${trip.name}`}
            >
              ×
            </button>
          </button>
        ))}
        <button
          type="button"
          className={styles.newTab}
          onClick={addTrip}
          aria-label="New trip"
        >
          + New trip
        </button>
      </div>
    </div>
  );
}
