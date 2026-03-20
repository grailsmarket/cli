import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerCheckCommand(parent: Command) {
  parent
    .command('check')
    .description('Basic health check')
    .action(async (_opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.request('/health', { skipAuth: true });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
