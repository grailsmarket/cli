import { Command } from 'commander';
import { registerHealthCommands } from './commands/health/index.js';
import { registerAuthCommands } from './commands/auth/index.js';
import { registerNamesCommands } from './commands/names/index.js';
import { registerListingsCommands } from './commands/listings/index.js';
import { registerOffersCommands } from './commands/offers/index.js';
import { registerSalesCommands } from './commands/sales/index.js';
import { registerSearchCommands } from './commands/search/index.js';
import { registerActivityCommands } from './commands/activity/index.js';
import { registerClubsCommands } from './commands/clubs/index.js';
import { registerTrendingCommands } from './commands/trending/index.js';
import { registerProfilesCommands } from './commands/profiles/index.js';
import { registerAnalyticsCommands } from './commands/analytics/index.js';
import { registerChartsCommands } from './commands/charts/index.js';
import { registerLeaderboardCommands } from './commands/leaderboard/index.js';
import { registerLegendsCommands } from './commands/legends/index.js';
import { registerEnsRolesCommands } from './commands/ens-roles/index.js';
import { registerGoogleMetricsCommands } from './commands/google-metrics/index.js';
import { registerVotesCommands } from './commands/votes/index.js';
import { registerBrokeredListingsCommands } from './commands/brokered-listings/index.js';
import { registerPoapCommands } from './commands/poap/index.js';
import { registerPersonasCommands } from './commands/personas/index.js';
import { registerOrdersCommands } from './commands/orders/index.js';
import { registerUsersCommands } from './commands/users/index.js';
import { registerAiCommands } from './commands/ai/index.js';
import { registerRecommendationsCommands } from './commands/recommendations/index.js';
import { registerWatchlistCommands } from './commands/watchlist/index.js';
import { registerCartCommands } from './commands/cart/index.js';
import { registerNotificationsCommands } from './commands/notifications/index.js';
import { registerUserInsightsCommands } from './commands/user-insights/index.js';
import { registerVerificationCommands } from './commands/verification/index.js';
import { registerSubgraphCommands } from './commands/subgraph/index.js';

export function createProgram(): Command {
  const program = new Command()
    .name('grails')
    .version('0.1.0')
    .description('Grails ENS Marketplace CLI — designed for agent consumption')
    .option('--human', 'Human-readable output')
    .option('--quiet', 'Suppress non-data output');

  registerHealthCommands(program);
  registerAuthCommands(program);
  registerNamesCommands(program);
  registerListingsCommands(program);
  registerOffersCommands(program);
  registerSalesCommands(program);
  registerSearchCommands(program);
  registerActivityCommands(program);
  registerClubsCommands(program);
  registerTrendingCommands(program);
  registerProfilesCommands(program);
  registerAnalyticsCommands(program);
  registerChartsCommands(program);
  registerLeaderboardCommands(program);
  registerLegendsCommands(program);
  registerEnsRolesCommands(program);
  registerGoogleMetricsCommands(program);
  registerVotesCommands(program);
  registerBrokeredListingsCommands(program);
  registerPoapCommands(program);
  registerPersonasCommands(program);
  registerOrdersCommands(program);
  registerUsersCommands(program);
  registerAiCommands(program);
  registerRecommendationsCommands(program);
  registerWatchlistCommands(program);
  registerCartCommands(program);
  registerNotificationsCommands(program);
  registerUserInsightsCommands(program);
  registerVerificationCommands(program);
  registerSubgraphCommands(program);

  return program;
}

const program = createProgram();
program.parseAsync(process.argv);
