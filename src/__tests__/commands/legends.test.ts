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

import { registerGetCommand } from '../../commands/legends/get.js';
import { registerDetailsCommand } from '../../commands/legends/details.js';

describe('legends get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /legends/:address', async () => {
    await runCommand(registerGetCommand, ['get', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/legends/0xabc');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', '0xabc']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('legends details', () => {
  beforeEach(() => resetMocks());

  it('calls GET /legends/:address/details with type', async () => {
    await runCommand(registerDetailsCommand, ['details', '0xabc', '--type', 'collector']);
    expect(mockHttp.get).toHaveBeenCalledWith('/legends/0xabc/details', expect.objectContaining({
      type: 'collector',
    }));
  });

  it('works without type filter', async () => {
    await runCommand(registerDetailsCommand, ['details', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/legends/0xabc/details', expect.any(Object));
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});
