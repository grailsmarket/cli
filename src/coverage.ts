export interface EndpointEntry {
  method: string;
  path: string;
  command: string;
  group: string;
  auth: 'none' | 'optional' | 'required';
  phase: 0 | 1 | 2 | 3;
  implemented: boolean;
}

export const ENDPOINTS: EndpointEntry[] = [
  // === Phase 0: Foundation ===
  { method: 'GET', path: '/health', command: 'health check', group: 'health', auth: 'none', phase: 0, implemented: true },
  { method: 'GET', path: '/health/ready', command: 'health ready', group: 'health', auth: 'none', phase: 0, implemented: true },
  { method: 'GET', path: '/api/v1/auth/me', command: 'auth me', group: 'auth', auth: 'required', phase: 0, implemented: true },
  { method: 'POST', path: '/api/v1/auth/logout', command: 'auth logout', group: 'auth', auth: 'required', phase: 0, implemented: true },

  // === Phase 1: Read-only, no auth ===
  // names
  { method: 'GET', path: '/api/v1/names', command: 'names list', group: 'names', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/names/:name', command: 'names get', group: 'names', auth: 'optional', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/names/:name/metadata', command: 'names metadata', group: 'names', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/names/:name/legacy', command: 'names legacy', group: 'names', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/names/:name/history', command: 'names history', group: 'names', auth: 'none', phase: 1, implemented: true },
  // listings (read)
  { method: 'GET', path: '/api/v1/listings', command: 'listings list', group: 'listings', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/listings/:id', command: 'listings get', group: 'listings', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/listings/name/:name', command: 'listings by-name', group: 'listings', auth: 'none', phase: 1, implemented: true },
  // offers (read)
  { method: 'GET', path: '/api/v1/offers/:id', command: 'offers get', group: 'offers', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/offers/name/:name', command: 'offers by-name', group: 'offers', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/offers/buyer/:address', command: 'offers by-buyer', group: 'offers', auth: 'none', phase: 1, implemented: true },
  { method: 'GET', path: '/api/v1/offers/owner/:address', command: 'offers by-owner', group: 'offers', auth: 'none', phase: 1, implemented: true },
  // sales
  { method: 'GET', path: '/api/v1/sales', command: 'sales list', group: 'sales', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/sales/name/:name', command: 'sales by-name', group: 'sales', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/sales/address/:address', command: 'sales by-address', group: 'sales', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/sales/:nameOrId/analytics', command: 'sales analytics', group: 'sales', auth: 'none', phase: 1, implemented: false },
  // search
  { method: 'GET', path: '/api/v1/search', command: 'search query', group: 'search', auth: 'optional', phase: 1, implemented: false },
  { method: 'POST', path: '/api/v1/search/bulk', command: 'search bulk', group: 'search', auth: 'optional', phase: 1, implemented: false },
  { method: 'POST', path: '/api/v1/search/bulk-filters', command: 'search bulk-filters', group: 'search', auth: 'optional', phase: 1, implemented: false },
  // clubs
  { method: 'GET', path: '/api/v1/clubs', command: 'clubs list', group: 'clubs', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/clubs/:clubName', command: 'clubs get', group: 'clubs', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/clubs/holders', command: 'clubs all-holders', group: 'clubs', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/clubs/:clubName/holders', command: 'clubs holders', group: 'clubs', auth: 'none', phase: 1, implemented: false },
  // activity
  { method: 'GET', path: '/api/v1/activity', command: 'activity feed', group: 'activity', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/activity/:name', command: 'activity by-name', group: 'activity', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/activity/address/:address', command: 'activity by-address', group: 'activity', auth: 'none', phase: 1, implemented: false },
  // trending
  { method: 'GET', path: '/api/v1/trending/views', command: 'trending views', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/trending/watchlist', command: 'trending watchlist', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/trending/votes', command: 'trending votes', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/trending/sales', command: 'trending sales', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/trending/offers', command: 'trending offers', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/trending/composite', command: 'trending composite', group: 'trending', auth: 'optional', phase: 1, implemented: false },
  // profiles
  { method: 'GET', path: '/api/v1/profiles/:addressOrName', command: 'profiles get', group: 'profiles', auth: 'optional', phase: 1, implemented: false },
  // analytics
  { method: 'GET', path: '/api/v1/analytics/market', command: 'analytics market', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/clubs/:club', command: 'analytics club', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/price-trends', command: 'analytics price-trends', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/volume', command: 'analytics volume', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/registrations', command: 'analytics registrations', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/registrations/by-length', command: 'analytics registrations-by-length', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/sales', command: 'analytics sales', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/listings', command: 'analytics listings', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/offers', command: 'analytics offers', group: 'analytics', auth: 'none', phase: 1, implemented: false },
  // charts
  { method: 'GET', path: '/api/v1/charts/sales', command: 'charts sales', group: 'charts', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/charts/volume', command: 'charts volume', group: 'charts', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/charts/listings', command: 'charts listings', group: 'charts', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/charts/registrations', command: 'charts registrations', group: 'charts', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/charts/offers', command: 'charts offers', group: 'charts', auth: 'none', phase: 1, implemented: false },
  // leaderboard
  { method: 'GET', path: '/api/v1/leaderboard', command: 'leaderboard global', group: 'leaderboard', auth: 'none', phase: 1, implemented: false },
  // legends
  { method: 'GET', path: '/api/v1/legends/:address', command: 'legends get', group: 'legends', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/legends/:address/details', command: 'legends details', group: 'legends', auth: 'none', phase: 1, implemented: false },
  // ens-roles
  { method: 'GET', path: '/api/v1/ens-roles/names/:name/roles', command: 'ens-roles roles', group: 'ens-roles', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/ens-roles/names/:name/can-manage/:address', command: 'ens-roles can-manage', group: 'ens-roles', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/ens-roles/users/:address/manageable-names', command: 'ens-roles manageable-names', group: 'ens-roles', auth: 'optional', phase: 1, implemented: false },
  // google-metrics
  { method: 'GET', path: '/api/v1/google-metrics/:name', command: 'google-metrics get', group: 'google-metrics', auth: 'optional', phase: 1, implemented: false },
  // votes (read)
  { method: 'GET', path: '/api/v1/votes/:ensName', command: 'votes get', group: 'votes', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/votes/leaderboard', command: 'votes leaderboard', group: 'votes', auth: 'none', phase: 1, implemented: false },
  // brokered-listings (read)
  { method: 'GET', path: '/api/v1/brokered-listings/config', command: 'brokered-listings config', group: 'brokered-listings', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/brokered-listings/broker/:address', command: 'brokered-listings list', group: 'brokered-listings', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/brokered-listings/stats', command: 'brokered-listings stats', group: 'brokered-listings', auth: 'none', phase: 1, implemented: false },
  // poap (read)
  { method: 'GET', path: '/api/v1/poap/stats', command: 'poap stats', group: 'poap', auth: 'none', phase: 1, implemented: false },
  // personas (read, no auth)
  { method: 'GET', path: '/api/v1/personas', command: 'personas list', group: 'personas', auth: 'none', phase: 1, implemented: false },
  // orders (read)
  { method: 'GET', path: '/api/v1/orders/:id', command: 'orders get', group: 'orders', auth: 'none', phase: 1, implemented: false },
  // users (read, no auth)
  { method: 'GET', path: '/api/v1/users/:address/badges', command: 'users badges', group: 'users', auth: 'none', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/users/:address/balances', command: 'users balances', group: 'users', auth: 'none', phase: 1, implemented: false },
  // ai (optional auth)
  { method: 'GET', path: '/api/v1/ai/search/semantic', command: 'ai semantic-search', group: 'ai', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/ai/search/related', command: 'ai related', group: 'ai', auth: 'optional', phase: 1, implemented: false },
  { method: 'GET', path: '/api/v1/ai-recommendations/:name', command: 'ai recommendations', group: 'ai', auth: 'optional', phase: 1, implemented: false },
  // recommendations (no auth)
  { method: 'GET', path: '/api/v1/recommendations/also-viewed', command: 'recommendations also-viewed', group: 'recommendations', auth: 'optional', phase: 1, implemented: false },

  // === Phase 2: Auth-required read commands ===
  { method: 'GET', path: '/api/v1/watchlist/lists', command: 'watchlist lists', group: 'watchlist', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/watchlist', command: 'watchlist list', group: 'watchlist', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/watchlist/check/:name', command: 'watchlist check', group: 'watchlist', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/watchlist/search', command: 'watchlist search', group: 'watchlist', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/cart', command: 'cart list', group: 'cart', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/cart/summary', command: 'cart summary', group: 'cart', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/notifications', command: 'notifications list', group: 'notifications', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/notifications/unread/count', command: 'notifications unread-count', group: 'notifications', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/viewed', command: 'user-insights viewed', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/watched', command: 'user-insights watched', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/voted', command: 'user-insights voted', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/offers', command: 'user-insights offers', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/purchases', command: 'user-insights purchases', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/user/history/sales', command: 'user-insights sales', group: 'user-insights', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/recommendations/similar-to-watchlist', command: 'recommendations similar', group: 'recommendations', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/recommendations/based-on-votes', command: 'recommendations by-votes', group: 'recommendations', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/recommendations/for-you', command: 'recommendations for-you', group: 'recommendations', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/personas/me', command: 'personas me', group: 'personas', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/analytics/user/me', command: 'analytics user', group: 'analytics', auth: 'required', phase: 2, implemented: false },
  { method: 'GET', path: '/api/v1/poap/status', command: 'poap status', group: 'poap', auth: 'required', phase: 2, implemented: false },

  // === Phase 3: Write commands ===
  // listings
  { method: 'POST', path: '/api/v1/listings', command: 'listings create', group: 'listings', auth: 'none', phase: 3, implemented: false },
  { method: 'PUT', path: '/api/v1/listings/:id', command: 'listings update', group: 'listings', auth: 'none', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/listings/:id', command: 'listings delete', group: 'listings', auth: 'none', phase: 3, implemented: false },
  // offers
  { method: 'POST', path: '/api/v1/offers', command: 'offers create', group: 'offers', auth: 'none', phase: 3, implemented: false },
  { method: 'PUT', path: '/api/v1/offers/:id', command: 'offers update', group: 'offers', auth: 'none', phase: 3, implemented: false },
  // orders
  { method: 'POST', path: '/api/v1/orders', command: 'orders save', group: 'orders', auth: 'none', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/orders/create', command: 'orders create', group: 'orders', auth: 'none', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/orders/validate', command: 'orders validate', group: 'orders', auth: 'none', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/orders/:id', command: 'orders cancel', group: 'orders', auth: 'none', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/orders/bulk', command: 'orders bulk-save', group: 'orders', auth: 'none', phase: 3, implemented: false },
  // watchlist
  { method: 'POST', path: '/api/v1/watchlist', command: 'watchlist add', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/watchlist/:id', command: 'watchlist remove', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'PATCH', path: '/api/v1/watchlist/:id', command: 'watchlist update', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/watchlist/lists', command: 'watchlist create-list', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'PATCH', path: '/api/v1/watchlist/lists/:listId', command: 'watchlist update-list', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/watchlist/lists/:listId', command: 'watchlist delete-list', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/watchlist/bulk', command: 'watchlist bulk-add', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/watchlist/bulk', command: 'watchlist bulk-remove', group: 'watchlist', auth: 'required', phase: 3, implemented: false },
  // cart
  { method: 'POST', path: '/api/v1/cart', command: 'cart add', group: 'cart', auth: 'required', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/cart/bulk', command: 'cart bulk-add', group: 'cart', auth: 'required', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/cart/:id', command: 'cart remove', group: 'cart', auth: 'required', phase: 3, implemented: false },
  { method: 'DELETE', path: '/api/v1/cart', command: 'cart clear', group: 'cart', auth: 'required', phase: 3, implemented: false },
  // votes
  { method: 'POST', path: '/api/v1/votes', command: 'votes vote', group: 'votes', auth: 'required', phase: 3, implemented: false },
  // notifications
  { method: 'PATCH', path: '/api/v1/notifications/:id/read', command: 'notifications mark-read', group: 'notifications', auth: 'required', phase: 3, implemented: false },
  { method: 'PATCH', path: '/api/v1/notifications/read-all', command: 'notifications mark-all-read', group: 'notifications', auth: 'required', phase: 3, implemented: false },
  // users
  { method: 'PATCH', path: '/api/v1/users/me', command: 'users update', group: 'users', auth: 'required', phase: 3, implemented: false },
  // personas
  { method: 'POST', path: '/api/v1/personas/me/reclassify', command: 'personas reclassify', group: 'personas', auth: 'required', phase: 3, implemented: false },
  // verification
  { method: 'POST', path: '/api/v1/verification/email', command: 'verification email', group: 'verification', auth: 'none', phase: 3, implemented: false },
  { method: 'POST', path: '/api/v1/verification/resend', command: 'verification resend', group: 'verification', auth: 'required', phase: 3, implemented: false },
  // brokered-listings
  { method: 'POST', path: '/api/v1/brokered-listings', command: 'brokered-listings create', group: 'brokered-listings', auth: 'none', phase: 3, implemented: false },
  // poap
  { method: 'POST', path: '/api/v1/poap/claim', command: 'poap claim', group: 'poap', auth: 'required', phase: 3, implemented: false },
  // subgraph
  { method: 'POST', path: '/api/v1/subgraph', command: 'subgraph query', group: 'subgraph', auth: 'none', phase: 3, implemented: false },
];

export function getCoverageStats() {
  const total = ENDPOINTS.length;
  const implemented = ENDPOINTS.filter(e => e.implemented).length;
  const byPhase = [0, 1, 2, 3].map(phase => {
    const phaseEndpoints = ENDPOINTS.filter(e => e.phase === phase);
    const phaseImplemented = phaseEndpoints.filter(e => e.implemented).length;
    return { phase, total: phaseEndpoints.length, implemented: phaseImplemented };
  });
  return { total, implemented, percentage: Math.round((implemented / total) * 100), byPhase };
}

export function getUnimplementedByPhase(phase: number): EndpointEntry[] {
  return ENDPOINTS.filter(e => e.phase === phase && !e.implemented);
}

export function getUniqueGroups(): string[] {
  return [...new Set(ENDPOINTS.map(e => e.group))];
}
