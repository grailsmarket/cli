import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerBalancesCommand(parent: Command) {
  parent
    .command('balances <address>')
    .description('Get token balances for an address')
    .action(async (address: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/users/${encodeURIComponent(address)}/balances`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
