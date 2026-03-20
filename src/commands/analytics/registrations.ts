import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRegistrationsCommand(parent: Command) {
  parent
    .command('registrations')
    .description('Get registration analytics')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 1y, all)', '7d')
    .option('--sort-by <field>', 'Sort by (cost, date, length)', 'date')
    .option('--sort-order <dir>', 'Sort order (asc, desc)', 'desc')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--clubs <clubs>', 'Filter by clubs (comma-separated)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/analytics/registrations', {
          period: opts.period,
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
