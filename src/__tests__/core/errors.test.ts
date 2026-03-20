import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CLIError, EXIT_CODES, exitCodeFromStatus, handleError } from '../../errors.js';

describe('CLIError', () => {
  it('sets all properties', () => {
    const err = new CLIError('not found', 'NOT_FOUND', 404, EXIT_CODES.NOT_FOUND);
    expect(err.message).toBe('not found');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.httpStatus).toBe(404);
    expect(err.exitCode).toBe(EXIT_CODES.NOT_FOUND);
    expect(err.name).toBe('CLIError');
  });

  it('defaults exitCode to ERROR', () => {
    const err = new CLIError('fail', 'UNKNOWN');
    expect(err.exitCode).toBe(EXIT_CODES.ERROR);
    expect(err.httpStatus).toBeUndefined();
  });
});

describe('exitCodeFromStatus', () => {
  it('returns AUTH_REQUIRED for 401', () => {
    expect(exitCodeFromStatus(401)).toBe(EXIT_CODES.AUTH_REQUIRED);
  });

  it('returns AUTH_REQUIRED for 403', () => {
    expect(exitCodeFromStatus(403)).toBe(EXIT_CODES.AUTH_REQUIRED);
  });

  it('returns NOT_FOUND for 404', () => {
    expect(exitCodeFromStatus(404)).toBe(EXIT_CODES.NOT_FOUND);
  });

  it('returns VALIDATION for 400', () => {
    expect(exitCodeFromStatus(400)).toBe(EXIT_CODES.VALIDATION);
  });

  it('returns VALIDATION for 422', () => {
    expect(exitCodeFromStatus(422)).toBe(EXIT_CODES.VALIDATION);
  });

  it('returns RATE_LIMITED for 429', () => {
    expect(exitCodeFromStatus(429)).toBe(EXIT_CODES.RATE_LIMITED);
  });

  it('returns ERROR for undefined', () => {
    expect(exitCodeFromStatus(undefined)).toBe(EXIT_CODES.ERROR);
  });

  it('returns ERROR for other status codes', () => {
    expect(exitCodeFromStatus(500)).toBe(EXIT_CODES.ERROR);
    expect(exitCodeFromStatus(503)).toBe(EXIT_CODES.ERROR);
  });
});

describe('handleError', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('handles CLIError', () => {
    const err = new CLIError('not found', 'NOT_FOUND', 404, EXIT_CODES.NOT_FOUND);
    handleError(err);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'NOT_FOUND', message: 'not found', status: 404 },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.NOT_FOUND);
  });

  it('handles network error (fetch failed)', () => {
    handleError(new Error('fetch failed'));
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'NETWORK_ERROR', message: 'fetch failed' },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.NETWORK);
  });

  it('handles network error (ECONNREFUSED)', () => {
    handleError(new Error('ECONNREFUSED'));
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'NETWORK_ERROR', message: 'ECONNREFUSED' },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.NETWORK);
  });

  it('handles AbortError as timeout', () => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    handleError(err);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'TIMEOUT', message: 'Request timed out' },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.TIMEOUT);
  });

  it('handles generic Error', () => {
    handleError(new Error('something broke'));
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'UNKNOWN_ERROR', message: 'something broke' },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.ERROR);
  });

  it('handles non-Error value', () => {
    handleError('string error');
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'UNKNOWN_ERROR', message: 'string error' },
    }));
    expect(exitSpy).toHaveBeenCalledWith(EXIT_CODES.ERROR);
  });
});
