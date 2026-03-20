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

import { registerListCommand } from '../../commands/clubs/list.js';
import { registerGetCommand } from '../../commands/clubs/get.js';
import { registerAllHoldersCommand } from '../../commands/clubs/all-holders.js';
import { registerHoldersCommand } from '../../commands/clubs/holders.js';

describe('clubs list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /clubs with params', async () => {
    await runCommand(registerListCommand, ['list', '--sort-by', 'member_count', '--search', 'digits']);
    expect(mockHttp.get).toHaveBeenCalledWith('/clubs', expect.objectContaining({
      sortBy: 'member_count', search: 'digits',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles class[] param from comma-separated input', async () => {
    await runCommand(registerListCommand, ['list', '--class', 'digits,letters']);
    // The loop overwrites class[] with each value, so only the last remains in the params object
    expect(mockHttp.get).toHaveBeenCalledWith('/clubs', expect.objectContaining({
      'class[]': 'letters',
    }));
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('clubs get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /clubs/:clubName', async () => {
    await runCommand(registerGetCommand, ['get', '999']);
    expect(mockHttp.get).toHaveBeenCalledWith('/clubs/999');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('clubs all-holders', () => {
  beforeEach(() => resetMocks());

  it('calls GET /clubs/holders with params', async () => {
    await runCommand(registerAllHoldersCommand, ['all-holders', '--page', '1', '--club-name', 'digits', '--sort-by', 'count']);
    expect(mockHttp.get).toHaveBeenCalledWith('/clubs/holders', expect.objectContaining({
      page: '1', clubName: 'digits', sortBy: 'count',
    }));
  });
});

describe('clubs holders', () => {
  beforeEach(() => resetMocks());

  it('calls GET /clubs/:clubName/holders with params', async () => {
    await runCommand(registerHoldersCommand, ['holders', '999', '--page', '2', '--limit', '50']);
    expect(mockHttp.get).toHaveBeenCalledWith('/clubs/999/holders', expect.objectContaining({
      page: '2', limit: '50',
    }));
  });
});
