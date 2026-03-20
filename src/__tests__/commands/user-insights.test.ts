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

import { registerViewedCommand } from '../../commands/user-insights/viewed.js';
import { registerWatchedCommand } from '../../commands/user-insights/watched.js';
import { registerVotedCommand } from '../../commands/user-insights/voted.js';
import { registerOffersCommand } from '../../commands/user-insights/offers.js';
import { registerPurchasesCommand } from '../../commands/user-insights/purchases.js';
import { registerSalesCommand } from '../../commands/user-insights/sales.js';

const insightEndpoints = [
  { name: 'viewed', register: registerViewedCommand, path: '/user/history/viewed' },
  { name: 'watched', register: registerWatchedCommand, path: '/user/history/watched' },
  { name: 'voted', register: registerVotedCommand, path: '/user/history/voted' },
  { name: 'offers', register: registerOffersCommand, path: '/user/history/offers' },
  { name: 'purchases', register: registerPurchasesCommand, path: '/user/history/purchases' },
  { name: 'sales', register: registerSalesCommand, path: '/user/history/sales' },
];

for (const { name, register, path } of insightEndpoints) {
  describe(`user-insights ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls ensureAuth then GET ${path} with params`, async () => {
      await runCommand(register, [name, '--page', '1', '--limit', '10']);
      expect(mockEnsureAuth).toHaveBeenCalled();
      expect(mockHttp.get).toHaveBeenCalledWith(path, { page: '1', limit: '10' });
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      mockEnsureAuth.mockRejectedValue(new Error('fail'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}
