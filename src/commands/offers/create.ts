import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCreateCommand(parent: Command) {
  parent
    .command('create')
    .description('Create a new offer')
    .option('--data <json>', 'Request body as JSON')
    .option('--ens-name-id <id>', 'ENS name ID')
    .option('--buyer-address <address>', 'Buyer address')
    .option('--offer-amount-wei <wei>', 'Offer amount in wei')
    .option('--currency-address <address>', 'Currency contract address')
    .option('--order-data <json>', 'Seaport order data as JSON')
    .option('--expires-at <date>', 'Expiration date (ISO string)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensNameId: opts.ensNameId ? parseInt(opts.ensNameId) : undefined,
          buyerAddress: opts.buyerAddress,
          offerAmountWei: opts.offerAmountWei,
          currencyAddress: opts.currencyAddress,
          orderData: opts.orderData ? JSON.parse(opts.orderData) : undefined,
          expiresAt: opts.expiresAt,
        };
        const data = await http.post('/offers', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
