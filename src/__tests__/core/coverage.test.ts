import { describe, it, expect } from 'vitest';
import { ENDPOINTS, getCoverageStats, getUnimplementedByPhase, getUniqueGroups } from '../../coverage.js';

describe('ENDPOINTS', () => {
  it('has 124 endpoints', () => {
    expect(ENDPOINTS.length).toBe(124);
  });

  it('all endpoints are implemented', () => {
    const unimplemented = ENDPOINTS.filter(e => !e.implemented);
    expect(unimplemented).toHaveLength(0);
  });
});

describe('getCoverageStats', () => {
  it('returns correct totals', () => {
    const stats = getCoverageStats();
    expect(stats.total).toBe(124);
    expect(stats.implemented).toBe(124);
    expect(stats.percentage).toBe(100);
  });

  it('returns stats by phase', () => {
    const stats = getCoverageStats();
    expect(stats.byPhase).toHaveLength(4);
    for (const phase of stats.byPhase) {
      expect(phase.total).toBe(phase.implemented);
    }
  });

  it('phase 0 has 4 endpoints', () => {
    const stats = getCoverageStats();
    expect(stats.byPhase[0].total).toBe(4);
  });
});

describe('getUnimplementedByPhase', () => {
  it('returns empty array when all implemented', () => {
    expect(getUnimplementedByPhase(0)).toHaveLength(0);
    expect(getUnimplementedByPhase(1)).toHaveLength(0);
    expect(getUnimplementedByPhase(2)).toHaveLength(0);
    expect(getUnimplementedByPhase(3)).toHaveLength(0);
  });
});

describe('getUniqueGroups', () => {
  it('returns all unique groups', () => {
    const groups = getUniqueGroups();
    expect(groups.length).toBeGreaterThan(0);
    expect(groups).toContain('health');
    expect(groups).toContain('auth');
    expect(groups).toContain('watchlist');
    expect(groups).toContain('subgraph');
    // Should be unique
    expect(groups.length).toBe(new Set(groups).size);
  });
});
