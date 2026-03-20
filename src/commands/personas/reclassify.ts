import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerReclassifyCommand(parent: Command) {
  parent
    .command('reclassify')
    .description('Reclassify your user persona')
    .action(async (_opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.post('/personas/me/reclassify');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
