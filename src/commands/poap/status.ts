import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerStatusCommand(parent: Command) {
  parent
    .command('status')
    .description('Get your POAP claim status')
    .action(async (_opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/poap/status');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
