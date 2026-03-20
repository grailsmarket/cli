import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerPriceTrendsCommand(parent: Command) {
  parent
    .command('price-trends')
    .description('Get price trend analysis')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 90d, all)', '7d')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/analytics/price-trends', { period: opts.period });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
