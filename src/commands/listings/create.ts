import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCreateCommand(parent: Command) {
  parent
    .command('create')
    .description('Create a new listing')
    .option('--data <json>', 'Request body as JSON')
    .option('--ens-name-id <id>', 'ENS name ID')
    .option('--seller-address <address>', 'Seller address')
    .option('--price-wei <wei>', 'Price in wei')
    .option('--currency-address <address>', 'Currency contract address')
    .option('--order-data <json>', 'Seaport order data as JSON')
    .option('--expires-at <date>', 'Expiration date (ISO string)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          ensNameId: opts.ensNameId ? parseInt(opts.ensNameId) : undefined,
          sellerAddress: opts.sellerAddress,
          priceWei: opts.priceWei,
          currencyAddress: opts.currencyAddress,
          orderData: opts.orderData ? JSON.parse(opts.orderData) : undefined,
          expiresAt: opts.expiresAt,
        };
        const data = await http.post('/listings', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
