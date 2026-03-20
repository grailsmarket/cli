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

import { registerViewsCommand } from '../../commands/trending/views.js';
import { registerWatchlistCommand } from '../../commands/trending/watchlist.js';
import { registerVotesCommand } from '../../commands/trending/votes.js';
import { registerSalesCommand } from '../../commands/trending/sales.js';
import { registerOffersCommand } from '../../commands/trending/offers.js';
import { registerCompositeCommand } from '../../commands/trending/composite.js';

const trendingEndpoints = [
  { name: 'views', register: registerViewsCommand, path: '/trending/views' },
  { name: 'watchlist', register: registerWatchlistCommand, path: '/trending/watchlist' },
  { name: 'votes', register: registerVotesCommand, path: '/trending/votes' },
  { name: 'sales', register: registerSalesCommand, path: '/trending/sales' },
  { name: 'offers', register: registerOffersCommand, path: '/trending/offers' },
  { name: 'composite', register: registerCompositeCommand, path: '/trending/composite' },
];

for (const { name, register, path } of trendingEndpoints) {
  describe(`trending ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls GET ${path} with params`, async () => {
      await runCommand(register, [name, '--period', '7d', '--limit', '25']);
      expect(mockHttp.get).toHaveBeenCalledWith(path, expect.objectContaining({
        period: '7d', limit: '25',
      }));
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      mockHttp.get.mockRejectedValue(new Error('fail'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}
