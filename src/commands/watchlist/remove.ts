import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRemoveCommand(parent: Command) {
  parent
    .command('remove <id>')
    .description('Remove an item from your watchlist')
    .action(async (id: string, _opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.delete(`/watchlist/${encodeURIComponent(id)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
