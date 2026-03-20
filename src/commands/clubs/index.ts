import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerGetCommand } from './get.js';
import { registerAllHoldersCommand } from './all-holders.js';
import { registerHoldersCommand } from './holders.js';

export function registerClubsCommands(program: Command) {
  const clubs = program.command('clubs').description('Club operations');
  registerListCommand(clubs);
  registerGetCommand(clubs);
  registerAllHoldersCommand(clubs);
  registerHoldersCommand(clubs);
}
