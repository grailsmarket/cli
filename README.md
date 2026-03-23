# Grails CLI

Command-line interface for the [Grails ENS Marketplace](https://grails.app) API. Covers the full API surface (124 endpoints) and outputs structured JSON by default, making it ideal for agent and script consumption.

> [!WARNING]
> This is experimental software and should be used with caution. This tool accesses Grails API endpoints that allow the operator to create and delete offers, listings and update user data. Users are encouraged to test with a test wallet with no funds before using any permissioned endpoints.

## Setup

### Prerequisites

- Node.js >= 20
- npm

### Install

```bash
git clone git@github.com:grailsmarket/cli.git
cd cli
npm install
```

### Build

```bash
npm run build
```

This produces a standalone binary at `dist/index.js`. You can link it globally:

```bash
npm link
grails --help
```

### Development

```bash
# Run commands directly without building
npm run dev -- names get vitalik.eth

# Type check
npm run typecheck

# Run tests
npm run test

# Check API coverage
npm run coverage
```

## Authentication

Some commands require authentication. The CLI supports two auth methods:

### Option A: WalletConnect (interactive)

```bash
grails auth login
```

Scan the QR code with your wallet (or paste the URI). After approving, you'll see:

```
Connected with 0x1234...abcd
Authenticated successfully
```

The session is saved so future logins can restore it without re-scanning.

### Option B: Private key (CI / scripts)

```bash
export GRAILS_PRIVATE_KEY=0xYourPrivateKeyHere
grails auth login
```

The private key is **never stored on disk** — only the resulting JWT token is saved to `~/.config/grails-cli/config.json`.

### 3. Check status

```bash
grails auth status
```

The token auto-refreshes when expired (if `GRAILS_PRIVATE_KEY` is set). Commands that need auth will prompt you if no valid session exists.

### Configuration

You can override the default API URL:

```bash
export GRAILS_API_URL=http://localhost:3000
```

Config is stored at `~/.config/grails-cli/config.json`:

```json
{
  "apiUrl": "https://api.grails.app",
  "token": "eyJ...",
  "address": "0x...",
  "expiresAt": "2026-03-21T00:00:00Z"
}
```

## Usage

```
grails [options] <command> <subcommand> [args] [flags]
```

### Global Options

| Flag | Description |
|------|-------------|
| `--human` | Human-readable formatted output |
| `--quiet` | Output only the raw data (for piping) |
| `--help` | Show help for any command |
| `--version` | Print version |

By default, all output is structured JSON:

```json
{
  "ok": true,
  "data": { ... }
}
```

Errors follow the same structure:

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "ENS name \"foo.eth\" not found",
    "status": 404
  }
}
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication required |
| 3 | Validation error |
| 4 | Not found |
| 5 | Rate limited |
| 10 | Network error |
| 11 | Timeout |

## Commands

### Names

```bash
# List names with filtering
grails names list --owner 0x1234... --status listed --sort price --order desc

# Get name details
grails names get vitalik.eth

# Get metadata (fresh from The Graph)
grails names metadata vitalik.eth

# Get legacy data with OpenSea listings
grails names legacy vitalik.eth

# Transaction history
grails names history vitalik.eth --page 1 --limit 50
```

### Search

```bash
# Search with filters
grails search query "cat" --min-length 3 --max-length 5 --listed true --sort-by price

# Bulk exact search (up to 10,000)
grails search bulk "vitalik.eth,nick.eth,brantly.eth"

# Bulk search with filters
grails search bulk-filters "cat,dog,fish" --sort-by price --sort-order asc
```

### Listings

```bash
# List active listings
grails listings list --sort price --order asc --min-price 1000000000000000

# Get listing by ID
grails listings get 42

# Get listings for a name
grails listings by-name vitalik.eth

# Create a listing (requires order data from Seaport)
grails listings create --data '{"ensNameId": 1, "sellerAddress": "0x...", "priceWei": "1000000000000000000", "orderData": {...}}'

# Update listing price
grails listings update 42 --price-wei 2000000000000000000

# Cancel a listing
grails listings delete 42
```

