import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerListCommand(parent: Command) {
  parent
    .command('list')
    .description('Get notifications')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--unread-only', 'Show only unread notifications')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/notifications', {
          page: opts.page,
          limit: opts.limit,
          unreadOnly: opts.unreadOnly ? 'true' : undefined,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
