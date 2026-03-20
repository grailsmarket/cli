import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBadgesCommand(parent: Command) {
  parent
    .command('badges <address>')
    .description('Get POAP badges for an address')
    .action(async (address: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/users/${encodeURIComponent(address)}/badges`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
