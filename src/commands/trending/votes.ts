import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerVotesCommand(parent: Command) {
  parent
    .command('votes')
    .description('Get trending names by voting activity')
    .option('--period <period>', 'Time period (24h, 7d)', '24h')
    .option('--limit <n>', 'Results per page')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/trending/votes', {
          period: opts.period,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
