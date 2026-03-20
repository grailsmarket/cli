import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerForYouCommand(parent: Command) {
  parent
    .command('for-you')
    .description('Get personalized recommendations')
    .option('--limit <n>', 'Results limit')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/recommendations/for-you', { limit: opts.limit });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
