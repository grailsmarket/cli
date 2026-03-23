import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';

vi.mock('../../config.js', () => ({
  getApiUrl: vi.fn(() => 'https://api.test.com'),
  getToken: vi.fn(() => null),
}));

import { getApiUrl, getToken } from '../../config.js';
import { HttpClient, createHttpClient } from '../../http.js';
import { CLIError } from '../../errors.js';

const mockGetApiUrl = vi.mocked(getApiUrl);
const mockGetToken = vi.mocked(getToken);

function mockFetchResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
  } as Response;
}

describe('HttpClient', () => {
  let fetchSpy: MockInstance<[input: string | URL | Request, init?: RequestInit | undefined], Promise<Response>>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse({ success: true, data: { result: 'ok' } }),
    );
    mockGetApiUrl.mockReturnValue('https://api.test.com');
    mockGetToken.mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
    fetchSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('URL building', () => {
    it('adds /api/v1 prefix for non-health paths', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.request('/names/test.eth');
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test.com/api/v1/names/test.eth',
        expect.any(Object),
      );
    });

    it('does not add prefix for /health paths', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.request('/health');
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test.com/health',
        expect.any(Object),
      );
    });
  });

  describe('get()', () => {
    it('appends query params to path', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.get('/names', { page: '1', limit: '20' });
      const url = fetchSpy.mock.calls[0][0] as string;
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
    });

    it('skips undefined params', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.get('/names', { page: '1', limit: undefined });
      const url = fetchSpy.mock.calls[0][0] as string;
      expect(url).toContain('page=1');
      expect(url).not.toContain('limit');
    });

    it('works without params', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.get('/names');
      const url = fetchSpy.mock.calls[0][0] as string;
      expect(url).toBe('https://api.test.com/api/v1/names');
    });
  });

  describe('HTTP methods', () => {
    it('post sends JSON body', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.post('/listings', { name: 'test' });
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        }),
      );
    });

    it('put sends correct method', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.put('/listings/1', { name: 'updated' });
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('patch sends correct method', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.patch('/listings/1', { name: 'patched' });
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' }),
      );
    });

    it('delete sends correct method', async () => {
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.delete('/listings/1');
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('auth headers', () => {
    it('injects Authorization header when token exists', async () => {
      mockGetToken.mockReturnValue('my-token');
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.request('/names');
      const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer my-token');
    });

    it('omits Authorization header when no token', async () => {
      mockGetToken.mockReturnValue(null);
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.request('/names');
      const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
      expect(headers['Authorization']).toBeUndefined();
    });

    it('skips auth when skipAuth is true', async () => {
      mockGetToken.mockReturnValue('my-token');
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await client.request('/health', { skipAuth: true });
      const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('response handling', () => {
    it('unwraps envelope response', async () => {
      fetchSpy.mockResolvedValue(mockFetchResponse({ success: true, data: { id: 1 } }));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      const result = await client.request('/names');
      expect(result).toEqual({ id: 1 });
    });

    it('returns raw JSON for non-envelope responses', async () => {
      fetchSpy.mockResolvedValue(mockFetchResponse({ status: 'healthy' }));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      const result = await client.request('/health');
      expect(result).toEqual({ status: 'healthy' });
    });

    it('throws CLIError on error response', async () => {
      fetchSpy.mockResolvedValue(mockFetchResponse(
        { success: false, error: { code: 'NOT_FOUND', message: 'Not found' } },
        404,
      ));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await expect(client.request('/names/nope')).rejects.toThrow(CLIError);
    });

    it('uses default error when no error in response body', async () => {
      fetchSpy.mockResolvedValue(mockFetchResponse({ success: false }, 500));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 0 });
      await expect(client.request('/fail')).rejects.toThrow(/Request failed with status 500/);
    });
  });

  describe('retry logic', () => {
    it('retries on 429 with exponential backoff', async () => {
      fetchSpy
        .mockResolvedValueOnce(mockFetchResponse(
          { success: false, error: { code: 'RATE_LIMITED', message: 'slow down' } },
          429,
        ))
        .mockResolvedValueOnce(mockFetchResponse({ success: true, data: { ok: true } }));

      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 1, retryDelay: 10 });
      const result = await client.request('/names');
      expect(result).toEqual({ ok: true });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('retries on 429 using Retry-After header', async () => {
      fetchSpy
        .mockResolvedValueOnce(mockFetchResponse(
          { success: false, error: { code: 'RATE_LIMITED', message: 'slow down' } },
          429,
          { 'Retry-After': '1' },
        ))
        .mockResolvedValueOnce(mockFetchResponse({ success: true, data: { ok: true } }));

      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 1, retryDelay: 10 });
      const result = await client.request('/names');
      expect(result).toEqual({ ok: true });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('retries on 5xx errors', async () => {
      fetchSpy
        .mockResolvedValueOnce(mockFetchResponse(
          { success: false, error: { code: 'SERVER_ERROR', message: 'oops' } },
          500,
        ))
        .mockResolvedValueOnce(mockFetchResponse({ success: true, data: { ok: true } }));

      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 1, retryDelay: 10 });
      const result = await client.request('/names');
      expect(result).toEqual({ ok: true });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('retries on network errors', async () => {
      fetchSpy
        .mockRejectedValueOnce(new Error('fetch failed'))
        .mockResolvedValueOnce(mockFetchResponse({ success: true, data: { ok: true } }));

      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 1, retryDelay: 10 });
      const result = await client.request('/names');
      expect(result).toEqual({ ok: true });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('throws after max retries exhausted', async () => {
      fetchSpy.mockRejectedValue(new Error('fetch failed'));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 1, retryDelay: 10 });
      await expect(client.request('/names')).rejects.toThrow('fetch failed');
    });

    it('does not retry CLIError thrown from error response', async () => {
      fetchSpy.mockResolvedValue(mockFetchResponse(
        { success: false, error: { code: 'NOT_FOUND', message: 'nope' } },
        404,
      ));
      const client = new HttpClient({ baseUrl: 'https://api.test.com', retries: 2, retryDelay: 10 });
      await expect(client.request('/names')).rejects.toThrow(CLIError);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createHttpClient', () => {
    it('returns singleton when no options', async () => {
      // Reset the module-level singleton by importing fresh
      // We test through behavior: two calls return same instance
      const a = createHttpClient();
      const b = createHttpClient();
      expect(a).toBe(b);
    });

    it('creates new instance with custom options', () => {
      const a = createHttpClient();
      const b = createHttpClient({ baseUrl: 'https://custom.api.com' });
      expect(a).not.toBe(b);
    });
  });
});
