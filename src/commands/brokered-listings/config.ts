import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerConfigCommand(parent: Command) {
  parent
    .command('config')
    .description('Get broker fee configuration')
    .action(async (_opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/brokered-listings/config');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
