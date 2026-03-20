import { Command } from 'commander';
import { registerGetCommand } from './get.js';
import { registerLeaderboardCommand } from './leaderboard.js';
import { registerVoteCommand } from './vote.js';

export function registerVotesCommands(program: Command) {
  const votes = program.command('votes').description('Name voting operations');
  registerGetCommand(votes);
  registerLeaderboardCommand(votes);
  registerVoteCommand(votes);
}
