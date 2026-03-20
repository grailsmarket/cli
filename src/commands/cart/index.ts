import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerSummaryCommand } from './summary.js';
import { registerAddCommand } from './add.js';
import { registerBulkAddCommand } from './bulk-add.js';
import { registerRemoveCommand } from './remove.js';
import { registerClearCommand } from './clear.js';

export function registerCartCommands(program: Command) {
  const cart = program.command('cart').description('Shopping cart operations');
  registerListCommand(cart);
  registerSummaryCommand(cart);
  registerAddCommand(cart);
  registerBulkAddCommand(cart);
  registerRemoveCommand(cart);
  registerClearCommand(cart);
}
