import type { Trip, Day, ActionItem, TransportSegment } from "../types/trip";

function id() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

const DAYS: Omit<Day, "id">[] = [
  {
    date: "2026-09-04",
    hutFrom: "Fly into Venice (VCE) or Innsbruck",
    hutTo: "Venice (overnight)",
    notes:
      "Arrive by Fri 9/4 evening. Venice Treviso (TSF) also works. Cheaper to stay Venice ($60–$200) than Dobbiaco ($400+). VeniceSanellaAppartament: $111/3 beds. Venice Casa: $87/2 beds. Buy flights 2–3 months out for cheapest.",
    transport: [
      {
        type: "other",
        description: "Flixbus VCE → Dobbiaco $35, 11:35am–2:19pm once daily",
        required: true,
      },
      {
        type: "bus",
        description: "Bus 444 Dobbiaco → Rif. Auronzo. Reserve 30 days ahead.",
        required: true,
        url: "https://www.sii.bz.it/",
      },
    ],
  },
  {
    date: "2026-09-05",
    hutFrom: "Rif. Auronzo",
    hutTo: "Rifugio Locatelli (Drei Zinnen Hütte)",
    distanceKm: 10,
    distanceMi: 6.2,
    notes:
      "Tre Cime di Lavaredo. Best sunrise/sunset at Locatelli. Hike Auronzo→Locatelli ~90 min. Goal: Sat sunset + Sun sunrise. 1617 ft gain, 3.5–4 hrs. MIA BOOKED.",
    transport: [
      {
        type: "bus",
        description: "Bus 444 Dobbiaco → Rif. Auronzo (book ahead)",
        required: true,
      },
    ],
  },
  {
    date: "2026-09-06",
    hutFrom: "Lago di Braies",
    hutTo: "Rifugio Biella",
    distanceKm: 6.4,
    distanceMi: 4,
    notes:
      "AV1 Day 1. Bus 444 Auronzo→Dobbiaco, then 442 to Lago di Braies. Chill/swim at lake, then 3 hr hike. Rif. Sennes full, Biella instead (6-person room). 3208 ft gain. JULIET BOOKED €360 (€180 deposit paid).",
    transport: [
      {
        type: "bus",
        description: "Bus 444 Rif. Auronzo → Dobbiaco",
        required: true,
      },
      {
        type: "bus",
        description: "Bus 442 Dobbiaco → Lago di Braies (AV1 start)",
        required: true,
      },
    ],
  },
  {
    date: "2026-09-07",
    hutFrom: "Rifugio Biella",
    hutTo: "Rifugio Muntagnoles",
    distanceKm: 12.9,
    distanceMi: 8,
    notes: "AV1 Day 2. Alt: Rif. Lavarella / Fanes. 4–5 hours. CAMI BOOKED.",
    transport: [],
  },
  {
    date: "2026-09-08",
    hutFrom: "Rifugio Muntagnoles",
    hutTo: "Rifugio Nuvolau (via Lagazuoi cable car)",
    distanceKm: 14,
    distanceMi: 8.7,
    notes:
      "AV1 Day 3. Via Rif. Lagazuoi (incredible sunset, book early). Cable car $17.50. Alt: Rif. Averau. 5–6 hrs. Nuvolau booking OPENS FEB 7. Emailed Staulanza, Fedare, others.",
    transport: [
      {
        type: "other",
        description: "Lagazuoi cable car ~$17.50",
        required: true,
      },
    ],
  },
  {
    date: "2026-09-09",
    hutFrom: "Rifugio Nuvolau",
    hutTo: "Rifugio Aquileia",
    distanceKm: 17.7,
    distanceMi: 11,
    notes: "AV1 Day 4. ~7 hours. MIA BOOKED.",
    transport: [],
  },
  {
    date: "2026-09-10",
    hutFrom: "Rifugio Aquileia",
    hutTo: "Rifugio Vazzoler",
    distanceKm: 17.7,
    distanceMi: 11,
    notes: "AV1 Day 5. ~7 hours. MIA BOOKED.",
    transport: [],
  },
  {
    date: "2026-09-11",
    hutFrom: "Rifugio Vazzoler",
    hutTo: "Rifugio Carestiato",
    distanceKm: 10,
    distanceMi: 6.2,
    notes: "AV1 Day 6. 4 hours. MIA BOOKED.",
    transport: [],
  },
  {
    date: "2026-09-12",
    hutFrom: "Rifugio Carestiato",
    hutTo: "Rifugio Sommariva al Pramperet",
    distanceKm: 14,
    distanceMi: 8.7,
    notes: "AV1 Day 7. Alt: Rif. Pian de Fontana. 5 hrs. MOLLY BOOKED (with Mia's $).",
    transport: [],
  },
  {
    date: "2026-09-13",
    hutFrom: "Rifugio Sommariva al Pramperet",
    hutTo: "La Pissa bus stop",
    distanceKm: 10.9,
    distanceMi: 6.8,
    notes:
      "AV1 Day 8. Hike down. 5.5 hrs downhill. Sleep in Belluno.",
    transport: [
      {
        type: "bus",
        description: "La Pissa → Belluno (arrange transport)",
        required: true,
      },
    ],
  },
  {
    date: "2026-09-14",
    hutFrom: "Belluno",
    hutTo: "Venice (fly out)",
    notes:
      "Belluno → Venice: Train 1h45–2h, €8–12 (Trenitalia). Bus ~2h15m, €8–12 to Mestre.",
    transport: [
      {
        type: "train",
        description: "Belluno → Venice Santa Lucia (Trenitalia)",
        required: true,
        url: "https://www.trenitalia.com",
      },
    ],
  },
];

