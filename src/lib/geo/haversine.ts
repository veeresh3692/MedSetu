// ==============================================================================
// MEDICOMPARE INDIA — HAVERSINE GEOSPATIAL DISTANCE UTILITY
// File: src/lib/geo/haversine.ts
// Governance: AGENTS.md, Rule 01 (Hyperlocal Discovery)
// ==============================================================================

const EARTH_RADIUS_KM = 6371.0;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Calculates the great-circle distance in kilometers between two GPS coordinates using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 in degrees
 * @param lng1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lng2 Longitude of point 2 in degrees
 * @returns Distance in kilometers rounded to two decimal places
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLng / 2.0) * Math.sin(dLng / 2.0);

  const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 100) / 100;
}

/**
 * Bounding box pre-filter for spatial queries.
 * Calculates approximate min/max latitude and longitude bounds for a given radius in km.
 */
export function calculateBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  // 1 degree of latitude is approximately 111.0 km
  const latDelta = radiusKm / 111.0;
  // 1 degree of longitude varies by cosine of latitude
  const lngDelta = radiusKm / (111.0 * Math.cos(toRadians(lat)));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

