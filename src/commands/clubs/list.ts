import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('List all clubs with metadata and statistics')
    .option('--sort-by <field>', 'Sort field (member_count, floor_price_wei, total_sales_volume_wei, name, etc.)')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .option('--class <classes>', 'Filter by classification (comma-separated: ethmojis, digits, palindromes, prepunk, geo, letters, fantasy, crypto, ai)')
    .option('--search <term>', 'Search clubs by name')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const params: Record<string, string | undefined> = {
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
          search: opts.search,
        };
        // class[] needs special handling
        if (opts.class) {
          const classes = opts.class.split(',');
          for (const c of classes) {
            params[`class[]`] = c.trim();
          }
        }
        const data = await http.get('/clubs', params);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
