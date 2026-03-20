import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByOwnerCommand(parent: Command) {
  parent
    .command('by-owner <address>')
    .description('Get offers received by a name owner address')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--status <status>', 'Filter by status')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/offers/owner/${encodeURIComponent(address)}`, {
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
