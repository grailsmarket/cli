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

import { registerRolesCommand } from '../../commands/ens-roles/roles.js';
import { registerCanManageCommand } from '../../commands/ens-roles/can-manage.js';
import { registerManageableNamesCommand } from '../../commands/ens-roles/manageable-names.js';

describe('ens-roles roles', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ens-roles/names/:name/roles', async () => {
    await runCommand(registerRolesCommand, ['roles', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ens-roles/names/test.eth/roles');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerRolesCommand, ['roles', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('ens-roles can-manage', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ens-roles/names/:name/can-manage/:address', async () => {
    await runCommand(registerCanManageCommand, ['can-manage', 'test.eth', '0xabc']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ens-roles/names/test.eth/can-manage/0xabc');
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('ens-roles manageable-names', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ens-roles/users/:address/manageable-names with params', async () => {
    await runCommand(registerManageableNamesCommand, ['manageable-names', '0xabc', '--page', '1', '--limit', '10']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ens-roles/users/0xabc/manageable-names', {
      page: '1', limit: '10',
    });
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});
