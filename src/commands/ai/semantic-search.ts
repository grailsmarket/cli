import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerSemanticSearchCommand(parent: Command) {
  parent
    .command('semantic-search <text>')
    .description('AI-powered semantic search for ENS names')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--sort-by <field>', 'Sort field')
    .option('--sort-order <dir>', 'Sort order (asc, desc)')
    .action(async (text: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/ai/search/semantic', {
          q: text,
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
