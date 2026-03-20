import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <address>')
    .description('Get legend summary for an address')
    .action(async (address: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/legends/${encodeURIComponent(address)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
