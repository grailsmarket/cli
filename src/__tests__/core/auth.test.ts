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

const mockWCInitialize = vi.fn();
const mockWCConnect = vi.fn();
const mockWCRestoreSession = vi.fn();
const mockWCSignMessage = vi.fn();
const mockWCDisconnect = vi.fn();

vi.mock('../../walletconnect.js', () => ({
  walletConnect: {
    initialize: mockWCInitialize,
    connect: mockWCConnect,
    restoreSession: mockWCRestoreSession,
    signMessage: mockWCSignMessage,
    disconnect: mockWCDisconnect,
  },
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

  it('uses private key flow when GRAILS_PRIVATE_KEY is set', async () => {
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
    // Should NOT touch WalletConnect
    expect(mockWCInitialize).not.toHaveBeenCalled();
  });

  it('uses WalletConnect flow when no private key', async () => {
    delete process.env.GRAILS_PRIVATE_KEY;
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });

    const mockWaitForApproval = vi.fn().mockResolvedValue({ topic: 'wc-topic', address: '0xWCAddr' });
    mockWCConnect.mockResolvedValue({
      uri: 'wc:test-uri',
      waitForApproval: mockWaitForApproval,
    });
    mockWCSignMessage.mockResolvedValue('0xwc-signature');
    mockPost.mockResolvedValue({ token: 'wc-token', user: { address: '0xWCAddr' } });

    // Suppress stderr output during test
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

    const result = await login();

    expect(mockWCInitialize).toHaveBeenCalled();
    expect(mockWCConnect).toHaveBeenCalled();
    expect(mockWCSignMessage).toHaveBeenCalledWith('wc-topic', '0xWCAddr', 'prepared-siwe-message');
    expect(mockSaveConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'wc-token',
        address: '0xWCAddr',
        wcSessionTopic: 'wc-topic',
      }),
    );
    expect(result).toEqual({ token: 'wc-token', address: '0xWCAddr' });

    stderrSpy.mockRestore();
  });

  it('restores existing WalletConnect session when topic is in config', async () => {
    delete process.env.GRAILS_PRIVATE_KEY;
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      wcSessionTopic: 'restored-topic',
    });
    mockWCRestoreSession.mockReturnValue({ topic: 'restored-topic', address: '0xRestoredAddr' });
    mockWCSignMessage.mockResolvedValue('0xrestored-sig');
    mockPost.mockResolvedValue({ token: 'restored-token', user: { address: '0xRestoredAddr' } });

    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

    const result = await login();

    expect(mockWCRestoreSession).toHaveBeenCalledWith('restored-topic');
    // Should NOT call connect (no QR needed)
    expect(mockWCConnect).not.toHaveBeenCalled();
    expect(result).toEqual({ token: 'restored-token', address: '0xRestoredAddr' });

    stderrSpy.mockRestore();
  });

  it('falls back to new connection when restored session is stale', async () => {
    delete process.env.GRAILS_PRIVATE_KEY;
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      wcSessionTopic: 'stale-topic',
    });
    mockWCRestoreSession.mockReturnValue(null); // session gone

    const mockWaitForApproval = vi.fn().mockResolvedValue({ topic: 'new-topic', address: '0xNewAddr' });
    mockWCConnect.mockResolvedValue({
      uri: 'wc:new-uri',
      waitForApproval: mockWaitForApproval,
    });
    mockWCSignMessage.mockResolvedValue('0xnew-sig');
    mockPost.mockResolvedValue({ token: 'new-token', user: { address: '0xNewAddr' } });

    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

    const result = await login();

    expect(mockWCRestoreSession).toHaveBeenCalledWith('stale-topic');
    expect(mockWCConnect).toHaveBeenCalled();
    expect(result).toEqual({ token: 'new-token', address: '0xNewAddr' });

    stderrSpy.mockRestore();
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
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });
    mockPost.mockResolvedValue(undefined);
    await logout();
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('clears auth even when logout request fails', async () => {
    mockGetToken.mockReturnValue('existing-token');
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });
    mockPost.mockRejectedValue(new Error('network error'));
    await logout();
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('skips API call and just clears auth when no token', async () => {
    mockGetToken.mockReturnValue(null);
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });
    await logout();
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('disconnects WalletConnect session on logout', async () => {
    mockGetToken.mockReturnValue('existing-token');
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      wcSessionTopic: 'wc-topic-to-disconnect',
    });
    mockPost.mockResolvedValue(undefined);

    await logout();

    expect(mockWCInitialize).toHaveBeenCalled();
    expect(mockWCDisconnect).toHaveBeenCalledWith('wc-topic-to-disconnect');
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('clears auth even when WC disconnect fails', async () => {
    mockGetToken.mockReturnValue(null);
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      wcSessionTopic: 'wc-topic',
    });
    mockWCDisconnect.mockRejectedValue(new Error('wc error'));

    await logout();

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

  it('auto-logs in when wcSessionTopic is in config', async () => {
    mockGetToken.mockReturnValue(null);
    mockLoadConfig.mockReturnValue({
      apiUrl: 'https://api.test.com',
      wcSessionTopic: 'saved-topic',
    });
    mockWCRestoreSession.mockReturnValue({ topic: 'saved-topic', address: '0xSavedAddr' });
    mockWCSignMessage.mockResolvedValue('0xsaved-sig');
    mockGet.mockResolvedValue({ nonce: 'n', expiresAt: '2099-01-01T00:00:00Z' });
    mockPost.mockResolvedValue({ token: 'wc-auto-token', user: { address: '0xSavedAddr' } });

    const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

    const token = await ensureAuth();
    expect(token).toBe('wc-auto-token');

    stderrSpy.mockRestore();
  });

  it('throws AUTH_REQUIRED when no token, no key, no WC session', async () => {
    mockGetToken.mockReturnValue(null);
    mockLoadConfig.mockReturnValue({ apiUrl: 'https://api.test.com' });
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
