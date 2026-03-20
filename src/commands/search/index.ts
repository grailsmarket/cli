import { Command } from 'commander';
import { registerQueryCommand } from './query.js';
import { registerBulkCommand } from './bulk.js';
import { registerBulkFiltersCommand } from './bulk-filters.js';

export function registerSearchCommands(program: Command) {
  const search = program.command('search').description('Search ENS names');
  registerQueryCommand(search);
  registerBulkCommand(search);
  registerBulkFiltersCommand(search);
}
