import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerSalesCommand(parent: Command) {
  parent
    .command('sales')
    .description('Get sales analytics')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 1y, all)', '7d')
    .option('--source <source>', 'Filter by source (opensea, grails)')
    .option('--sort-by <field>', 'Sort by (price, date)', 'date')
    .option('--sort-order <dir>', 'Sort order (asc, desc)', 'desc')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--clubs <clubs>', 'Filter by clubs (comma-separated)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/analytics/sales', {
          period: opts.period,
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
