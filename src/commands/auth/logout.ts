import { Command } from 'commander';
import { logout } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerLogoutCommand(parent: Command) {
  parent
    .command('logout')
    .description('Logout and clear stored credentials')
    .action(async (_opts, cmd) => {
      try {
        await logout();
        printOutput({ message: 'Logged out successfully' }, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
