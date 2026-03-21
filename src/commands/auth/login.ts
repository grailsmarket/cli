import { Command } from 'commander';
import { login } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerLoginCommand(parent: Command) {
  parent
    .command('login')
    .description('Authenticate via WalletConnect or GRAILS_PRIVATE_KEY (for CI)')
    .action(async (_opts, cmd) => {
      try {
        const usedWalletConnect = !process.env.GRAILS_PRIVATE_KEY;
        const result = await login();
        process.stderr.write(`Connected with ${result.address}\nAuthenticated successfully\n`);
        // WalletConnect SDK keeps internal timers/WebSockets alive — force exit
        if (usedWalletConnect) process.exit(0);
      } catch (error) {
        handleError(error);
      }
    });
}
