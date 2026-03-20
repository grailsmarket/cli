import { getApiUrl, getToken } from './config.js';
import { CLIError, exitCodeFromStatus } from './errors.js';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  timeout?: number;
}

interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: Record<string, unknown>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly retryDelay: number;

  constructor(options?: { baseUrl?: string; timeout?: number; retries?: number; retryDelay?: number }) {
    this.baseUrl = options?.baseUrl || getApiUrl();
    this.timeout = options?.timeout || 30000;
    this.retries = options?.retries ?? 3;
    this.retryDelay = options?.retryDelay || 1000;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const prefix = path.startsWith('/health') ? '' : '/api/v1';
    const url = new URL(`${prefix}${path}`, this.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, skipAuth = false, timeout = this.timeout } = options;
    const url = this.buildUrl(path);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (!skipAuth) {
      const token = getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    let lastError: Error | undefined;
    const maxAttempts = this.retries + 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json() as APIResponse<T>;

        if (!response.ok || !data.success) {
          const error = data.error || { code: 'UNKNOWN_ERROR', message: `Request failed with status ${response.status}` };

          // Retry on rate limit
          if (response.status === 429 && attempt < maxAttempts) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : this.retryDelay * Math.pow(2, attempt - 1);
            await this.sleep(delay);
            continue;
          }

          // Retry on server errors
          if (response.status >= 500 && attempt < maxAttempts) {
            await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
            continue;
          }

          throw new CLIError(error.message, error.code, response.status, exitCodeFromStatus(response.status));
        }

        return data.data as T;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof CLIError) throw error;

        lastError = error as Error;

        if (attempt < maxAttempts && !(error instanceof CLIError)) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
          continue;
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let fullPath = path;
    if (params) {
      const url = new URL('http://placeholder' + path);
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
      fullPath = url.pathname + url.search;
    }
    return this.request<T>(fullPath);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

let defaultClient: HttpClient | undefined;

export function createHttpClient(options?: { baseUrl?: string }): HttpClient {
  if (!options && defaultClient) return defaultClient;
  const client = new HttpClient(options);
  if (!options) defaultClient = client;
  return client;
}
