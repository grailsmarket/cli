import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerFeedCommand(parent: Command) {
  parent
    .command('feed')
    .description('Get recent activity across all ENS names')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--event-type <type>', 'Filter by event type')
    .option('--platform <platform>', 'Filter by platform')
    .option('--club <club>', 'Filter by club (or "any" for all clubs)')
    .action(async (opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get('/activity', {
          page: opts.page,
          limit: opts.limit,
          event_type: opts.eventType,
          platform: opts.platform,
          club: opts.club,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
