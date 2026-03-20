import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerUpdateCommand(parent: Command) {
  parent
    .command('update')
    .description('Update your user profile')
    .option('--data <json>', 'Request body as JSON')
    .option('--email <email>', 'Email address')
    .option('--telegram <handle>', 'Telegram handle')
    .option('--discord <handle>', 'Discord handle')
    .action(async (opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const body = opts.data ? JSON.parse(opts.data) : {
          email: opts.email,
          telegram: opts.telegram,
          discord: opts.discord,
        };
        const data = await http.patch('/users/me', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
