import { Command } from 'commander';
import { registerGetCommand } from './get.js';
import { registerSaveCommand } from './save.js';
import { registerCreateCommand } from './create.js';
import { registerValidateCommand } from './validate.js';
import { registerCancelCommand } from './cancel.js';
import { registerBulkSaveCommand } from './bulk-save.js';

export function registerOrdersCommands(program: Command) {
  const orders = program.command('orders').description('Seaport order operations');
  registerGetCommand(orders);
  registerSaveCommand(orders);
  registerCreateCommand(orders);
  registerValidateCommand(orders);
  registerCancelCommand(orders);
  registerBulkSaveCommand(orders);
}
