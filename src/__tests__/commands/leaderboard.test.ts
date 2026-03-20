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

import { registerGlobalCommand } from '../../commands/leaderboard/global.js';

describe('leaderboard global', () => {
  beforeEach(() => resetMocks());

  it('calls GET /leaderboard with params', async () => {
    await runCommand(registerGlobalCommand, ['global', '--page', '1', '--sort-by', 'names_owned', '--clubs', 'digits']);
    expect(mockHttp.get).toHaveBeenCalledWith('/leaderboard', expect.objectContaining({
      page: '1', sortBy: 'names_owned', 'clubs[]': 'digits',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGlobalCommand, ['global']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
