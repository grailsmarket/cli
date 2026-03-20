import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError, mockCreateHttpClient,
  mockEnsureAuth, mockLogin, mockLogout, mockGetAuthStatus,
  resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../auth.js', () => ({
  login: mockLogin,
  logout: mockLogout,
  ensureAuth: mockEnsureAuth,
  getAuthStatus: mockGetAuthStatus,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerLoginCommand } from '../../commands/auth/login.js';
import { registerLogoutCommand } from '../../commands/auth/logout.js';
import { registerMeCommand } from '../../commands/auth/me.js';
import { registerStatusCommand } from '../../commands/auth/status.js';

describe('auth login', () => {
  beforeEach(() => resetMocks());

  it('calls login() and prints result', async () => {
    await runCommand(registerLoginCommand, ['login']);
    expect(mockLogin).toHaveBeenCalled();
    expect(mockPrintOutput).toHaveBeenCalledWith(
      { address: '0xmock', message: 'Authenticated successfully' },
      expect.any(Object),
    );
  });

  it('handles errors', async () => {
    mockLogin.mockRejectedValue(new Error('no key'));
    await runCommand(registerLoginCommand, ['login']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('auth logout', () => {
  beforeEach(() => resetMocks());

  it('calls logout() and prints success', async () => {
    await runCommand(registerLogoutCommand, ['logout']);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPrintOutput).toHaveBeenCalledWith(
      { message: 'Logged out successfully' },
      expect.any(Object),
    );
  });

  it('handles errors', async () => {
    mockLogout.mockRejectedValue(new Error('fail'));
    await runCommand(registerLogoutCommand, ['logout']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('auth me', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /auth/me', async () => {
    await runCommand(registerMeCommand, ['me']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/auth/me');
    expect(mockPrintOutput).toHaveBeenCalledWith({ result: 'ok' }, expect.any(Object));
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('not authed'));
    await runCommand(registerMeCommand, ['me']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('auth status', () => {
  beforeEach(() => resetMocks());

  it('calls getAuthStatus and prints result', async () => {
    await runCommand(registerStatusCommand, ['status']);
    expect(mockGetAuthStatus).toHaveBeenCalled();
    expect(mockPrintOutput).toHaveBeenCalledWith(
      { authenticated: true, address: '0xmock' },
      expect.any(Object),
    );
  });
});
