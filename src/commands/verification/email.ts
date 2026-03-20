import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerEmailCommand(parent: Command) {
  parent
    .command('email')
    .description('Verify email with token')
    .requiredOption('--token <token>', 'Verification token')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.post('/verification/email', { token: opts.token });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
