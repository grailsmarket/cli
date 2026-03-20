import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list <address>')
    .description('Get brokered listings by broker address')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--status <status>', 'Filter by status (active, sold, cancelled, expired, unfunded)')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/brokered-listings/broker/${encodeURIComponent(address)}`, {
          page: opts.page,
          limit: opts.limit,
          status: opts.status,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
