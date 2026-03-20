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

import { registerQueryCommand } from '../../commands/subgraph/query.js';

describe('subgraph query', () => {
  beforeEach(() => resetMocks());

  it('posts parsed --data JSON to /subgraph', async () => {
    await runCommand(registerQueryCommand, ['query', '--data', '{"query":"{ domains { name } }"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/subgraph', { query: '{ domains { name } }' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerQueryCommand, ['query', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
