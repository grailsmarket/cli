import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerHoldersCommand(parent: Command) {
  parent
    .command('holders <clubName>')
    .description('Get holders in a specific club')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .action(async (clubName: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/clubs/${encodeURIComponent(clubName)}/holders`, {
          page: opts.page,
          limit: opts.limit,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
