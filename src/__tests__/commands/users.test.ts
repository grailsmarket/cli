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

import { registerBadgesCommand } from '../../commands/users/badges.js';
import { registerBalancesCommand } from '../../commands/users/balances.js';
import { registerUpdateCommand } from '../../commands/users/update.js';

describe('users badges', () => {
  beforeEach(() => resetMocks());

  it('calls GET /users/:address/badges', async () => {
    await runCommand(registerBadgesCommand, ['badges', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/users/0xabc/badges');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerBadgesCommand, ['badges', '0xabc']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('users balances', () => {
  beforeEach(() => resetMocks());

  it('calls GET /users/:address/balances', async () => {
    await runCommand(registerBalancesCommand, ['balances', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/users/0xabc/balances');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('users update', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then PATCH /users/me with --data', async () => {
    await runCommand(registerUpdateCommand, ['update', '--data', '{"email":"a@b.com"}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.patch).toHaveBeenCalledWith('/users/me', { email: 'a@b.com' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerUpdateCommand, ['update', '--email', 'a@b.com', '--telegram', '@user', '--discord', 'user#1']);
    expect(mockHttp.patch).toHaveBeenCalledWith('/users/me', expect.objectContaining({
      email: 'a@b.com',
      telegram: '@user',
      discord: 'user#1',
    }));
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerUpdateCommand, ['update', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
