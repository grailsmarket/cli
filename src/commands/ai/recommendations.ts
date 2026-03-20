import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerRecommendationsCommand(parent: Command) {
  parent
    .command('recommendations <name>')
    .description('Get AI-powered recommendations for an ENS name')
    .action(async (name: string, _opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/ai-recommendations/${encodeURIComponent(name)}`);
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
