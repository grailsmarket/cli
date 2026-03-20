import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock('../../http.js', () => ({
  createHttpClient: vi.fn(() => ({ get: mockGet, post: mockPost })),
}));

vi.mock('../../config.js', () => ({
  saveConfig: vi.fn(),
  clearAuth: vi.fn(),
  getToken: vi.fn(),
  loadConfig: vi.fn(() => ({ apiUrl: 'https://api.test.com' })),
}));

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(() => ({
    address: '0xTestAddress',
    signMessage: vi.fn().mockResolvedValue('0xsignature'),
  })),
}));

vi.mock('siwe', () => ({
  SiweMessage: vi.fn().mockImplementation(() => ({
    prepareMessage: () => 'prepared-siwe-message',
  })),
}));

import { saveConfig, clearAuth, getToken, loadConfig } from '../../config.js';
import { login, logout, ensureAuth, getAuthStatus } from '../../auth.js';
import { CLIError } from '../../errors.js';

const mockGetToken = vi.mocked(getToken);
const mockSaveConfig = vi.mocked(saveConfig);
const mockClearAuth = vi.mocked(clearAuth);
const mockLoadConfig = vi.mocked(loadConfig);

describe('login', () => {
  const originalKey = process.env.GRAILS_PRIVATE_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GRAILS_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    mockGet.mockResolvedValue({ nonce: 'test-nonce', expiresAt: '2099-01-01T00:00:00Z' });
    mockPost.mockResolvedValue({ token: 'new-token', user: { address: '0xTestAddress' } });
  });

  afterEach(() => {
    if (originalKey !== undefined) {
      process.env.GRAILS_PRIVATE_KEY = originalKey;
    } else {
      delete process.env.GRAILS_PRIVATE_KEY;
    }
  });

  it('throws when GRAILS_PRIVATE_KEY is not set', async () => {
    delete process.env.GRAILS_PRIVATE_KEY;
    await expect(login()).rejects.toThrow(CLIError);
    await expect(login()).rejects.toThrow(/GRAILS_PRIVATE_KEY/);
  });

  it('performs full login flow and saves config', async () => {
    const result = await login();
    expect(mockGet).toHaveBeenCalledWith('/auth/nonce', { address: '0xTestAddress' });
    expect(mockPost).toHaveBeenCalledWith('/auth/verify', {
      message: 'prepared-siwe-message',
      signature: '0xsignature',
    });
    expect(mockSaveConfig).toHaveBeenCalledWith({
      token: 'new-token',
      address: '0xTestAddress',
      expiresAt: '2099-01-01T00:00:00Z',
    });
    expect(result).toEqual({ token: 'new-token', address: '0xTestAddress' });
  });
});

describe('logout', () => {
  const originalKey = process.env.GRAILS_PRIVATE_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GRAILS_PRIVATE_KEY;
  });

  afterEach(() => {
    if (originalKey !== undefined) {
      process.env.GRAILS_PRIVATE_KEY = originalKey;
    } else {
      delete process.env.GRAILS_PRIVATE_KEY;
    }
  });

  it('calls POST /auth/logout and clears auth when token exists', async () => {
    mockGetToken.mockReturnValue('existing-token');
    mockPost.mockResolvedValue(undefined);
    await logout();
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('clears auth even when logout request fails', async () => {
    mockGetToken.mockReturnValue('existing-token');
    mockPost.mockRejectedValue(new Error('network error'));
    await logout();
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('skips API call and just clears auth when no token', async () => {
    mockGetToken.mockReturnValue(null);
    await logout();
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
  });
});

describe('ensureAuth', () => {
  const originalKey = process.env.GRAILS_PRIVATE_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GRAILS_PRIVATE_KEY;
  });

  afterEach(() => {
    if (originalKey !== undefined) {
      process.env.GRAILS_PRIVATE_KEY = originalKey;
    } else {
      delete process.env.GRAILS_PRIVATE_KEY;
    }
  });

  it('returns existing token immediately', async () => {
    mockGetToken.mockReturnValue('valid-token');
    const token = await ensureAuth();
    expect(token).toBe('valid-token');
  });

  it('auto-logs in when private key is available', async () => {
    mockGetToken.mockReturnValue(null);
    process.env.GRAILS_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    mockGet.mockResolvedValue({ nonce: 'n', expiresAt: '2099-01-01T00:00:00Z' });
    mockPost.mockResolvedValue({ token: 'auto-token', user: { address: '0xAuto' } });
    const token = await ensureAuth();
    expect(token).toBe('auto-token');
  });

  it('throws AUTH_REQUIRED when no token and no key', async () => {
    mockGetToken.mockReturnValue(null);
    await expect(ensureAuth()).rejects.toThrow(CLIError);
    await expect(ensureAuth()).rejects.toThrow(/Authentication required/);
  });
});

describe('getAuthStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns authenticated with address when token valid', () => {
    mockGetToken.mockReturnValue('valid');
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      token: 'valid',
      address: '0xAddr',
      expiresAt: '2099-01-01',
    });
    const status = getAuthStatus();
    expect(status).toEqual({
      authenticated: true,
      address: '0xAddr',
      expiresAt: '2099-01-01',
    });
  });

  it('returns unauthenticated when no valid token', () => {
    mockGetToken.mockReturnValue(null);
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });
    const status = getAuthStatus();
    expect(status).toEqual({ authenticated: false });
  });
});
