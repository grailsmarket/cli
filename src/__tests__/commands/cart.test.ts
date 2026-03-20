import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError,
  mockCreateHttpClient, mockEnsureAuth, resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../auth.js', () => ({
  ensureAuth: mockEnsureAuth,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerListCommand } from '../../commands/cart/list.js';
import { registerSummaryCommand } from '../../commands/cart/summary.js';
import { registerAddCommand } from '../../commands/cart/add.js';
import { registerBulkAddCommand } from '../../commands/cart/bulk-add.js';
import { registerRemoveCommand } from '../../commands/cart/remove.js';
import { registerClearCommand } from '../../commands/cart/clear.js';

describe('cart list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /cart with params', async () => {
    await runCommand(registerListCommand, ['list', '--type', 'registration']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/cart', { type: 'registration' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('cart summary', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /cart/summary', async () => {
    await runCommand(registerSummaryCommand, ['summary']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/cart/summary');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('cart add', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerAddCommand, ['add', '--data', '{"ensNameId":1}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/cart', { ensNameId: 1 });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerAddCommand, ['add', '--ens-name-id', '5', '--cart-type', 'registration']);
    expect(mockHttp.post).toHaveBeenCalledWith('/cart', expect.objectContaining({
      ensNameId: 5,
      cartType: 'registration',
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerAddCommand, ['add', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('cart bulk-add', () => {
  beforeEach(() => resetMocks());

  it('posts parsed --data JSON', async () => {
    await runCommand(registerBulkAddCommand, ['bulk-add', '--data', '{"items":[{"id":1}]}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/cart/bulk', { items: [{ id: 1 }] });
  });
});

describe('cart remove', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then DELETE /cart/:id', async () => {
    await runCommand(registerRemoveCommand, ['remove', '42']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.delete).toHaveBeenCalledWith('/cart/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('cart clear', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then request DELETE /cart with body', async () => {
    await runCommand(registerClearCommand, ['clear', '--cart-type', 'registration']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.request).toHaveBeenCalledWith('/cart', {
      method: 'DELETE',
      body: { cartType: 'registration' },
    });
  });

  it('calls request DELETE /cart without body when no type', async () => {
    await runCommand(registerClearCommand, ['clear']);
    expect(mockHttp.request).toHaveBeenCalledWith('/cart', {
      method: 'DELETE',
      body: undefined,
    });
  });

  it('handles errors', async () => {
    mockHttp.request.mockRejectedValue(new Error('fail'));
    await runCommand(registerClearCommand, ['clear']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
