import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUpdateListCommand(parent: Command) {
  parent
    .command('update-list <listId>')
    .description('Update a watchlist collection')
    .requiredOption('--name <name>', 'New list name')
    .action(async (listId: string, opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.patch(`/watchlist/lists/${encodeURIComponent(listId)}`, { name: opts.name });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
