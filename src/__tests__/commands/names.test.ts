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

import { registerListCommand } from '../../commands/names/list.js';
import { registerGetCommand } from '../../commands/names/get.js';
import { registerMetadataCommand } from '../../commands/names/metadata.js';
import { registerLegacyCommand } from '../../commands/names/legacy.js';
import { registerHistoryCommand } from '../../commands/names/history.js';

describe('names list', () => {
  beforeEach(() => resetMocks());

  it('calls GET /names with params', async () => {
    await runCommand(registerListCommand, ['list', '--page', '2', '--limit', '10', '--owner', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names', expect.objectContaining({
      page: '2', limit: '10', owner: '0xabc',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerListCommand, ['list']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('names get', () => {
  beforeEach(() => resetMocks());

  it('calls GET /names/:name', async () => {
    await runCommand(registerGetCommand, ['get', 'vitalik.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names/vitalik.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('encodes name in URL', async () => {
    await runCommand(registerGetCommand, ['get', 'test name.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names/test%20name.eth');
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerGetCommand, ['get', 'x.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('names metadata', () => {
  beforeEach(() => resetMocks());

  it('calls GET /names/:name/metadata', async () => {
    await runCommand(registerMetadataCommand, ['metadata', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names/test.eth/metadata');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('names legacy', () => {
  beforeEach(() => resetMocks());

  it('calls GET /names/:name/legacy', async () => {
    await runCommand(registerLegacyCommand, ['legacy', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names/test.eth/legacy');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('names history', () => {
  beforeEach(() => resetMocks());

  it('calls GET /names/:name/history with pagination', async () => {
    await runCommand(registerHistoryCommand, ['history', 'test.eth', '--page', '1', '--limit', '5']);
    expect(mockHttp.get).toHaveBeenCalledWith('/names/test.eth/history', {
      page: '1', limit: '5',
    });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});
