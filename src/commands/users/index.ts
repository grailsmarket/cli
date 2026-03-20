import { Command } from 'commander';
import { registerBadgesCommand } from './badges.js';
import { registerBalancesCommand } from './balances.js';
import { registerUpdateCommand } from './update.js';

export function registerUsersCommands(program: Command) {
  const users = program.command('users').description('User operations');
  registerBadgesCommand(users);
  registerBalancesCommand(users);
  registerUpdateCommand(users);
}
