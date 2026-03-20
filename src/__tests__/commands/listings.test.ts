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

import { registerListCommand } from '../../commands/listings/list.js';
import { registerGetCommand } from '../../commands/listings/get.js';
import { registerByNameCommand } from '../../commands/listings/by-name.js';
import { registerCreateCommand } from '../../commands/listings/create.js';
import { registerUpdateCommand } from '../../commands/listings/update.js';
import { registerDeleteCommand } from '../../commands/listings/delete.js';

describe('listings list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /listings with params', async () => {
    await runCommand(registerListCommand, ['list', '--page', '1', '--seller', '0xabc', '--min-price', '100']);
    expect(mockHttp.get).toHaveBeenCalledWith('/listings', expect.objectContaining({
      page: '1', seller: '0xabc', minPrice: '100',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('listings get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /listings/:id', async () => {
    await runCommand(registerGetCommand, ['get', '42']);
    expect(mockHttp.get).toHaveBeenCalledWith('/listings/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('listings by-name', () => {
  beforeEach(() => resetMocks());

  it('calls GET /listings/name/:name', async () => {
    await runCommand(registerByNameCommand, ['by-name', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/listings/name/test.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('listings create', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerCreateCommand, ['create', '--data', '{"ensNameId":1,"priceWei":"100"}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/listings', { ensNameId: 1, priceWei: '100' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerCreateCommand, ['create', '--ens-name-id', '5', '--seller-address', '0xabc', '--price-wei', '200']);
    expect(mockHttp.post).toHaveBeenCalledWith('/listings', expect.objectContaining({
      ensNameId: 5,
      sellerAddress: '0xabc',
      priceWei: '200',
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerCreateCommand, ['create', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('listings update', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerUpdateCommand, ['update', '42', '--data', '{"priceWei":"300"}']);
    expect(mockHttp.put).toHaveBeenCalledWith('/listings/42', { priceWei: '300' });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerUpdateCommand, ['update', '42', '--price-wei', '300', '--expires-at', '2099-01-01']);
    expect(mockHttp.put).toHaveBeenCalledWith('/listings/42', expect.objectContaining({
      priceWei: '300',
      expiresAt: '2099-01-01',
    }));
  });
});

describe('listings delete', () => {
  beforeEach(() => resetMocks());

  it('calls DELETE /listings/:id', async () => {
    await runCommand(registerDeleteCommand, ['delete', '42']);
    expect(mockHttp.delete).toHaveBeenCalledWith('/listings/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.delete.mockRejectedValue(new Error('fail'));
    await runCommand(registerDeleteCommand, ['delete', '42']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
