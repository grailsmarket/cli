import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkRemoveCommand(parent: Command) {
  parent
    .command('bulk-remove')
    .description('Bulk remove names from watchlist')
    .option('--data <json>', 'Request body as JSON')
    .option('--ens-names <names>', 'Comma-separated ENS names')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensNames: opts.ensNames ? opts.ensNames.split(',').map((n: string) => n.trim()) : [],
        };
        const data = await http.request('/watchlist/bulk', { method: 'DELETE', body });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
