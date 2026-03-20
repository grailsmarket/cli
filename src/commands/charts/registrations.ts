import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRegistrationsCommand(parent: Command) {
  parent
    .command('registrations')
    .description('Get registrations chart data over time')
    .option('--period <period>', 'Time period (1d, 7d, 30d, 1y, all)', '7d')
    .option('--club <club>', 'Filter by club (comma-separated for multiple)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/charts/registrations', { period: opts.period, club: opts.club });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
