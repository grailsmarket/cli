import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerGetCommand } from './get.js';
import { registerMetadataCommand } from './metadata.js';
import { registerLegacyCommand } from './legacy.js';
import { registerHistoryCommand } from './history.js';

export function registerNamesCommands(program: Command) {
  const names = program.command('names').description('ENS name operations');
  registerListCommand(names);
  registerGetCommand(names);
  registerMetadataCommand(names);
  registerLegacyCommand(names);
  registerHistoryCommand(names);
}
