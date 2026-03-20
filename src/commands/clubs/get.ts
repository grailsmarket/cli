import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerGetCommand(parent: Command) {
  parent
    .command('get <clubName>')
    .description('Get club details and statistics')
    .action(async (clubName: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/clubs/${encodeURIComponent(clubName)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
