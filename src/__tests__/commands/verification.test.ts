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

import { registerEmailCommand } from '../../commands/verification/email.js';
import { registerResendCommand } from '../../commands/verification/resend.js';

describe('verification email', () => {
  beforeEach(() => resetMocks());

  it('calls POST /verification/email with token', async () => {
    await runCommand(registerEmailCommand, ['email', 'abc123']);
    expect(mockHttp.post).toHaveBeenCalledWith('/verification/email', { token: 'abc123' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerEmailCommand, ['email', 'abc']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('verification resend', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then POST /verification/resend', async () => {
    await runCommand(registerResendCommand, ['resend']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/verification/resend');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('fail'));
    await runCommand(registerResendCommand, ['resend']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
