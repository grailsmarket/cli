import { Command } from 'commander';
import { registerGlobalCommand } from './global.js';

export function registerLeaderboardCommands(program: Command) {
  const leaderboard = program.command('leaderboard').description('User leaderboard');
  registerGlobalCommand(leaderboard);
}
