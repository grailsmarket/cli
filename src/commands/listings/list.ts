import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('List marketplace listings with filtering')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--status <status>', 'Filter by status (active, sold, cancelled, expired, unfunded)')
    .option('--seller <address>', 'Filter by seller address')
    .option('--min-price <wei>', 'Minimum price in wei')
    .option('--max-price <wei>', 'Maximum price in wei')
    .option('--sort <field>', 'Sort by field (price, created, expiry, name)')
    .option('--order <dir>', 'Sort order (asc, desc)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/listings', {
          page: opts.page,
          limit: opts.limit,
          status: opts.status,
          seller: opts.seller,
          minPrice: opts.minPrice,
          maxPrice: opts.maxPrice,
          sort: opts.sort,
          order: opts.order,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
