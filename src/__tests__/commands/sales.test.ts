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

import { registerListCommand } from '../../commands/sales/list.js';
import { registerByNameCommand } from '../../commands/sales/by-name.js';
import { registerByAddressCommand } from '../../commands/sales/by-address.js';
import { registerAnalyticsCommand } from '../../commands/sales/analytics.js';

describe('sales list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /sales with params', async () => {
    await runCommand(registerListCommand, ['list', '--page', '1', '--limit', '10']);
    expect(mockHttp.get).toHaveBeenCalledWith('/sales', { page: '1', limit: '10' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('sales by-name', () => {
  beforeEach(() => resetMocks());

  it('calls GET /sales/name/:name with params', async () => {
    await runCommand(registerByNameCommand, ['by-name', 'test.eth', '--page', '2']);
    expect(mockHttp.get).toHaveBeenCalledWith('/sales/name/test.eth', expect.objectContaining({
      page: '2',
    }));
  });
});

describe('sales by-address', () => {
  beforeEach(() => resetMocks());

  it('calls GET /sales/address/:address with params', async () => {
    await runCommand(registerByAddressCommand, ['by-address', '0xabc', '--type', 'buyer']);
    expect(mockHttp.get).toHaveBeenCalledWith('/sales/address/0xabc', expect.objectContaining({
      type: 'buyer',
    }));
  });
});

describe('sales analytics', () => {
  beforeEach(() => resetMocks());

  it('calls GET /sales/:nameOrId/analytics', async () => {
    await runCommand(registerAnalyticsCommand, ['analytics', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/sales/test.eth/analytics');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});
