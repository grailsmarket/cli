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

import { registerGetCommand } from '../../commands/offers/get.js';
import { registerByNameCommand } from '../../commands/offers/by-name.js';
import { registerByBuyerCommand } from '../../commands/offers/by-buyer.js';
import { registerByOwnerCommand } from '../../commands/offers/by-owner.js';
import { registerCreateCommand } from '../../commands/offers/create.js';
import { registerUpdateCommand } from '../../commands/offers/update.js';

describe('offers get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /offers/:id', async () => {
    await runCommand(registerGetCommand, ['get', '99']);
    expect(mockHttp.get).toHaveBeenCalledWith('/offers/99');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', '99']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('offers by-name', () => {
  beforeEach(() => resetMocks());

  it('calls GET /offers/name/:name with params', async () => {
    await runCommand(registerByNameCommand, ['by-name', 'test.eth', '--page', '1', '--status', 'pending']);
    expect(mockHttp.get).toHaveBeenCalledWith('/offers/name/test.eth', expect.objectContaining({
      page: '1', status: 'pending',
    }));
  });
});

describe('offers by-buyer', () => {
  beforeEach(() => resetMocks());

  it('calls GET /offers/buyer/:address with params', async () => {
    await runCommand(registerByBuyerCommand, ['by-buyer', '0xabc', '--page', '2', '--limit', '5']);
    expect(mockHttp.get).toHaveBeenCalledWith('/offers/buyer/0xabc', expect.objectContaining({
      page: '2', limit: '5',
    }));
  });
});

describe('offers by-owner', () => {
  beforeEach(() => resetMocks());

  it('calls GET /offers/owner/:address with params', async () => {
    await runCommand(registerByOwnerCommand, ['by-owner', '0xdef', '--status', 'accepted']);
    expect(mockHttp.get).toHaveBeenCalledWith('/offers/owner/0xdef', expect.objectContaining({
      status: 'accepted',
    }));
  });
});

describe('offers create', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerCreateCommand, ['create', '--data', '{"ensNameId":1}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/offers', { ensNameId: 1 });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerCreateCommand, ['create', '--ens-name-id', '5', '--buyer-address', '0xabc', '--offer-amount-wei', '100']);
    expect(mockHttp.post).toHaveBeenCalledWith('/offers', expect.objectContaining({
      ensNameId: 5,
      buyerAddress: '0xabc',
      offerAmountWei: '100',
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerCreateCommand, ['create', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('offers update', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerUpdateCommand, ['update', '42', '--data', '{"status":"accepted"}']);
    expect(mockHttp.put).toHaveBeenCalledWith('/offers/42', { status: 'accepted' });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerUpdateCommand, ['update', '42', '--offer-amount-wei', '200', '--status', 'pending']);
    expect(mockHttp.put).toHaveBeenCalledWith('/offers/42', expect.objectContaining({
      offerAmountWei: '200',
      status: 'pending',
    }));
  });
});
