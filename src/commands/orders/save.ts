import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerSaveCommand(parent: Command) {
  parent
    .command('save')
    .description('Save an order (listing/offer) to database')
    .option('--data <json>', 'Request body as JSON')
    .option('--type <type>', 'Order type (listing, offer, collection_offer)')
    .option('--token-id <id>', 'Token ID')
    .option('--price-wei <wei>', 'Price in wei')
    .option('--currency-address <address>', 'Currency contract address')
    .option('--order-data <json>', 'Seaport order data as JSON string')
    .option('--order-hash <hash>', 'Order hash')
    .option('--seller-address <address>', 'Seller address')
    .option('--buyer-address <address>', 'Buyer address')
    .option('--source <source>', 'Source marketplace', 'grails')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          type: opts.type,
          token_id: opts.tokenId,
          price_wei: opts.priceWei,
          currency_address: opts.currencyAddress,
          order_data: opts.orderData,
          order_hash: opts.orderHash,
          seller_address: opts.sellerAddress,
          buyer_address: opts.buyerAddress,
          source: opts.source,
        };
        const data = await http.post('/orders', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
