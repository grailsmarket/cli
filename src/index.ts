import 'dotenv/config';

// Suppress WalletConnect's verbose logging before any WC imports
const _stdoutWrite = process.stdout.write.bind(process.stdout);
const _stderrWrite = process.stderr.write.bind(process.stderr);

const wcPatterns = [
  /context:\s*'core'/,
  /Fatal socket error/,
  /closing transport/,
  /Emitting Relayer/,
  /Setting JSON-RPC/,
  /Emitting history_/,
  /wc_session/,
  /publishedAt:/,
  /transportType:/,
  /attestation:/,
  /Trace:/,
  /at \S+walletconnect/,
  /jsonrpc-provider/,
  /jsonrpc-ws-connection/,
  /requiredNamespaces.*deprecated/,
  /No matching key/,
  /level:\s*[56]0/,
  /@walletconnect\/sign-client/,
  /"use strict";Object\.defineProperty/,
];

// Suppress unhandled WC internal rejections (e.g. session_update race conditions)
process.on('unhandledRejection', (reason: unknown) => {
  const str = reason instanceof Error ? reason.stack || reason.message : String(reason);
  if (/No matching key.*session|session.topic.doesn.t.exist/i.test(str)) return;
  // Re-throw non-WC rejections
  throw reason;
});

function shouldSuppressWC(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return wcPatterns.some((p) => p.test(str));
}

process.stdout.write = function (chunk: unknown, ...args: unknown[]): boolean {
  if (shouldSuppressWC(String(chunk))) {
    const cb = typeof args[args.length - 1] === 'function' ? (args[args.length - 1] as () => void) : undefined;
    if (cb) cb();
    return true;
  }
  return (_stdoutWrite as Function).call(process.stdout, chunk, ...args);
} as typeof process.stdout.write;

process.stderr.write = function (chunk: unknown, ...args: unknown[]): boolean {
  if (shouldSuppressWC(String(chunk))) {
    const cb = typeof args[args.length - 1] === 'function' ? (args[args.length - 1] as () => void) : undefined;
    if (cb) cb();
    return true;
  }
  return (_stderrWrite as Function).call(process.stderr, chunk, ...args);
} as typeof process.stderr.write;

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
