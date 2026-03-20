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

import { registerConfigCommand } from '../../commands/brokered-listings/config.js';
import { registerListCommand } from '../../commands/brokered-listings/list.js';
import { registerStatsCommand } from '../../commands/brokered-listings/stats.js';
import { registerCreateCommand } from '../../commands/brokered-listings/create.js';

describe('brokered-listings config', () => {
  beforeEach(() => resetMocks());

  it('calls GET /brokered-listings/config', async () => {
    await runCommand(registerConfigCommand, ['config']);
    expect(mockHttp.get).toHaveBeenCalledWith('/brokered-listings/config');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerConfigCommand, ['config']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('brokered-listings list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /brokered-listings/broker/:address with params', async () => {
    await runCommand(registerListCommand, ['list', '0xabc', '--page', '1', '--status', 'active']);
    expect(mockHttp.get).toHaveBeenCalledWith('/brokered-listings/broker/0xabc', expect.objectContaining({
      page: '1', status: 'active',
    }));
  });
});

describe('brokered-listings stats', () => {
  beforeEach(() => resetMocks());

  it('calls GET /brokered-listings/stats', async () => {
    await runCommand(registerStatsCommand, ['stats']);
    expect(mockHttp.get).toHaveBeenCalledWith('/brokered-listings/stats');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('brokered-listings create', () => {
  beforeEach(() => resetMocks());

  it('posts parsed --data JSON', async () => {
    await runCommand(registerCreateCommand, ['create', '--data', '{"token_id":"1","price_wei":"100"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/brokered-listings', { token_id: '1', price_wei: '100' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerCreateCommand, ['create', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
