import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRelatedCommand(parent: Command) {
  parent
    .command('related')
    .description('Find related ENS names via AI')
    .requiredOption('-q, --query <text>', 'Search query')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/ai/search/related', {
          q: opts.query,
          page: opts.page,
          limit: opts.limit,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
