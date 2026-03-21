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

import { registerListsCommand } from '../../commands/watchlist/lists.js';
import { registerListCommand } from '../../commands/watchlist/list.js';
import { registerCheckCommand } from '../../commands/watchlist/check.js';
import { registerSearchCommand } from '../../commands/watchlist/search.js';
import { registerAddCommand } from '../../commands/watchlist/add.js';
import { registerRemoveCommand } from '../../commands/watchlist/remove.js';
import { registerUpdateCommand } from '../../commands/watchlist/update.js';
import { registerCreateListCommand } from '../../commands/watchlist/create-list.js';
import { registerUpdateListCommand } from '../../commands/watchlist/update-list.js';
import { registerDeleteListCommand } from '../../commands/watchlist/delete-list.js';
import { registerBulkAddCommand } from '../../commands/watchlist/bulk-add.js';
import { registerBulkRemoveCommand } from '../../commands/watchlist/bulk-remove.js';

describe('watchlist lists', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /watchlist/lists', async () => {
    await runCommand(registerListsCommand, ['lists']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/watchlist/lists');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('fail'));
    await runCommand(registerListsCommand, ['lists']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('watchlist list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /watchlist with params', async () => {
    await runCommand(registerListCommand, ['list', '--page', '1', '--limit', '10', '--list-id', '5']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/watchlist', {
      page: '1', limit: '10', listId: '5',
    });
  });
});

describe('watchlist check', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /watchlist/check/:name', async () => {
    await runCommand(registerCheckCommand, ['check', 'test.eth']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/watchlist/check/test.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist search', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /watchlist/search with params', async () => {
    await runCommand(registerSearchCommand, ['search', '-q', 'cool', '--sort-by', 'price']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/watchlist/search', expect.objectContaining({
      q: 'cool', sortBy: 'price',
    }));
  });

  it('uses default query *', async () => {
    await runCommand(registerSearchCommand, ['search']);
    expect(mockHttp.get).toHaveBeenCalledWith('/watchlist/search', expect.objectContaining({
      q: '*',
    }));
  });
});

describe('watchlist add', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerAddCommand, ['add', 'ignored', '--data', '{"ensName":"foo.eth"}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/watchlist', { ensName: 'foo.eth' });
  });

  it('builds body from individual flags', async () => {
    await runCommand(registerAddCommand, ['add', 'test.eth', '--list-id', '3']);
    expect(mockHttp.post).toHaveBeenCalledWith('/watchlist', expect.objectContaining({
      ensName: 'test.eth',
      listId: 3,
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerAddCommand, ['add', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('watchlist remove', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then DELETE /watchlist/:id', async () => {
    await runCommand(registerRemoveCommand, ['remove', '42']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.delete).toHaveBeenCalledWith('/watchlist/42');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist update', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then PATCH /watchlist/:id with parsed data', async () => {
    await runCommand(registerUpdateCommand, ['update', '42', '--data', '{"notifyOnSale":false}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.patch).toHaveBeenCalledWith('/watchlist/42', { notifyOnSale: false });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist create-list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then POST /watchlist/lists', async () => {
    await runCommand(registerCreateListCommand, ['create-list', '--name', 'My List']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/watchlist/lists', { name: 'My List' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist update-list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then PATCH /watchlist/lists/:listId', async () => {
    await runCommand(registerUpdateListCommand, ['update-list', '5', '--name', 'Renamed']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.patch).toHaveBeenCalledWith('/watchlist/lists/5', { name: 'Renamed' });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist delete-list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then DELETE /watchlist/lists/:listId', async () => {
    await runCommand(registerDeleteListCommand, ['delete-list', '5']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.delete).toHaveBeenCalledWith('/watchlist/lists/5');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('watchlist bulk-add', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON', async () => {
    await runCommand(registerBulkAddCommand, ['bulk-add', '--data', '{"ensNames":["a.eth","b.eth"]}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith('/watchlist/bulk', { ensNames: ['a.eth', 'b.eth'] });
  });

  it('builds body from flags with comma-separated names', async () => {
    await runCommand(registerBulkAddCommand, ['bulk-add', '--ens-names', 'a.eth, b.eth', '--list-id', '3']);
    expect(mockHttp.post).toHaveBeenCalledWith('/watchlist/bulk', expect.objectContaining({
      ensNames: ['a.eth', 'b.eth'],
      listId: 3,
    }));
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerBulkAddCommand, ['bulk-add', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('watchlist bulk-remove', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON and uses request with DELETE', async () => {
    await runCommand(registerBulkRemoveCommand, ['bulk-remove', '--data', '{"ensNames":["a.eth"]}']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.request).toHaveBeenCalledWith('/watchlist/bulk', {
      method: 'DELETE',
      body: { ensNames: ['a.eth'] },
    });
  });

  it('builds body from comma-separated --ens-names', async () => {
    await runCommand(registerBulkRemoveCommand, ['bulk-remove', '--ens-names', 'a.eth, b.eth']);
    expect(mockHttp.request).toHaveBeenCalledWith('/watchlist/bulk', {
      method: 'DELETE',
      body: { ensNames: ['a.eth', 'b.eth'] },
    });
  });

  it('handles errors', async () => {
    mockHttp.request.mockRejectedValue(new Error('fail'));
    await runCommand(registerBulkRemoveCommand, ['bulk-remove', '--data', '{}']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
