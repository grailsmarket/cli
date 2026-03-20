import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUserCommand(parent: Command) {
  parent
    .command('user')
    .description('Get your personal analytics')
    .option('--period <period>', 'Time period (24h, 7d, 30d, 90d, all)', '7d')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/analytics/user/me', { period: opts.period });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
