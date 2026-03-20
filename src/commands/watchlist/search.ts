import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerSearchCommand(parent: Command) {
  parent
    .command('search')
    .description('Search within your watchlist')
    .option('-q, --query <text>', 'Search query', '*')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field (price, expiry_date, character_count, alphabetical, etc.)')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/watchlist/search', {
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
