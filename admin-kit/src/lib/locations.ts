import { db } from "@/lib/db";
import type { Location } from "@prisma/client";

export async function getLocations(): Promise<Location[]> {
  return db.location
    .findMany({ where: { published: true }, orderBy: { sort: "asc" } })
    .catch(() => [] as Location[]);
}

/** Full one-line address for display. */
export function formatAddress(l: Location): string {
  return [l.address, [l.city, l.state].filter(Boolean).join(", "), l.zip]
    .filter(Boolean)
    .join(", ");
}

/**
 * Turn-by-turn link for one store. Coordinates beat a text search: searching
 * the business name sends each visitor to whichever branch is nearest *them*, which
 * is exactly how customers ended up at the wrong store.
 */
export function directionsUrl(l: Location): string {
  if (l.mapsUrl?.startsWith("http")) return l.mapsUrl;
  if (l.lat != null && l.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(l))}`;
}

/** With several stores, one pin sends most visitors to the wrong shop — route
 *  them to the picker instead. Single-store setups keep the direct pin. */
export async function directionsTarget(settings: Record<string, string>): Promise<string> {
  const locations = await getLocations();
  if (locations.length > 1) return "/locations";
  if (locations.length === 1) return directionsUrl(locations[0]);
  if (settings.maps_url?.startsWith("http")) return settings.maps_url;
  const q = settings.address || settings.business_name || "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
