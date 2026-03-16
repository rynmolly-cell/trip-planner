import { useState, useCallback } from "react";
import { TabBar } from "../components/TabBar";
import { TripPlan } from "../components/TripPlan";
import TripItinerary from "../components/TripItinerary";
import ActionItems from "../components/ActionItems";
import { TripMap } from "../components/TripMap";
import { useTripContext } from "../context/TripContext";
import { shareTrip } from "../lib/supabase";
import { createDolomites2026Trip } from "../data/dolomites2026";
import { exportTrip, importTripFromFile } from "../utils/exportImport";
import styles from "./Planner.module.css";

const SECTIONS = ["Plan", "Itinerary", "Action items", "Map"] as const;

export function Planner() {
  const {
    trips,
    activeTrip,
    addTrip,
    addTripFromTemplate,
    importTrips,
  } = useTripContext();
  const [activeSection, setActiveSection] =
    useState<(typeof SECTIONS)[number]>("Plan");
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleExport = useCallback(() => {
    if (activeTrip) exportTrip(activeTrip);
  }, [activeTrip]);

  const handleImport = useCallback(() => {
    importTripFromFile((trips) => importTrips(trips));
  }, [importTrips]);

  const handleShare = useCallback(async () => {
    if (!activeTrip) return;
    setSharing(true);
    setShareUrl(null);
    try {
      const url = await shareTrip(activeTrip);
      setShareUrl(url ?? null);
      if (url) {
        await navigator.clipboard.writeText(url);
      }
    } finally {
      setSharing(false);
    }
  }, [activeTrip]);

  if (trips.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No trips yet. Create one to get started!</p>
        <div className={styles.emptyActions}>
          <button type="button" className={styles.addFirst} onClick={addTrip}>
            + New empty trip
          </button>
          <button
            type="button"
            className={styles.loadTemplate}
            onClick={() => addTripFromTemplate(createDolomites2026Trip())}
          >
            Load Dolomites 2026 template
          </button>
        </div>
      </div>
    );
  }

  // If we had trips but deleted the active one, show empty (context sets new active)
  if (!activeTrip) {
    return (
      <div className={styles.empty}>
        <p>Select or create a trip.</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <TabBar />
      <header className={styles.header}>
        <nav className={styles.nav}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.navBtn} ${activeSection === s ? styles.navActive : ""}`}
              onClick={() => setActiveSection(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExport}
            title="Export trip as JSON"
          >
            Export
          </button>
          <button
            type="button"
            className={styles.importBtn}
            onClick={handleImport}
            title="Import trip from JSON file"
          >
            Import
          </button>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? "Sharing…" : "Share"}
          </button>
          {shareUrl && (
            <div className={styles.shareSuccess}>
              Link copied! Share:{" "}
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                {shareUrl}
              </a>
            </div>
          )}
        </div>
      </header>
      <main className={styles.main}>
        {activeSection === "Plan" && <TripPlan />}
        {activeSection === "Itinerary" && <TripItinerary />}
        {activeSection === "Action items" && <ActionItems />}
        {activeSection === "Map" && (
          <TripMap
            waypoints={activeTrip.routeWaypoints ?? []}
            editable={false}
          />
        )}
      </main>
    </div>
  );
}
