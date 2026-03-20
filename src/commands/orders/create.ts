import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCreateCommand(parent: Command) {
  parent
    .command('create')
    .description('Create a new Seaport order')
    .option('--data <json>', 'Request body as JSON')
    .option('--token-id <id>', 'Token ID')
    .option('--price <wei>', 'Price in wei')
    .option('--currency <address>', 'Currency contract address')
    .option('--duration <days>', 'Duration in days (1-365)')
    .option('--offerer <address>', 'Offerer address')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          tokenId: opts.tokenId,
          price: opts.price,
          currency: opts.currency,
          duration: opts.duration ? parseInt(opts.duration) : undefined,
          offerer: opts.offerer,
        };
        const data = await http.post('/orders/create', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
