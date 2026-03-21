import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkCommand(parent: Command) {
  parent
    .command('bulk <names>')
    .description('Bulk exact search for ENS names (up to 10,000 terms)')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .action(async (names: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const terms = names.split(',').map((t: string) => t.trim());
        const data = await http.post('/search/bulk', {
          terms,
          page: opts.page ? parseInt(opts.page) : undefined,
          limit: opts.limit ? parseInt(opts.limit) : undefined,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
