import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByVotesCommand(parent: Command) {
  parent
    .command('by-votes')
    .description('Get recommendations based on your votes')
    .option('--limit <n>', 'Results limit')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/recommendations/based-on-votes', { limit: opts.limit });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
