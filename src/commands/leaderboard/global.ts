import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGlobalCommand(parent: Command) {
  parent
    .command('global')
    .description('Get global user leaderboard ranked by ENS holdings')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field (names_owned, names_in_clubs, expired_names, names_listed, names_sold, sales_volume)')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .option('--clubs <clubs>', 'Filter by clubs (comma-separated)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/leaderboard', {
          page: opts.page,
          limit: opts.limit,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
          'clubs[]': opts.clubs,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
