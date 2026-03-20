import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerClearCommand(parent: Command) {
  parent
    .command('clear')
    .description('Clear all cart items')
    .option('--cart-type <type>', 'Clear only items of this cart type')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.request('/cart', {
          method: 'DELETE',
          body: opts.cartType ? { cartType: opts.cartType } : undefined,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
