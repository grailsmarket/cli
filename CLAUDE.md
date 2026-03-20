# Grails CLI

CLI for the Grails ENS Marketplace API, designed for AI agent consumption.

## Commands

```bash
npm run dev -- <command>        # Run in development
npm run build                   # Build for distribution
npm run typecheck               # Type check
npm run test                    # Run tests
npm run coverage                # Check endpoint coverage
```

## Adding a New Command

1. Create `src/commands/<group>/<action>.ts` following this pattern:

```typescript
import { Command } from 'commander';
import { createHttpClient } from '../../http.js';
import { printOutput } from '../../output.js';
import { handleError } from '../../errors.js';

export function registerXxxCommand(parent: Command) {
  parent
    .command('xxx <arg>')
    .description('Description here')
    .option('--page <n>', 'Page number', '1')
    .option('--limit <n>', 'Results per page', '20')
    .action(async (arg: string, opts, cmd) => {
      try {
        const http = createHttpClient();
        const data = await http.get(`/endpoint/${encodeURIComponent(arg)}`, {
          page: opts.page,
          limit: opts.limit,
        });
        printOutput(data, cmd.optsWithGlobals());
      } catch (error) {
        handleError(error);
      }
    });
}
```

2. Register in `src/commands/<group>/index.ts`
3. If new group, register in `src/index.ts`
4. Mark as `implemented: true` in `src/coverage.ts`

### For auth-required commands

```typescript
import { ensureAuth } from '../../auth.js';

// Inside action:
await ensureAuth();
```

### For write commands (POST/PUT/PATCH/DELETE)

Accept `--data` as JSON string OR individual flags:

```typescript
.option('--data <json>', 'Request body as JSON')
.option('--name <name>', 'Name field')
// In action:
const body = opts.data ? JSON.parse(opts.data) : { name: opts.name };
const data = await http.post('/endpoint', body);
```

## Architecture

- `src/http.ts` — HTTP client with retry, auth header injection, response unwrapping
- `src/config.ts` — Config at `~/.config/grails-cli/config.json`
- `src/auth.ts` — SIWE auth via GRAILS_PRIVATE_KEY env var
- `src/output.ts` — JSON (default) or --human output
- `src/errors.ts` — Structured errors with exit codes
- `src/coverage.ts` — Endpoint manifest for tracking progress

## Output Format

All commands output JSON to stdout:
```json
{ "ok": true, "data": { ... } }
{ "ok": false, "error": { "code": "...", "message": "..." } }
```

## Backend API Reference

The API is at `~/work/grails/backend`. Route files are in `services/api/src/routes/`.
The SDK is at `services/sdk/` — covers auth, names, listings, offers, orders, search.

## /loop Usage

After Phase 0 foundation is built, use /loop to implement remaining commands:

```
/loop 15m Check CLI coverage by running `npx tsx scripts/check-coverage.ts`. Pick the next 5-8 unimplemented commands. For each: create the command file following patterns in src/commands/, wire into group index.ts and src/index.ts, mark implemented in src/coverage.ts. Run `npm run typecheck` after.
```
