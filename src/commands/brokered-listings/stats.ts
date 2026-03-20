import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerStatsCommand(parent: Command) {
  parent
    .command('stats')
    .description('Get brokered listings statistics')
    .action(async (_opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/brokered-listings/stats');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
