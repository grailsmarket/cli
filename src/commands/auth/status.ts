import { Command } from 'commander';
import { getAuthStatus } from '../../auth.js';
import { printOutput } from '../../output.js';

export function registerStatusCommand(parent: Command) {
  parent
    .command('status')
    .description('Check authentication status')
    .action((_opts, cmd) => {
      const status = getAuthStatus();
      printOutput(status, cmd.optsWithGlobals());
    });
}
