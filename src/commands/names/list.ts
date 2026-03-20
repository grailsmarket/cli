import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('List ENS names with filtering and pagination')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--owner <address>', 'Filter by owner address')
    .option('--status <status>', 'Filter by status (available, listed, expiring)')
    .option('--sort <field>', 'Sort by field (name, price, expiry, created)')
    .option('--order <dir>', 'Sort order (asc, desc)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/names', {
          page: opts.page,
          limit: opts.limit,
          owner: opts.owner,
          status: opts.status,
          sort: opts.sort,
          order: opts.order,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
