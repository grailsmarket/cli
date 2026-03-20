import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCanManageCommand(parent: Command) {
  parent
    .command('can-manage <name> <address>')
    .description('Check if an address can manage an ENS name')
    .action(async (name: string, address: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/ens-roles/names/${encodeURIComponent(name)}/can-manage/${encodeURIComponent(address)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
