import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBulkFiltersCommand(parent: Command) {
  parent
    .command('bulk-filters <names>')
    .description('Bulk search with filters')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .option('--data <json>', 'Full request body as JSON (overrides other options)')
    .action(async (names: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        let body: Record<string, unknown>;
        if (opts.data) {
          body = JSON.parse(opts.data);
        } else {
          body = {
            terms: names.split(',').map((t: string) => t.trim()),
            page: opts.page ? parseInt(opts.page) : undefined,
            limit: opts.limit ? parseInt(opts.limit) : undefined,
            sortBy: opts.sortBy,
            sortOrder: opts.sortOrder,
          };
        }
        const data = await http.post('/search/bulk-filters', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
