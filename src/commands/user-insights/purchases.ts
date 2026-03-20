import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerPurchasesCommand(parent: Command) {
  parent
    .command('purchases')
    .description('Get your purchase history')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/user/history/purchases', { page: opts.page, limit: opts.limit });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
