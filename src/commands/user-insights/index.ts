import { Command } from 'commander';
import { registerViewedCommand } from './viewed.js';
import { registerWatchedCommand } from './watched.js';
import { registerVotedCommand } from './voted.js';
import { registerOffersCommand } from './offers.js';
import { registerPurchasesCommand } from './purchases.js';
import { registerSalesCommand } from './sales.js';

export function registerUserInsightsCommands(program: Command) {
  const insights = program.command('user-insights').description('Your activity history');
  registerViewedCommand(insights);
  registerWatchedCommand(insights);
  registerVotedCommand(insights);
  registerOffersCommand(insights);
  registerPurchasesCommand(insights);
  registerSalesCommand(insights);
}