### Offers

```bash
# Get offers for a name
grails offers by-name vitalik.eth --status pending

# Get offers by buyer
grails offers by-buyer 0x1234...

# Get offers received by owner
grails offers by-owner 0x1234...

# Create an offer
grails offers create --data '{"ensNameId": 1, "buyerAddress": "0x...", "offerAmountWei": "500000000000000000", "orderData": {...}}'

# Update an offer
grails offers update 42 --status accepted
```

### Sales

```bash
# Recent sales
grails sales list --page 1 --limit 50

# Sales for a name
grails sales by-name vitalik.eth

# Sales by address (buyer, seller, or both)
grails sales by-address 0x1234... --type seller

# Sales analytics
grails sales analytics vitalik.eth
```

### Activity

```bash
# Global activity feed
grails activity feed --event-type sale --club 999

# Activity for a name
grails activity by-name vitalik.eth

# Activity for an address
grails activity by-address 0x1234... --event-type listing
```

### Trending

```bash
# Trending by views, watchlist, votes, sales, offers, or composite
grails trending views --period 24h --limit 20
grails trending composite --period 7d
grails trending sales --period 24h
```

### Analytics

```bash
# Market overview
grails analytics market --period 7d

# Club analytics
grails analytics club 999 --period 30d

# Price trends, volume, registrations
grails analytics price-trends --period 90d
grails analytics volume --period 7d
grails analytics registrations --period 30d --sort-by cost --clubs "999,10k"

# Sales/listings/offers analytics
grails analytics sales --period 7d --source grails
grails analytics listings --period 30d --status active

# Personal analytics (requires auth)
grails analytics user --period 30d
```

### Charts

```bash
# Time-series data for charting
grails charts sales --period 30d --club 999
grails charts volume --period 1y
grails charts listings --period 7d
grails charts registrations --period 30d
grails charts offers --period 7d
```

### Clubs

```bash
# List all clubs
grails clubs list --sort-by floor_price_wei --sort-order desc

# Club details
grails clubs get 999

# Club holders
grails clubs holders 999 --page 1 --limit 50
grails clubs all-holders --club-name 999
```

### Watchlist (requires auth)

```bash
# View watchlist
grails watchlist list --page 1 --limit 20
grails watchlist lists
grails watchlist search -q "cat" --sort-by price

# Add/remove names
grails watchlist add vitalik.eth
grails watchlist remove 42
grails watchlist check vitalik.eth

# Manage collections
grails watchlist create-list "My Favorites"
grails watchlist update-list 1 --name "Top Picks"
grails watchlist delete-list 1

# Bulk operations
grails watchlist bulk-add --ens-names "cat.eth,dog.eth,fish.eth"
grails watchlist bulk-remove --ens-names "cat.eth,dog.eth"
```

### Cart (requires auth)

```bash
grails cart list --type buy
grails cart summary
grails cart add --ens-name-id 42 --cart-type buy
grails cart remove 1
grails cart clear --cart-type buy
```

### Votes (requires auth for voting)

```bash
# Get votes for a name
grails votes get vitalik.eth

# Vote leaderboard
grails votes leaderboard --sort-by netScore --limit 50

# Cast a vote (-1, 0, or 1)
grails votes vote vitalik.eth --vote 1
```

### Notifications (requires auth)

```bash
grails notifications list --unread-only --limit 50
grails notifications unread-count
grails notifications mark-read 42
grails notifications mark-all-read
```

### User Insights (requires auth)

```bash
grails user-insights viewed --limit 50
grails user-insights watched
grails user-insights voted
grails user-insights offers
grails user-insights purchases
grails user-insights sales
```

### Recommendations

```bash
# Also-viewed (public)
grails recommendations also-viewed vitalik.eth --limit 10

# Personalized (requires auth)
grails recommendations similar --limit 10
grails recommendations by-votes --limit 10
grails recommendations for-you --limit 10
```

### AI Search

```bash
# Semantic search (AI-expanded)
grails ai semantic-search "animals" --limit 20

# Related names
grails ai related "cat" --limit 20

# AI recommendations for a name
grails ai recommendations vitalik.eth
```

