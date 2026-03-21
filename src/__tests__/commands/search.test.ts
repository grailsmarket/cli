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

import { registerQueryCommand } from '../../commands/search/query.js';
import { registerBulkCommand } from '../../commands/search/bulk.js';
import { registerBulkFiltersCommand } from '../../commands/search/bulk-filters.js';

describe('search query', () => {
  beforeEach(() => resetMocks());

  it('calls GET /search with query params', async () => {
    await runCommand(registerQueryCommand, ['query', 'vitalik', '--page', '1', '--sort-by', 'price']);
    expect(mockHttp.get).toHaveBeenCalledWith('/search', expect.objectContaining({
      q: 'vitalik', page: '1', sortBy: 'price',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerQueryCommand, ['query', 'test']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('search bulk', () => {
  beforeEach(() => resetMocks());

  it('splits comma-separated terms and posts', async () => {
    await runCommand(registerBulkCommand, ['bulk', 'foo.eth, bar.eth, baz.eth']);
    expect(mockHttp.post).toHaveBeenCalledWith('/search/bulk', {
      terms: ['foo.eth', 'bar.eth', 'baz.eth'],
      page: undefined,
      limit: undefined,
    });
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('parses page and limit as integers', async () => {
    await runCommand(registerBulkCommand, ['bulk', 'a.eth', '--page', '2', '--limit', '10']);
    expect(mockHttp.post).toHaveBeenCalledWith('/search/bulk', {
      terms: ['a.eth'],
      page: 2,
      limit: 10,
    });
  });

  it('handles errors', async () => {
    mockHttp.post.mockRejectedValue(new Error('fail'));
    await runCommand(registerBulkCommand, ['bulk', 'x.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('search bulk-filters', () => {
  beforeEach(() => resetMocks());

  it('accepts --data JSON override', async () => {
    await runCommand(registerBulkFiltersCommand, ['bulk-filters', 'ignored', '--data', '{"terms":["custom.eth"]}']);
    expect(mockHttp.post).toHaveBeenCalledWith('/search/bulk-filters', { terms: ['custom.eth'] });
  });

  it('builds body from flags when no --data', async () => {
    await runCommand(registerBulkFiltersCommand, ['bulk-filters', 'a.eth,b.eth', '--page', '1', '--sort-by', 'price']);
    expect(mockHttp.post).toHaveBeenCalledWith('/search/bulk-filters', expect.objectContaining({
      terms: ['a.eth', 'b.eth'],
      page: 1,
      sortBy: 'price',
    }));
  });
});
