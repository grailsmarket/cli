import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerLeaderboardCommand(parent: Command) {
  parent
    .command('leaderboard')
    .description('Get vote leaderboard')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field (upvotes, netScore, downvotes)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/votes/leaderboard', {
          page: opts.page,
          limit: opts.limit,
          sortBy: opts.sortBy,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
