import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

const mockExistsSync = vi.mocked(existsSync);
const mockMkdirSync = vi.mocked(mkdirSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);

// Must import after mocking
const { loadConfig, saveConfig, clearAuth, getToken, getApiUrl } = await import('../../config.js');

describe('loadConfig', () => {
  const originalEnv = process.env.GRAILS_API_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GRAILS_API_URL;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.GRAILS_API_URL = originalEnv;
    } else {
      delete process.env.GRAILS_API_URL;
    }
  });

  it('returns defaults when config file does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    const config = loadConfig();
    expect(config.apiUrl).toBe('https://api.grails.app');
  });

  it('uses GRAILS_API_URL env var when file does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    process.env.GRAILS_API_URL = 'http://localhost:3000';
    const config = loadConfig();
    expect(config.apiUrl).toBe('http://localhost:3000');
  });

  it('reads and merges config from file', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ token: 'abc', address: '0x123' }));
    const config = loadConfig();
    expect(config.token).toBe('abc');
    expect(config.address).toBe('0x123');
    expect(config.apiUrl).toBe('https://api.grails.app');
  });

  it('falls through to defaults on corrupt file', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('not json');
    const config = loadConfig();
    expect(config.apiUrl).toBe('https://api.grails.app');
  });
});

describe('saveConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates config dir if it does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    saveConfig({ token: 'new-token' });
    expect(mockMkdirSync).toHaveBeenCalledWith(expect.stringContaining('grails-cli'), { recursive: true });
  });

  it('merges with existing config and writes', () => {
    mockExistsSync.mockImplementation((p: any) => {
      return String(p).endsWith('config.json');
    });
    mockReadFileSync.mockReturnValue(JSON.stringify({ apiUrl: 'https://api.grails.app', token: 'old' }));
    saveConfig({ token: 'new' });
    const written = JSON.parse(mockWriteFileSync.mock.calls[0][1] as string);
    expect(written.token).toBe('new');
    expect(written.apiUrl).toBe('https://api.grails.app');
  });
});

describe('clearAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes token, address, and expiresAt', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({
      apiUrl: 'https://api.grails.app',
      token: 'abc',
      address: '0x123',
      expiresAt: '2030-01-01',
    }));
    clearAuth();
    const written = JSON.parse(mockWriteFileSync.mock.calls[0][1] as string);
    expect(written.token).toBeUndefined();
    expect(written.address).toBeUndefined();
    expect(written.expiresAt).toBeUndefined();
    expect(written.apiUrl).toBe('https://api.grails.app');
  });
});

describe('getToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no token', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ apiUrl: 'https://api.grails.app' }));
    expect(getToken()).toBeNull();
  });

  it('returns null when token is expired', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({
      apiUrl: 'https://api.grails.app',
      token: 'abc',
      expiresAt: '2000-01-01T00:00:00Z',
    }));
    expect(getToken()).toBeNull();
  });

  it('returns token when valid and not expired', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({
      apiUrl: 'https://api.grails.app',
      token: 'abc',
      expiresAt: '2099-01-01T00:00:00Z',
    }));
    expect(getToken()).toBe('abc');
  });

  it('returns token when no expiresAt set', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({
      apiUrl: 'https://api.grails.app',
      token: 'abc',
    }));
    expect(getToken()).toBe('abc');
  });
});

describe('getApiUrl', () => {
  const originalEnv = process.env.GRAILS_API_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GRAILS_API_URL;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.GRAILS_API_URL = originalEnv;
    } else {
      delete process.env.GRAILS_API_URL;
    }
  });

  it('returns env var when set', () => {
    process.env.GRAILS_API_URL = 'http://localhost:3000';
    expect(getApiUrl()).toBe('http://localhost:3000');
  });

  it('returns config value when no env var', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ apiUrl: 'https://custom.api.com' }));
    expect(getApiUrl()).toBe('https://custom.api.com');
  });
});
