import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('Get recent sales')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/sales', {
          page: opts.page,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
