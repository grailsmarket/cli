import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerDetailsCommand(parent: Command) {
  parent
    .command('details <address>')
    .description('Get detailed legend mints for an address')
    .option('--type <type>', 'Filter by legend type')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/legends/${encodeURIComponent(address)}/details`, {
          type: opts.type,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
