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

import { registerFeedCommand } from '../../commands/activity/feed.js';
import { registerByNameCommand } from '../../commands/activity/by-name.js';
import { registerByAddressCommand } from '../../commands/activity/by-address.js';

describe('activity feed', () => {
  beforeEach(() => resetMocks());

  it('calls GET /activity with params', async () => {
    await runCommand(registerFeedCommand, ['feed', '--page', '1', '--event-type', 'sale', '--club', 'any']);
    expect(mockHttp.get).toHaveBeenCalledWith('/activity', expect.objectContaining({
      page: '1', event_type: 'sale', club: 'any',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerFeedCommand, ['feed']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('activity by-name', () => {
  beforeEach(() => resetMocks());

  it('calls GET /activity/:name with params', async () => {
    await runCommand(registerByNameCommand, ['by-name', 'test.eth', '--page', '2', '--platform', 'grails']);
    expect(mockHttp.get).toHaveBeenCalledWith('/activity/test.eth', expect.objectContaining({
      page: '2', platform: 'grails',
    }));
  });
});

describe('activity by-address', () => {
  beforeEach(() => resetMocks());

  it('calls GET /activity/address/:address with params', async () => {
    await runCommand(registerByAddressCommand, ['by-address', '0xabc', '--event-type', 'listing']);
    expect(mockHttp.get).toHaveBeenCalledWith('/activity/address/0xabc', expect.objectContaining({
      event_type: 'listing',
    }));
  });
});
