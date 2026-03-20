import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUpdateCommand(parent: Command) {
  parent
    .command('update <id>')
    .description('Update an offer')
    .option('--data <json>', 'Request body as JSON')
    .option('--offer-amount-wei <wei>', 'New offer amount in wei')
    .option('--status <status>', 'New status (pending, accepted, rejected, expired, unfunded)')
    .action(async (id: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          offerAmountWei: opts.offerAmountWei,
          status: opts.status,
        };
        const data = await http.put(`/offers/${encodeURIComponent(id)}`, body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
