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

import { registerGetCommand } from '../../commands/google-metrics/get.js';

describe('google-metrics get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /google-metrics/:name', async () => {
    await runCommand(registerGetCommand, ['get', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/google-metrics/test.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
