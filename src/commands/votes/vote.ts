import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { ensureAuth } from '../../auth.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerVoteCommand(parent: Command) {
  parent
    .command('vote <name>')
    .description('Cast or update a vote on an ENS name')
    .requiredOption('--vote <n>', 'Vote value (-1=downvote, 0=remove, 1=upvote)')
    .action(async (name: string, opts, cmd) => {
      try {
        await ensureAuth();
        const http = createHttpClient();
        const data = await http.post('/votes', {
          ensName: name,
          vote: parseInt(opts.vote),
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
