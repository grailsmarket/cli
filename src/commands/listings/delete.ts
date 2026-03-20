import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerDeleteCommand(parent: Command) {
  parent
    .command('delete <id>')
    .description('Cancel a listing')
    .action(async (id: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.delete(`/listings/${encodeURIComponent(id)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
