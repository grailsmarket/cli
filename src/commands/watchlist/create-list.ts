import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCreateListCommand(parent: Command) {
  parent
    .command('create-list <name>')
    .description('Create a new watchlist collection')
    .action(async (name: string, opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.post('/watchlist/lists', { name });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