const ACTION_ITEMS: Omit<ActionItem, "id">[] = [
  { text: "Book Rifugio Nuvolau (opens Feb 7)", dueDate: "2026-02-07", done: false },
  { text: "Confirm all hut reservations by April–May", dueDate: "2026-05-01", done: false },
  { text: "Book Bus 444 Dobbiaco↔Rif. Auronzo (30 days ahead)", dueDate: "2026-08-05", done: false },
  { text: "Book Venice accommodation (allow cancellation)", dueDate: "2026-08-01", done: false },
  { text: "Buy flights 2–3 months out (SFO→VCE cheapest ~$596)", dueDate: "2026-06-01", done: false },
  { text: "Recheck all bookings, weather, trail status (June)", dueDate: "2026-06-01", done: false },
  { text: "Rif. Locatelli – MIA BOOKED", dueDate: undefined, done: true },
  { text: "Rif. Biella – JULIET BOOKED & paid €180", dueDate: undefined, done: true },
  { text: "Rif. Muntagnoles – CAMI BOOKED", dueDate: undefined, done: true },
  { text: "Rif. Aquileia – MIA BOOKED", dueDate: undefined, done: true },
  { text: "Rif. Vazzoler – MIA BOOKED", dueDate: undefined, done: true },
  { text: "Rif. Carestiato – MIA BOOKED", dueDate: undefined, done: true },
  { text: "Rif. Sommariva – MOLLY BOOKED", dueDate: undefined, done: true },
];

// Approximate Dolomites/Alta Via 1 waypoints for map
const WAYPOINTS = [
  { lat: 46.6945, lng: 12.0854, label: "Lago di Braies" },
  { lat: 46.6306, lng: 12.2897, label: "Tre Cime / Rif. Auronzo" },
  { lat: 46.6266, lng: 12.2839, label: "Rif. Locatelli" },
  { lat: 46.635, lng: 11.98, label: "Rif. Biella" },
  { lat: 46.58, lng: 11.92, label: "Rif. Muntagnoles" },
  { lat: 46.5389, lng: 12.0058, label: "Rif. Lagazuoi" },
  { lat: 46.5133, lng: 12.0311, label: "Rif. Nuvolau" },
  { lat: 46.45, lng: 12.08, label: "Rif. Aquileia" },
  { lat: 46.38, lng: 11.98, label: "Rif. Vazzoler" },
  { lat: 46.32, lng: 11.91, label: "Rif. Carestiato" },
  { lat: 46.25, lng: 11.86, label: "Rif. Sommariva" },
  { lat: 46.1428, lng: 12.2166, label: "Belluno" },
  { lat: 45.4408, lng: 12.3155, label: "Venice" },
];

export function createDolomites2026Trip(): Trip {
  return {
    id: id(),
    name: "Dolomites Summer 2026",
    startDate: "2026-09-04",
    endDate: "2026-09-15",
    notes: `When to Go: Late June–mid Sept. September = GOAT (fewer crowds, stable weather). July–Aug more crowded, afternoon storms. June may have snow on high passes.

When to Book: Oct–Dec (prior year) huts open; Jan–Mar flights/transport; Apr–May confirm all; June recheck. For Sept: bookings locked by Apr–May, many by Dec–Feb.

Resources:
• 9-day route: fieldmag.com, muchbetteradventures.com, 57hours.com, hikehowyoulike.com
• Transport: reddit.com/r/ItalyTravel
• Housing: maps.app.goo.gl/aVvpDpN63n1xaami7`,
    days: DAYS.map((d) => ({ ...d, id: id(), transport: (d.transport ?? []) as TransportSegment[] })),
    actionItems: ACTION_ITEMS.map((a) => ({ ...a, id: id() })),
    routeWaypoints: WAYPOINTS,
  };
}
