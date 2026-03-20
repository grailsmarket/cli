import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByNameCommand(parent: Command) {
  parent
    .command('by-name <name>')
    .description('Get active listings for an ENS name')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/listings/name/${encodeURIComponent(name)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
