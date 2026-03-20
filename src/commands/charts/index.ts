import { Command } from 'commander';
import { registerSalesCommand } from './sales.js';
import { registerVolumeCommand } from './volume.js';
import { registerListingsCommand } from './listings.js';
import { registerRegistrationsCommand } from './registrations.js';
import { registerOffersCommand } from './offers.js';

export function registerChartsCommands(program: Command) {
  const charts = program.command('charts').description('Chart data over time');
  registerSalesCommand(charts);
  registerVolumeCommand(charts);
  registerListingsCommand(charts);
  registerRegistrationsCommand(charts);
  registerOffersCommand(charts);
}
