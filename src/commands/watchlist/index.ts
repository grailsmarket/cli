import { Command } from 'commander';
import { registerListsCommand } from './lists.js';
import { registerListCommand } from './list.js';
import { registerCheckCommand } from './check.js';
import { registerSearchCommand } from './search.js';
import { registerAddCommand } from './add.js';
import { registerRemoveCommand } from './remove.js';
import { registerUpdateCommand } from './update.js';
import { registerCreateListCommand } from './create-list.js';
import { registerUpdateListCommand } from './update-list.js';
import { registerDeleteListCommand } from './delete-list.js';
import { registerBulkAddCommand } from './bulk-add.js';
import { registerBulkRemoveCommand } from './bulk-remove.js';

export function registerWatchlistCommands(program: Command) {
  const watchlist = program.command('watchlist').description('Watchlist operations');
  registerListsCommand(watchlist);
  registerListCommand(watchlist);
  registerCheckCommand(watchlist);
  registerSearchCommand(watchlist);
  registerAddCommand(watchlist);
  registerRemoveCommand(watchlist);
  registerUpdateCommand(watchlist);
  registerCreateListCommand(watchlist);
  registerUpdateListCommand(watchlist);
  registerDeleteListCommand(watchlist);
  registerBulkAddCommand(watchlist);
  registerBulkRemoveCommand(watchlist);
}
