import { createClient } from "@supabase/supabase-js";
import type { Trip } from "../types/trip";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const TABLE = "trips";

export async function shareTrip(trip: Trip): Promise<string | null> {
  if (!supabase) {
    try {
      const base = window.location.origin;
      const id = crypto.randomUUID();
      const encoded = encodeURIComponent(
        btoa(unescape(encodeURIComponent(JSON.stringify(trip))))
      );
      return `${base}/share/${id}?data=${encoded}`;
    } catch {
      return null;
    }
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ id: crypto.randomUUID(), data: trip })
    .select("id")
    .single();
  if (error || !data) return null;
  return `${window.location.origin}/share/${data.id}`;
}

export async function fetchSharedTrip(id: string): Promise<Trip | null> {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get("data");
  if (dataParam) {
    try {
      const decoded = JSON.parse(
        decodeURIComponent(escape(atob(decodeURIComponent(dataParam))))
      );
      return decoded as Trip;
    } catch {
      return null;
    }
  }
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data.data as Trip;
}
