import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerReadyCommand(parent: Command) {
  parent
    .command('ready')
    .description('Readiness check (PostgreSQL + Elasticsearch)')
    .action(async (_opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.request('/health/ready', { skipAuth: true });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
