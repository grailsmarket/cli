import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerManageableNamesCommand(parent: Command) {
  parent
    .command('manageable-names <address>')
    .description('Get names manageable by an address')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/ens-roles/users/${encodeURIComponent(address)}/manageable-names`, {
          page: opts.page,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
