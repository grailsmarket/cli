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

import { registerListCommand } from '../../commands/personas/list.js';
import { registerMeCommand } from '../../commands/personas/me.js';
import { registerReclassifyCommand } from '../../commands/personas/reclassify.js';

describe('personas list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /personas', async () => {
    await runCommand(registerListCommand, ['list']);
    expect(mockHttp.get).toHaveBeenCalledWith('/personas');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('personas me', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /personas/me', async () => {
    await runCommand(registerMeCommand, ['me']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/personas/me');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('personas reclassify', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then POST /personas/me/reclassify', async () => {
    await runCommand(registerReclassifyCommand, ['reclassify']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/personas/me/reclassify');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerReclassifyCommand, ['reclassify']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
