import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUpdateCommand(parent: Command) {
  parent
    .command('update <id>')
    .description('Update watchlist item notification settings')
    .requiredOption('--data <json>', 'Request body as JSON (notifyOnSale, notifyOnOffer, etc.)')
    .action(async (id: string, opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.patch(`/watchlist/${encodeURIComponent(id)}`, body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
