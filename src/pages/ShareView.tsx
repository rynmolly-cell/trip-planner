import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TripPlan } from "../components/TripPlan";
import TripItinerary from "../components/TripItinerary";
import ActionItems from "../components/ActionItems";
import { TripMap } from "../components/TripMap";
import { ShareTripProvider } from "../context/TripContext";
import { fetchSharedTrip } from "../lib/supabase";
import type { Trip } from "../types/trip";
import styles from "./ShareView.module.css";

export function ShareView() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing share ID");
      setLoading(false);
      return;
    }
    fetchSharedTrip(id)
      .then((t) => {
        setTrip(t ?? null);
        if (!t) setError("Trip not found");
      })
      .catch(() => setError("Failed to load trip"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{error ?? "Trip not found"}</div>
      </div>
    );
  }

  return (
    <ShareTripProvider trip={trip}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>{trip.name}</h1>
          <span className={styles.badge}>View only</span>
        </header>
        <div className={styles.tabs}>
          <section className={styles.section}>
            <h2>Plan</h2>
            <TripPlan readOnly />
          </section>
          <section className={styles.section}>
            <h2>Itinerary</h2>
            <TripItinerary readOnly />
          </section>
          <section className={styles.section}>
            <h2>Action items</h2>
            <ActionItems readOnly />
          </section>
          <section className={styles.section}>
            <h2>Map</h2>
            <TripMap waypoints={trip.routeWaypoints ?? []} editable={false} />
          </section>
        </div>
      </div>
    </ShareTripProvider>
  );
}
