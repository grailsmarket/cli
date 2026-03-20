import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerByNameCommand } from './by-name.js';
import { registerByAddressCommand } from './by-address.js';
import { registerAnalyticsCommand } from './analytics.js';

export function registerSalesCommands(program: Command) {
  const sales = program.command('sales').description('Sales history and analytics');
  registerListCommand(sales);
  registerByNameCommand(sales);
  registerByAddressCommand(sales);
  registerAnalyticsCommand(sales);
}
