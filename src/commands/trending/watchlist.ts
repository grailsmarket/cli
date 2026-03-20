import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerWatchlistCommand(parent: Command) {
  parent
    .command('watchlist')
    .description('Get trending names by watchlist additions')
    .option('--period <period>', 'Time period (24h, 7d)', '24h')
    .option('--limit <n>', 'Results per page')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/trending/watchlist', {
          period: opts.period,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
