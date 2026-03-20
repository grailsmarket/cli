import { getCoverageStats, getUnimplementedByPhase, ENDPOINTS } from '../src/coverage.js';

const stats = getCoverageStats();

console.log('=== Grails CLI Coverage Report ===\n');
console.log(`Total: ${stats.implemented}/${stats.total} (${stats.percentage}%)\n`);

for (const phase of stats.byPhase) {
  const pct = phase.total > 0 ? Math.round((phase.implemented / phase.total) * 100) : 100;
  const label = phase.phase === 0 ? 'Foundation' : phase.phase === 1 ? 'Read (no auth)' : phase.phase === 2 ? 'Read (auth)' : 'Write';
  const status = phase.implemented === phase.total ? 'DONE' : `${phase.implemented}/${phase.total}`;
  console.log(`  Phase ${phase.phase} (${label}): ${status} (${pct}%)`);
}

// Find the current active phase (first incomplete phase)
const activePhase = stats.byPhase.find(p => p.implemented < p.total);

if (activePhase) {
  const remaining = getUnimplementedByPhase(activePhase.phase);
  console.log(`\n=== Next batch (Phase ${activePhase.phase}) ===\n`);

  // Group by command group
  const grouped = new Map<string, typeof remaining>();
  for (const endpoint of remaining) {
    const group = grouped.get(endpoint.group) || [];
    group.push(endpoint);
    grouped.set(endpoint.group, group);
  }

  for (const [group, endpoints] of grouped) {
    console.log(`  ${group}:`);
    for (const ep of endpoints) {
      console.log(`    ${ep.method.padEnd(6)} ${ep.command}`);
    }
  }

  console.log(`\n${remaining.length} commands remaining in this phase.`);
} else {
  console.log('\nAll commands implemented!');
}
