import { Command } from 'commander';
import { login } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerLoginCommand(parent: Command) {
  parent
    .command('login')
    .description('Authenticate via SIWE (requires GRAILS_PRIVATE_KEY env var)')
    .action(async (_opts, cmd) => {
      try {
        const result = await login();
        printOutput({ address: result.address, message: 'Authenticated successfully' }, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
