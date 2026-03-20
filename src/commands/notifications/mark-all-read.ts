import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerMarkAllReadCommand(parent: Command) {
  parent
    .command('mark-all-read')
    .description('Mark all notifications as read')
    .action(async (_opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.patch('/notifications/read-all');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
