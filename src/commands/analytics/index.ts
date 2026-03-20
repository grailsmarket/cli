import { Command } from 'commander';
import { registerMarketCommand } from './market.js';
import { registerClubCommand } from './club.js';
import { registerPriceTrendsCommand } from './price-trends.js';
import { registerVolumeCommand } from './volume.js';
import { registerRegistrationsCommand } from './registrations.js';
import { registerRegistrationsByLengthCommand } from './registrations-by-length.js';
import { registerSalesCommand } from './sales.js';
import { registerListingsCommand } from './listings.js';
import { registerOffersCommand } from './offers.js';
import { registerUserCommand } from './user.js';

export function registerAnalyticsCommands(program: Command) {
  const analytics = program.command('analytics').description('Market and data analytics');
  registerMarketCommand(analytics);
  registerClubCommand(analytics);
  registerPriceTrendsCommand(analytics);
  registerVolumeCommand(analytics);
  registerRegistrationsCommand(analytics);
  registerRegistrationsByLengthCommand(analytics);
  registerSalesCommand(analytics);
  registerListingsCommand(analytics);
  registerOffersCommand(analytics);
  registerUserCommand(analytics);
}
