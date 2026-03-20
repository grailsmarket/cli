import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerHistoryCommand(parent: Command) {
  parent
    .command('history <name>')
    .description('Get transaction history for an ENS name')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .action(async (name: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/names/${encodeURIComponent(name)}/history`, {
          page: opts.page,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
