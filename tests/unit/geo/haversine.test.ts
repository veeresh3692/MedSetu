// ==============================================================================
// MEDICOMPARE INDIA — HAVERSINE GEOSPATIAL TEST SUITE
// Test Suite: tests/unit/geo/haversine.test.ts
// Governance: AGENTS.md, Rule 01 (Hyperlocal Discovery)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  calculateBoundingBox,
} from '../../../src/lib/geo/haversine';

describe('Geospatial Distance Utilities (Haversine)', () => {
  // Real coordinates in Bengaluru:
  // Indiranagar 100 Feet Road: 12.9719° N, 77.6412° E
  // Koramangala 80 Feet Road: 12.9344° N, 77.6239° E
  // Distance between Indiranagar and Koramangala is approximately 4.5 km - 4.8 km

  it('should accurately calculate distance between Indiranagar and Koramangala', () => {
    const dist = calculateHaversineDistance(12.9719, 77.6412, 12.9344, 77.6239);
    expect(dist).toBeGreaterThan(4.2);
    expect(dist).toBeLessThan(4.8);
  });

  it('should return 0.0 km for identical coordinates', () => {
    const dist = calculateHaversineDistance(12.9719, 77.6412, 12.9719, 77.6412);
    expect(dist).toBe(0.0);
  });

  it('should calculate valid bounding box for 5km radius around Bengaluru center', () => {
    const centerLat = 12.9716;
    const centerLng = 77.5946;
    const bbox = calculateBoundingBox(centerLat, centerLng, 5);

    expect(bbox.minLat).toBeLessThan(centerLat);
    expect(bbox.maxLat).toBeGreaterThan(centerLat);
    expect(bbox.minLng).toBeLessThan(centerLng);
    expect(bbox.maxLng).toBeGreaterThan(centerLng);

    // Delta latitude should be approx 5 / 111 = 0.045 degrees
    expect(bbox.maxLat - centerLat).toBeCloseTo(0.045, 2);
  });
});

