import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerOffersCommand(parent: Command) {
  parent
    .command('offers')
    .description('Get offers chart data over time')
    .option('--period <period>', 'Time period (1d, 7d, 30d, 1y, all)', '7d')
    .option('--club <club>', 'Filter by club (comma-separated for multiple)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/charts/offers', { period: opts.period, club: opts.club });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
