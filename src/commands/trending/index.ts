import { Command } from 'commander';
import { registerViewsCommand } from './views.js';
import { registerWatchlistCommand } from './watchlist.js';
import { registerVotesCommand } from './votes.js';
import { registerSalesCommand } from './sales.js';
import { registerOffersCommand } from './offers.js';
import { registerCompositeCommand } from './composite.js';

export function registerTrendingCommands(program: Command) {
  const trending = program.command('trending').description('Trending names');
  registerViewsCommand(trending);
  registerWatchlistCommand(trending);
  registerVotesCommand(trending);
  registerSalesCommand(trending);
  registerOffersCommand(trending);
  registerCompositeCommand(trending);
}
