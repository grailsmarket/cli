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

import { registerGetCommand } from '../../commands/orders/get.js';
import { registerSaveCommand } from '../../commands/orders/save.js';
import { registerCreateCommand } from '../../commands/orders/create.js';
import { registerValidateCommand } from '../../commands/orders/validate.js';
import { registerCancelCommand } from '../../commands/orders/cancel.js';
import { registerBulkSaveCommand } from '../../commands/orders/bulk-save.js';

describe('orders get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /orders/:id', async () => {
    await runCommand(registerGetCommand, ['get', '42']);
    expect(mockHttp.get).toHaveBeenCalledWith('/orders/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', '42']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('orders save', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerSaveCommand, ['save', '--data', '{"type":"listing","token_id":"1"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders', { type: 'listing', token_id: '1' });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerSaveCommand, ['save', '--type', 'listing', '--token-id', '1', '--price-wei', '100', '--source', 'grails']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders', expect.objectContaining({
      type: 'listing',
      token_id: '1',
      price_wei: '100',
      source: 'grails',
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerSaveCommand, ['save', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('orders create', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerCreateCommand, ['create', '--data', '{"tokenId":"1","price":"100"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders/create', { tokenId: '1', price: '100' });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerCreateCommand, ['create', '--token-id', '1', '--price', '100', '--duration', '30']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders/create', expect.objectContaining({
      tokenId: '1',
      price: '100',
      duration: 30,
    }));
  });
});

describe('orders validate', () => {
  beforeEach(() => resetMocks());

  it('posts parsed --data JSON', async () => {
    await runCommand(registerValidateCommand, ['validate', '--data', '{"order_hash":"0x123"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders/validate', { order_hash: '0x123' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('orders cancel', () => {
  beforeEach(() => resetMocks());

  it('calls DELETE /orders/:id', async () => {
    await runCommand(registerCancelCommand, ['cancel', '42']);
    expect(mockHttp.delete).toHaveBeenCalledWith('/orders/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('orders bulk-save', () => {
  beforeEach(() => resetMocks());

  it('posts parsed --data JSON', async () => {
    await runCommand(registerBulkSaveCommand, ['bulk-save', '--data', '{"listings":[{"id":1}]}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/orders/bulk', { listings: [{ id: 1 }] });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerBulkSaveCommand, ['bulk-save', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
