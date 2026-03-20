import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkSaveCommand(parent: Command) {
  parent
    .command('bulk-save')
    .description('Bulk save listings (up to 500)')
    .requiredOption('--data <json>', 'Request body as JSON with listings array')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.post('/orders/bulk', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
