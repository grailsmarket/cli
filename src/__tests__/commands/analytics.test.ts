import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError,
  mockCreateHttpClient, mockEnsureAuth, resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../auth.js', () => ({
  ensureAuth: mockEnsureAuth,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerMarketCommand } from '../../commands/analytics/market.js';
import { registerClubCommand } from '../../commands/analytics/club.js';
import { registerPriceTrendsCommand } from '../../commands/analytics/price-trends.js';
import { registerVolumeCommand } from '../../commands/analytics/volume.js';
import { registerRegistrationsCommand } from '../../commands/analytics/registrations.js';
import { registerRegistrationsByLengthCommand } from '../../commands/analytics/registrations-by-length.js';
import { registerSalesCommand } from '../../commands/analytics/sales.js';
import { registerListingsCommand } from '../../commands/analytics/listings.js';
import { registerOffersCommand } from '../../commands/analytics/offers.js';
import { registerUserCommand } from '../../commands/analytics/user.js';

// Simple period-only analytics commands
const simplePeriodCommands = [
  { name: 'market', register: registerMarketCommand, path: '/analytics/market' },
  { name: 'price-trends', register: registerPriceTrendsCommand, path: '/analytics/price-trends' },
  { name: 'volume', register: registerVolumeCommand, path: '/analytics/volume' },
  { name: 'registrations-by-length', register: registerRegistrationsByLengthCommand, path: '/analytics/registrations/by-length' },
];

for (const { name, register, path } of simplePeriodCommands) {
  describe(`analytics ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls GET ${path} with period`, async () => {
      await runCommand(register, [name, '--period', '30d']);
      expect(mockHttp.get).toHaveBeenCalledWith(path, { period: '30d' });
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('uses default period 7d', async () => {
      await runCommand(register, [name]);
      expect(mockHttp.get).toHaveBeenCalledWith(path, { period: '7d' });
    });

    it('handles errors', async () => {
      mockHttp.get.mockRejectedValue(new Error('fail'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}

describe('analytics club', () => {
  beforeEach(() => resetMocks());

  it('calls GET /analytics/clubs/:clubName with period', async () => {
    await runCommand(registerClubCommand, ['club', '999', '--period', '30d']);
    expect(mockHttp.get).toHaveBeenCalledWith('/analytics/clubs/999', { period: '30d' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('uses default period 7d', async () => {
    await runCommand(registerClubCommand, ['club', '999']);
    expect(mockHttp.get).toHaveBeenCalledWith('/analytics/clubs/999', { period: '7d' });
  });
});

// Complex analytics commands with sorting, pagination, clubs[]
const complexCommands = [
  { name: 'registrations', register: registerRegistrationsCommand, path: '/analytics/registrations' },
  { name: 'sales', register: registerSalesCommand, path: '/analytics/sales' },
  { name: 'listings', register: registerListingsCommand, path: '/analytics/listings' },
  { name: 'offers', register: registerOffersCommand, path: '/analytics/offers' },
];

for (const { name, register, path } of complexCommands) {
  describe(`analytics ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls GET ${path} with defaults`, async () => {
      await runCommand(register, [name]);
      expect(mockHttp.get).toHaveBeenCalledWith(path, expect.objectContaining({
        period: '7d', sortBy: 'date', sortOrder: 'desc',
      }));
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('passes clubs[] param', async () => {
      await runCommand(register, [name, '--clubs', 'digits,letters']);
      expect(mockHttp.get).toHaveBeenCalledWith(path, expect.objectContaining({
        'clubs[]': 'digits,letters',
      }));
    });

    it('handles errors', async () => {
      mockHttp.get.mockRejectedValue(new Error('fail'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}

describe('analytics user', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /analytics/user/me', async () => {
    await runCommand(registerUserCommand, ['user']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/analytics/user/me', { period: '7d' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('passes custom period', async () => {
    await runCommand(registerUserCommand, ['user', '--period', '90d']);
    expect(mockHttp.get).toHaveBeenCalledWith('/analytics/user/me', { period: '90d' });
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerUserCommand, ['user']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
