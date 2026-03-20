import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCancelCommand(parent: Command) {
  parent
    .command('cancel <id>')
    .description('Cancel an order')
    .action(async (id: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.delete(`/orders/${encodeURIComponent(id)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
