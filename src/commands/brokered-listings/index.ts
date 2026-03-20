import { Command } from 'commander';
import { registerConfigCommand } from './config.js';
import { registerListCommand } from './list.js';
import { registerStatsCommand } from './stats.js';
import { registerCreateCommand } from './create.js';

export function registerBrokeredListingsCommands(program: Command) {
  const bl = program.command('brokered-listings').description('Brokered listing operations');
  registerConfigCommand(bl);
  registerListCommand(bl);
  registerStatsCommand(bl);
  registerCreateCommand(bl);
}
