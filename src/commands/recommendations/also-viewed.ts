import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerAlsoViewedCommand(parent: Command) {
  parent
    .command('also-viewed <name>')
    .description('Get names that collectors who viewed a name also viewed')
    .option('--limit <n>', 'Results limit')
    .action(async (name: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/recommendations/also-viewed', {
          name,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
