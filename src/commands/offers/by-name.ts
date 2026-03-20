import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByNameCommand(parent: Command) {
  parent
    .command('by-name <name>')
    .description('Get offers for an ENS name')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--status <status>', 'Filter by status (pending, accepted, rejected, expired, unfunded)')
    .action(async (name: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/offers/name/${encodeURIComponent(name)}`, {
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
