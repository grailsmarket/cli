import { Command } from 'commander';
import { ensureAuth } from '../../auth.js';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerMeCommand(parent: Command) {
  parent
    .command('me')
    .description('Get current authenticated user info')
    .action(async (_opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.get('/auth/me');
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
