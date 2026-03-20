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

import { registerStatsCommand } from '../../commands/poap/stats.js';
import { registerStatusCommand } from '../../commands/poap/status.js';
import { registerClaimCommand } from '../../commands/poap/claim.js';

describe('poap stats', () => {
  beforeEach(() => resetMocks());

  it('calls GET /poap/stats', async () => {
    await runCommand(registerStatsCommand, ['stats']);
    expect(mockHttp.get).toHaveBeenCalledWith('/poap/stats');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerStatsCommand, ['stats']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('poap status', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /poap/status', async () => {
    await runCommand(registerStatusCommand, ['status']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/poap/status');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('poap claim', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then POST /poap/claim', async () => {
    await runCommand(registerClaimCommand, ['claim']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/poap/claim');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerClaimCommand, ['claim']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
