import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerOffersCommand(parent: Command) {
  parent
    .command('offers')
    .description('Get offers analytics')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 1y, all)', '7d')
    .option('--status <status>', 'Filter by status (pending, active, cancelled, accepted)')
    .option('--source <source>', 'Filter by source (opensea, grails)')
    .option('--sort-by <field>', 'Sort by (price, date)', 'date')
    .option('--sort-order <dir>', 'Sort order (asc, desc)', 'desc')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--clubs <clubs>', 'Filter by clubs (comma-separated)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/analytics/offers', {
          period: opts.period,
          status: opts.status,
          source: opts.source,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
          page: opts.page,
          limit: opts.limit,
          'clubs[]': opts.clubs,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
