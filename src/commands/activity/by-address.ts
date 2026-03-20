import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerByAddressCommand(parent: Command) {
  parent
    .command('by-address <address>')
    .description('Get activity history for an address')
    .option('--page <n>', 'Page number')
    .option('--limit <n>', 'Results per page')
    .option('--event-type <type>', 'Filter by event type')
    .option('--platform <platform>', 'Filter by platform')
    .action(async (address: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/activity/address/${encodeURIComponent(address)}`, {
          page: opts.page,
          limit: opts.limit,
          event_type: opts.eventType,
          platform: opts.platform,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
