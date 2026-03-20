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

import { registerGetCommand } from '../../commands/profiles/get.js';

describe('profiles get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /profiles/:addressOrName', async () => {
    await runCommand(registerGetCommand, ['get', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/profiles/0xabc');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('encodes name in URL', async () => {
    await runCommand(registerGetCommand, ['get', 'test name.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/profiles/test%20name.eth');
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', '0xabc']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
