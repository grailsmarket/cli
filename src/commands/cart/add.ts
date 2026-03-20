import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerAddCommand(parent: Command) {
  parent
    .command('add')
    .description('Add item to cart')
    .option('--data <json>', 'Request body as JSON')
    .option('--ens-name-id <id>', 'ENS name ID')
    .option('--cart-type <type>', 'Cart type')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensNameId: opts.ensNameId ? parseInt(opts.ensNameId) : undefined,
          cartType: opts.cartType,
        };
        const data = await http.post('/cart', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
