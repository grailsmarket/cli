import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerMetadataCommand(parent: Command) {
  parent
    .command('metadata <name>')
    .description('Get metadata for an ENS name (always fetches fresh from The Graph)')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/names/${encodeURIComponent(name)}/metadata`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
