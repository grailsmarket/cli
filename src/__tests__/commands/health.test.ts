import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError,
  mockCreateHttpClient, resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerCheckCommand } from '../../commands/health/check.js';
import { registerReadyCommand } from '../../commands/health/ready.js';

describe('health check', () => {
  beforeEach(() => resetMocks());

  it('calls request /health with skipAuth', async () => {
    await runCommand(registerCheckCommand, ['check']);
    expect(mockHttp.request).toHaveBeenCalledWith('/health', { skipAuth: true });
    expect(mockPrintOutput).toHaveBeenCalledWith({ result: 'ok' }, expect.any(Object));
  });

  it('handles errors', async () => {
    mockHttp.request.mockRejectedValue(new Error('fail'));
    await runCommand(registerCheckCommand, ['check']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('health ready', () => {
  beforeEach(() => resetMocks());

  it('calls request /health/ready with skipAuth', async () => {
    await runCommand(registerReadyCommand, ['ready']);
    expect(mockHttp.request).toHaveBeenCalledWith('/health/ready', { skipAuth: true });
    expect(mockPrintOutput).toHaveBeenCalledWith({ result: 'ok' }, expect.any(Object));
  });

  it('handles errors', async () => {
    mockHttp.request.mockRejectedValue(new Error('fail'));
    await runCommand(registerReadyCommand, ['ready']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
