import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerSimilarCommand(parent: Command) {
  parent
    .command('similar')
    .description('Get names similar to your watchlist')
    .option('--limit <n>', 'Results limit')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/recommendations/similar-to-watchlist', { limit: opts.limit });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
