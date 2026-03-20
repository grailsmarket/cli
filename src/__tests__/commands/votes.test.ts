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

import { registerGetCommand } from '../../commands/votes/get.js';
import { registerLeaderboardCommand } from '../../commands/votes/leaderboard.js';
import { registerVoteCommand } from '../../commands/votes/vote.js';

describe('votes get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /votes/:ensName', async () => {
    await runCommand(registerGetCommand, ['get', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/votes/test.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('votes leaderboard', () => {
  beforeEach(() => resetMocks());

  it('calls GET /votes/leaderboard with params', async () => {
    await runCommand(registerLeaderboardCommand, ['leaderboard', '--page', '1', '--sort-by', 'upvotes']);
    expect(mockHttp.get).toHaveBeenCalledWith('/votes/leaderboard', expect.objectContaining({
      page: '1', sortBy: 'upvotes',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('votes vote', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then POST /votes with body', async () => {
    await runCommand(registerVoteCommand, ['vote', '--ens-name', 'test.eth', '--vote', '1']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/votes', {
      ensName: 'test.eth',
      vote: 1,
    });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles downvote', async () => {
    await runCommand(registerVoteCommand, ['vote', '--ens-name', 'test.eth', '--vote', '-1']);
    expect(mockHttp.post).toHaveBeenCalledWith('/votes', {
      ensName: 'test.eth',
      vote: -1,
    });
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerVoteCommand, ['vote', '--ens-name', 'test.eth', '--vote', '1']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
