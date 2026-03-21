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

import { registerAlsoViewedCommand } from '../../commands/recommendations/also-viewed.js';
import { registerSimilarCommand } from '../../commands/recommendations/similar.js';
import { registerByVotesCommand } from '../../commands/recommendations/by-votes.js';
import { registerForYouCommand } from '../../commands/recommendations/for-you.js';

describe('recommendations also-viewed', () => {
  beforeEach(() => resetMocks());

  it('calls GET /recommendations/also-viewed with params', async () => {
    await runCommand(registerAlsoViewedCommand, ['also-viewed', 'test.eth', '--limit', '10']);
    expect(mockHttp.get).toHaveBeenCalledWith('/recommendations/also-viewed', {
      name: 'test.eth', limit: '10',
    });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerAlsoViewedCommand, ['also-viewed', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

// Auth-required recommendation commands
const authCommands = [
  { name: 'similar', register: registerSimilarCommand, path: '/recommendations/similar-to-watchlist' },
  { name: 'by-votes', register: registerByVotesCommand, path: '/recommendations/based-on-votes' },
  { name: 'for-you', register: registerForYouCommand, path: '/recommendations/for-you' },
];

for (const { name, register, path } of authCommands) {
  describe(`recommendations ${name}`, () => {
    beforeEach(() => resetMocks());

    it(`calls ensureAuth then GET ${path}`, async () => {
      await runCommand(register, [name, '--limit', '5']);
      expect(mockEnsureAuth).toHaveBeenCalled();
      expect(mockHttp.get).toHaveBeenCalledWith(path, { limit: '5' });
      expect(mockPrintOutput).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      mockEnsureAuth.mockRejectedValue(new Error('not authed'));
      await runCommand(register, [name]);
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}
