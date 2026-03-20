import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <id>')
    .description('Get offer details by ID')
    .action(async (id: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/offers/${encodeURIComponent(id)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
