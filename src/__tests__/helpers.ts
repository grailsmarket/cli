import { vi } from 'vitest';
import { Command } from 'commander';

export function createMockHttpClient() {
  return {
    get: vi.fn().mockResolvedValue({ result: 'ok' }),
    post: vi.fn().mockResolvedValue({ result: 'ok' }),
    put: vi.fn().mockResolvedValue({ result: 'ok' }),
    patch: vi.fn().mockResolvedValue({ result: 'ok' }),
    delete: vi.fn().mockResolvedValue({ result: 'ok' }),
    request: vi.fn().mockResolvedValue({ result: 'ok' }),
  };
}

export const mockHttp = createMockHttpClient();
export const mockCreateHttpClient = vi.fn(() => mockHttp);
export const mockEnsureAuth = vi.fn().mockResolvedValue('mock-token');
export const mockLogin = vi.fn().mockResolvedValue({ token: 'mock-token', address: '0xmock' });
export const mockLogout = vi.fn().mockResolvedValue(undefined);
export const mockGetAuthStatus = vi.fn().mockReturnValue({ authenticated: true, address: '0xmock' });
export const mockPrintOutput = vi.fn();
export const mockHandleError = vi.fn();

export function resetMocks() {
  for (const fn of Object.values(mockHttp)) {
    (fn as ReturnType<typeof vi.fn>).mockReset().mockResolvedValue({ result: 'ok' });
  }
  mockCreateHttpClient.mockReset().mockReturnValue(mockHttp);
  mockEnsureAuth.mockReset().mockResolvedValue('mock-token');
  mockLogin.mockReset().mockResolvedValue({ token: 'mock-token', address: '0xmock' });
  mockLogout.mockReset().mockResolvedValue(undefined);
  mockGetAuthStatus.mockReset().mockReturnValue({ authenticated: true, address: '0xmock' });
  mockPrintOutput.mockReset();
  mockHandleError.mockReset();
}

export async function runCommand(
  registerFn: (parent: Command) => void,
  args: string[] = [],
): Promise<void> {
  const program = new Command();
  program.exitOverride();
  program.option('--human', 'Human-readable output');
  program.option('--quiet', 'Quiet output');
  registerFn(program);
  await program.parseAsync(['node', 'test', ...args]);
}
