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

import { registerListCommand } from '../../commands/notifications/list.js';
import { registerUnreadCountCommand } from '../../commands/notifications/unread-count.js';
import { registerMarkReadCommand } from '../../commands/notifications/mark-read.js';
import { registerMarkAllReadCommand } from '../../commands/notifications/mark-all-read.js';

describe('notifications list', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /notifications with params', async () => {
    await runCommand(registerListCommand, ['list', '--page', '1', '--limit', '10', '--unread-only']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/notifications', expect.objectContaining({
      page: '1', limit: '10', unreadOnly: 'true',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('omits unreadOnly when flag not set', async () => {
    await runCommand(registerListCommand, ['list']);
    expect(mockHttp.get).toHaveBeenCalledWith('/notifications', expect.objectContaining({
      unreadOnly: undefined,
    }));
  });

  it('handles errors', async () => {
    mockEnsureAuth.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('notifications unread-count', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then GET /notifications/unread/count', async () => {
    await runCommand(registerUnreadCountCommand, ['unread-count']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith('/notifications/unread/count');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('notifications mark-read', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then PATCH /notifications/:id/read', async () => {
    await runCommand(registerMarkReadCommand, ['mark-read', '42']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.patch).toHaveBeenCalledWith('/notifications/42/read');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('notifications mark-all-read', () => {
  beforeEach(() => resetMocks());

  it('calls ensureAuth then PATCH /notifications/read-all', async () => {
    await runCommand(registerMarkAllReadCommand, ['mark-all-read']);
    expect(mockEnsureAuth).toHaveBeenCalled();
    expect(mockHttp.patch).toHaveBeenCalledWith('/notifications/read-all');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});
