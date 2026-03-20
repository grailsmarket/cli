import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkAddCommand(parent: Command) {
  parent
    .command('bulk-add')
    .description('Bulk add names to watchlist')
    .option('--data <json>', 'Request body as JSON')
    .option('--ens-names <names>', 'Comma-separated ENS names')
    .option('--list-id <id>', 'Watchlist list ID')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensNames: opts.ensNames ? opts.ensNames.split(',').map((n: string) => n.trim()) : [],
          listId: opts.listId ? parseInt(opts.listId) : undefined,
        };
        const data = await http.post('/watchlist/bulk', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
