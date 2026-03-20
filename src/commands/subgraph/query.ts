import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerQueryCommand(parent: Command) {
  parent
    .command('query')
    .description('Proxy a GraphQL query to The Graph ENS subgraph')
    .requiredOption('--data <json>', 'GraphQL query object as JSON')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const body = JSON.parse(opts.data);
        const data = await http.post('/subgraph', body);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
