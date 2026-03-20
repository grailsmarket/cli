import { Command } from 'commander';
import { registerAlsoViewedCommand } from './also-viewed.js';
import { registerSimilarCommand } from './similar.js';
import { registerByVotesCommand } from './by-votes.js';
import { registerForYouCommand } from './for-you.js';

export function registerRecommendationsCommands(program: Command) {
  const recs = program.command('recommendations').description('Name recommendations');
  registerAlsoViewedCommand(recs);
  registerSimilarCommand(recs);
  registerByVotesCommand(recs);
  registerForYouCommand(recs);
}
