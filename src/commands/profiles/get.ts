import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <addressOrName>')
    .description('Get profile for an address or ENS name')
    .action(async (addressOrName: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/profiles/${encodeURIComponent(addressOrName)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
