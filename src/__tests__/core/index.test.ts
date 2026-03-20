import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';

// Mock siwe and viem to avoid ethers dependency
vi.mock('siwe', () => ({
  SiweMessage: vi.fn(),
}));
vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(),
}));

// We cannot directly import index.ts because it runs parseAsync at module scope.
// Instead, test createProgram by dynamically importing and intercepting the side effect.
vi.mock('../../index.js', async (importOriginal) => {
  // Prevent the top-level parseAsync from running during import
  const origParseAsync = Command.prototype.parseAsync;
  Command.prototype.parseAsync = vi.fn().mockResolvedValue(undefined) as any;
  const mod = await importOriginal<typeof import('../../index.js')>();
  Command.prototype.parseAsync = origParseAsync;
  return mod;
});

import { createProgram } from '../../index.js';

describe('createProgram', () => {
  it('creates a program with name and version', () => {
    const program = createProgram();
    expect(program.name()).toBe('grails');
    expect(program.version()).toBe('0.1.0');
  });

  it('registers all 31 command groups', () => {
    const program = createProgram();
    const commands = program.commands.map(c => c.name());
    const expectedGroups = [
      'health', 'auth', 'names', 'listings', 'offers', 'sales', 'search',
      'activity', 'clubs', 'trending', 'profiles', 'analytics', 'charts',
      'leaderboard', 'legends', 'ens-roles', 'google-metrics', 'votes',
      'brokered-listings', 'poap', 'personas', 'orders', 'users', 'ai',
      'recommendations', 'watchlist', 'cart', 'notifications', 'user-insights',
      'verification', 'subgraph',
    ];
    for (const group of expectedGroups) {
      expect(commands).toContain(group);
    }
    expect(commands.length).toBe(31);
  });

  it('has --human and --quiet global options', () => {
    const program = createProgram();
    const opts = program.options.map(o => o.long);
    expect(opts).toContain('--human');
    expect(opts).toContain('--quiet');
  });
});
