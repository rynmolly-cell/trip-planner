# Trip Planner

A web app for planning and visualizing trips: day-by-day itineraries, huts, distances, transport between stays, action items, and a map. Share links with friends so they can view your trip plans.

## Features

- **Multi-trip tabs** – One tab per trip; create, switch, and delete trips
- **Plan** – Trip name, dates, notes, route waypoints for the map
- **Itinerary** – Day-by-day huts, distances, and transport (bus/train/shuttle)
- **Action items** – Checklist with due dates
- **Map** – Leaflet map with route waypoints
- **Share** – Get a link to share with friends (read-only view)
- **Pastel aesthetic** – Soft cream, lavender, mint, peach palette

## Quick start

```bash
cd trip-planner
npm install
npm run dev
```

Open http://localhost:5173

## Sharing without Supabase

Sharing works out of the box without any backend. When you click **Share**, the app embeds the trip data in the URL. This works for smaller trips; very long itineraries may hit URL length limits.

## Sharing with Supabase (optional)

For larger trips or persistent shared links:

1. Create a [Supabase](https://supabase.com) project
2. Run this SQL in the SQL Editor:

```sql
create table trips (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  created_at timestamptz default now()
);

-- Allow anonymous read (for shared links)
alter table trips enable row level security;

create policy "Anyone can read trips"
  on trips for select
  using (true);

create policy "Anyone can insert trips"
  on trips for insert
  with check (true);
```

3. Copy your project URL and anon key from Supabase → Settings → API
4. Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart the dev server

## Deploy (shareable with friends)

To share links with friends, the app must be hosted publicly. Localhost only works on your machine.

**Option 1: Vercel (recommended)**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Deploy (no config needed – `vercel.json` is included)
4. Your app is live at `https://your-project.vercel.app`
5. Click **Share** in the app – the link (e.g. `https://your-project.vercel.app/share/xyz`) works for friends

**Option 2: Netlify**

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build` | Publish directory: `dist`
4. Deploy – `netlify.toml` handles SPA routing for share links

**Sharing without Supabase** – Works immediately once deployed. Share embeds trip data in the URL; friends open the link and see the read-only trip.

**Sharing with Supabase** – Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your host’s env vars for shorter, persistent links.

## Tech stack

- React 18, Vite
- React Router
- Leaflet + react-leaflet + OpenStreetMap
- Supabase (optional, for sharing)
