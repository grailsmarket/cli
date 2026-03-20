import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerClubCommand(parent: Command) {
  parent
    .command('club <clubName>')
    .description('Get analytics for a specific club')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 90d)', '7d')
    .action(async (clubName: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/analytics/clubs/${encodeURIComponent(clubName)}`, { period: opts.period });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
