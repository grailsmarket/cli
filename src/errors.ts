export const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  AUTH_REQUIRED: 2,
  VALIDATION: 3,
  NOT_FOUND: 4,
  RATE_LIMITED: 5,
  NETWORK: 10,
  TIMEOUT: 11,
} as const;

export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus?: number,
    public readonly exitCode: number = EXIT_CODES.ERROR,
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

export function exitCodeFromStatus(status?: number): number {
  if (!status) return EXIT_CODES.ERROR;
  if (status === 401 || status === 403) return EXIT_CODES.AUTH_REQUIRED;
  if (status === 404) return EXIT_CODES.NOT_FOUND;
  if (status === 422 || status === 400) return EXIT_CODES.VALIDATION;
  if (status === 429) return EXIT_CODES.RATE_LIMITED;
  return EXIT_CODES.ERROR;
}

export function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.log(JSON.stringify({
      ok: false,
      error: { code: error.code, message: error.message, status: error.httpStatus },
    }));
    process.exit(error.exitCode);
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.log(JSON.stringify({
        ok: false,
        error: { code: 'NETWORK_ERROR', message: error.message },
      }));
      process.exit(EXIT_CODES.NETWORK);
    }
    if (error.name === 'AbortError') {
      console.log(JSON.stringify({
        ok: false,
        error: { code: 'TIMEOUT', message: 'Request timed out' },
      }));
      process.exit(EXIT_CODES.TIMEOUT);
    }
    console.log(JSON.stringify({
      ok: false,
      error: { code: 'UNKNOWN_ERROR', message: error.message },
    }));
    process.exit(EXIT_CODES.ERROR);
  }

  const message = (typeof error === 'object' && error !== null)
    ? ('message' in error ? String((error as Record<string, unknown>).message) : JSON.stringify(error))
    : String(error);
  console.log(JSON.stringify({
    ok: false,
    error: { code: 'UNKNOWN_ERROR', message },
  }));
  process.exit(EXIT_CODES.ERROR);
}
