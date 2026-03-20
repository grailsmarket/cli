import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCreateCommand(parent: Command) {
  parent
    .command('create')
    .description('Create a brokered listing')
    .requiredOption('--data <json>', 'Request body as JSON (token_id, price_wei, order_data, order_hash, seller_address, broker_address, broker_fee_bps)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.post('/brokered-listings', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
