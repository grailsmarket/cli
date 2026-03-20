import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkAddCommand(parent: Command) {
  parent
    .command('bulk-add')
    .description('Bulk add items to cart (up to 100)')
    .requiredOption('--data <json>', 'Request body as JSON with items array')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.post('/cart/bulk', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
