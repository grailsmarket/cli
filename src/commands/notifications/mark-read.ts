import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerMarkReadCommand(parent: Command) {
  parent
    .command('mark-read <id>')
    .description('Mark a notification as read')
    .action(async (id: string, _opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.patch(`/notifications/${encodeURIComponent(id)}/read`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
