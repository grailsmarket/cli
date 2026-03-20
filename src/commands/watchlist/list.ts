import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('Get watchlist items')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--list-id <id>', 'Filter by list ID')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/watchlist', {
          page: opts.page,
          limit: opts.limit,
          listId: opts.listId,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
