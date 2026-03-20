import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByAddressCommand(parent: Command) {
  parent
    .command('by-address <address>')
    .description('Get sales by address')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--type <type>', 'Filter by role (buyer, seller, both)', 'both')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/sales/address/${encodeURIComponent(address)}`, {
          page: opts.page,
          limit: opts.limit,
          type: opts.type,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
