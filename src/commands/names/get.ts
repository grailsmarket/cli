import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <name>')
    .description('Get details for an ENS name')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/names/${encodeURIComponent(name)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