### Other Commands

```bash
# Profiles
grails profiles get vitalik.eth

# ENS roles
grails ens-roles roles vitalik.eth
grails ens-roles can-manage vitalik.eth 0x1234...
grails ens-roles manageable-names 0x1234...

# Leaderboard
grails leaderboard global --sort-by names_owned --limit 50

# Legends
grails legends get 0x1234...
grails legends details 0x1234... --type early_adopter

# Google metrics
grails google-metrics get vitalik

# Personas
grails personas list
grails personas me
grails personas reclassify

# Orders
grails orders get 42
grails orders create --data '{"tokenId": "123", "price": "1000000000000000000", "offerer": "0x..."}'
grails orders validate --data '{"orderData": {...}}'
grails orders cancel 42

# Brokered listings
grails brokered-listings config
grails brokered-listings list 0xBrokerAddress
grails brokered-listings stats

# POAP
grails poap stats
grails poap status
grails poap claim

# Verification
grails verification email abc123
grails verification resend

# User profile
grails users badges 0x1234...
grails users balances 0x1234...
grails users update --email user@example.com

# Subgraph
grails subgraph query --data '{"query": "{ domains(first: 5) { name } }"}'

# Health
grails health check
grails health ready
```

## For Agents

This CLI is designed for programmatic use by AI agents and scripts. Key properties:

- **Structured JSON** on stdout by default — parse with `jq` or any JSON parser
- **Meaningful exit codes** — check `$?` to determine error type without parsing
- **No interactive prompts** — all input via flags and environment variables
- **Deterministic output** — same input always produces same output shape
- **Auth auto-refresh** — set `GRAILS_PRIVATE_KEY` once and the CLI handles token lifecycle

Example agent workflow:

```bash
# Search for 3-letter names under 1 ETH
results=$(grails search query "*" --max-length 3 --listed true --max-price 1000000000000000000)

# Check if any results
if echo "$results" | jq -e '.ok' > /dev/null 2>&1; then
  echo "$results" | jq '.data.results[].name'
fi

# Add interesting names to watchlist
grails watchlist add cat.eth
grails watchlist add dog.eth
```

## Project Structure

```
src/
  index.ts              Entry point, registers all command groups
  http.ts               HTTP client with retry, auth injection, response unwrapping
  config.ts             Config file management (~/.config/grails-cli/)
  auth.ts               SIWE authentication flow
  output.ts             JSON / human-readable output formatting
  errors.ts             Error handling and exit codes
  coverage.ts           Endpoint coverage manifest
  commands/
    auth/               login, logout, me, status
    names/              list, get, metadata, legacy, history
    listings/           list, get, by-name, create, update, delete
    offers/             get, by-name, by-buyer, by-owner, create, update
    orders/             get, save, create, validate, cancel, bulk-save
    sales/              list, by-name, by-address, analytics
    search/             query, bulk, bulk-filters
    activity/           feed, by-name, by-address
    clubs/              list, get, holders, all-holders
    trending/           views, watchlist, votes, sales, offers, composite
    profiles/           get
    analytics/          market, club, price-trends, volume, registrations, ...
    charts/             sales, volume, listings, registrations, offers
    leaderboard/        global
    legends/            get, details
    ens-roles/          roles, can-manage, manageable-names
    google-metrics/     get
    votes/              get, leaderboard, vote
    brokered-listings/  config, list, stats, create
    poap/               stats, status, claim
    personas/           list, me, reclassify
    users/              badges, balances, update
    ai/                 semantic-search, related, recommendations
    recommendations/    also-viewed, similar, by-votes, for-you
    watchlist/          lists, list, check, search, add, remove, update, ...
    cart/               list, summary, add, bulk-add, remove, clear
    notifications/      list, unread-count, mark-read, mark-all-read
    user-insights/      viewed, watched, voted, offers, purchases, sales
    verification/       email, resend
    subgraph/           query
    health/             check, ready
scripts/
  check-coverage.ts     Coverage report script
```

## License

MIT
