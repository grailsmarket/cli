import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerLegacyCommand(parent: Command) {
  parent
    .command('legacy <name>')
    .description('Get legacy ENS data including OpenSea listings')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/names/${encodeURIComponent(name)}/legacy`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
