import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <ensName>')
    .description('Get vote stats for an ENS name')
    .action(async (ensName: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/votes/${encodeURIComponent(ensName)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
