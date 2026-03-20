import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRolesCommand(parent: Command) {
  parent
    .command('roles <name>')
    .description('Get all roles (owner, manager, ETH address) for an ENS name')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/ens-roles/names/${encodeURIComponent(name)}/roles`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
