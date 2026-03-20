import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerValidateCommand(parent: Command) {
  parent
    .command('validate')
    .description('Validate Seaport order parameters')
    .requiredOption('--data <json>', 'Order data as JSON (or use --order-data)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.post('/orders/validate', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
