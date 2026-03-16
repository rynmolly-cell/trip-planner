import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteWaypoint } from "../types/trip";
import styles from "./TripMap.module.css";

// Use divIcon (inline SVG) to avoid external image requests that can cause "connection failed"
const defaultIcon = L.divIcon({
  html: '<div style="background:#3388ff;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);margin-left:-12px;margin-top:-24px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function MapUpdater({ waypoints }: { waypoints: RouteWaypoint[] }) {
  const map = useMap();
  const hasPoints = waypoints.length > 0;
  if (hasPoints && waypoints.length === 1) {
    map.setView([waypoints[0].lat, waypoints[0].lng], 12);
  } else if (hasPoints) {
    const bounds = L.latLngBounds(
      waypoints.map((w) => [w.lat, w.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  return null;
}

interface TripMapProps {
  waypoints: RouteWaypoint[];
  editable?: boolean;
  onAddWaypoint?: (lat: number, lng: number, label: string) => void;
  onRemoveWaypoint?: (index: number) => void;
  onUpdateWaypoint?: (index: number, label: string) => void;
}

export function TripMap({
  waypoints,
  editable = false,
}: TripMapProps) {
  const defaultCenter: [number, number] = useMemo(
    () =>
      waypoints.length > 0
        ? [waypoints[0].lat, waypoints[0].lng]
        : [-41.5, 173],
    [waypoints]
  );

  return (
    <div className={styles.container}>
      <MapContainer
        center={defaultCenter}
        zoom={waypoints.length > 0 ? 10 : 5}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <MapUpdater waypoints={waypoints} />
        {waypoints.map((wp, i) => (
          <Marker key={i} position={[wp.lat, wp.lng]} icon={defaultIcon}>
            <Popup>{wp.label || `Waypoint ${i + 1}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {waypoints.length === 0 && (
        <p className={styles.hint}>
          Add waypoints in the Plan tab to see your route on the map.
        </p>
      )}
    </div>
  );
}
