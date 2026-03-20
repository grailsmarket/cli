import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError,
  mockCreateHttpClient, resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerSalesCommand } from '../../commands/charts/sales.js';
import { registerVolumeCommand } from '../../commands/charts/volume.js';
import { registerListingsCommand } from '../../commands/charts/listings.js';
import { registerRegistrationsCommand } from '../../commands/charts/registrations.js';
import { registerOffersCommand } from '../../commands/charts/offers.js';

const chartEndpoints = [
  { name: 'sales', register: registerSalesCommand, path: '/charts/sales' },
  { name: 'volume', register: registerVolumeCommand, path: '/charts/volume' },
  { name: 'listings', register: registerListingsCommand, path: '/charts/listings' },
  { name: 'registrations', register: registerRegistrationsCommand, path: '/charts/registrations' },
  { name: 'offers', register: registerOffersCommand, path: '/charts/offers' },
];

for (const { name, register, path } of chartEndpoints) {
  describe(`charts ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls GET ${path} with params`, async () => {
      await runCommand(register, [name, '--period', '30d', '--club', 'digits']);
      expect(mockHttp.get).toHaveBeenCalledWith(path, { period: '30d', club: 'digits' });
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('uses default period 7d', async () => {
      await runCommand(register, [name]);
      expect(mockHttp.get).toHaveBeenCalledWith(path, expect.objectContaining({ period: '7d' }));
    });

    it('handles errors', async () => {
      mockHttp.get.mockRejectedValue(new Error('fail'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}
