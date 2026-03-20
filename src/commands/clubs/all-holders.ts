import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerAllHoldersCommand(parent: Command) {
  parent
    .command('all-holders')
    .description('Get club holders across all clubs')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--club-name <name>', 'Filter by club name')
    .option('--sort-by <field>', 'Sort field')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/clubs/holders', {
          page: opts.page,
          limit: opts.limit,
          clubName: opts.clubName,
          sortBy: opts.sortBy,
          sortOrder: opts.sortOrder,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
