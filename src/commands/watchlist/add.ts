import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerAddCommand(parent: Command) {
  parent
    .command('add')
    .description('Add a name to your watchlist')
    .option('--data <json>', 'Request body as JSON')
    .requiredOption('--ens-name <name>', 'ENS name to add')
    .option('--list-id <id>', 'Watchlist list ID')
    .option('--notify-on-sale', 'Notify on sale')
    .option('--notify-on-offer', 'Notify on offer')
    .option('--notify-on-listing', 'Notify on listing')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensName: opts.ensName,
          listId: opts.listId ? parseInt(opts.listId) : undefined,
          notifyOnSale: opts.notifyOnSale ?? true,
          notifyOnOffer: opts.notifyOnOffer ?? true,
          notifyOnListing: opts.notifyOnListing ?? true,
        };
        const data = await http.post('/watchlist', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
