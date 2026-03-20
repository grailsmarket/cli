import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUpdateCommand(parent: Command) {
  parent
    .command('update <id>')
    .description('Update a listing')
    .option('--data <json>', 'Request body as JSON')
    .option('--price-wei <wei>', 'New price in wei')
    .option('--expires-at <date>', 'New expiration date (ISO string)')
    .action(async (id: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          priceWei: opts.priceWei,
          expiresAt: opts.expiresAt,
        };
        const data = await http.put(`/listings/${encodeURIComponent(id)}`, body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
