import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerQueryCommand(parent: Command) {
  parent
    .command('query')
    .description('Search ENS names with filtering')
    .requiredOption('-q, --query <text>', 'Search query')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field (price, expiry_date, registration_date, character_count, alphabetical, offer, listing_date)')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .option('--min-price <wei>', 'Minimum price in wei')
    .option('--max-price <wei>', 'Maximum price in wei')
    .option('--min-length <n>', 'Minimum name length')
    .option('--max-length <n>', 'Maximum name length')
    .option('--listed <bool>', 'Filter to listed names only')
    .option('--has-offer <bool>', 'Filter to names with offers')
    .option('--marketplace <source>', 'Filter by marketplace (grails, opensea, all)')
    .option('--clubs <clubs>', 'Filter by clubs (comma-separated)')
    .option('--status <status>', 'Filter by status (registered, grace, premium, available, all)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/search', {
          q: opts.query,
          page: opts.page,
          limit: opts.limit,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
          minPrice: opts.minPrice,
          maxPrice: opts.maxPrice,
          minLength: opts.minLength,
          maxLength: opts.maxLength,
          listed: opts.listed,
          hasOffer: opts.hasOffer,
          marketplace: opts.marketplace,
          clubs: opts.clubs,
          status: opts.status,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
