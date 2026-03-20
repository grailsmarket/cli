import chalk from 'chalk';

interface GlobalOpts {
  human?: boolean;
  quiet?: boolean;
}

export function formatOutput(data: unknown, opts?: GlobalOpts, meta?: Record<string, unknown>): string {
  if (opts?.quiet) {
    return JSON.stringify(data);
  }

  if (opts?.human) {
    return formatHuman(data);
  }

  return JSON.stringify({ ok: true, data, ...(meta ? { meta } : {}) }, null, 2);
}

export function printOutput(data: unknown, opts?: GlobalOpts, meta?: Record<string, unknown>): void {
  console.log(formatOutput(data, opts, meta));
}

function formatHuman(data: unknown, indent = 0): string {
  if (data === null || data === undefined) return chalk.dim('null');
  if (typeof data === 'string') return data;
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);

  if (Array.isArray(data)) {
    if (data.length === 0) return chalk.dim('(empty)');
    return data.map((item, i) => {
      const prefix = `${' '.repeat(indent)}${chalk.dim(`[${i}]`)} `;
      if (typeof item === 'object' && item !== null) {
        return prefix + '\n' + formatHuman(item, indent + 2);
      }
      return prefix + String(item);
    }).join('\n');
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return chalk.dim('{}');
    return entries.map(([key, value]) => {
      const label = ' '.repeat(indent) + chalk.cyan(key) + ': ';
      if (typeof value === 'object' && value !== null) {
        return label + '\n' + formatHuman(value, indent + 2);
      }
      return label + String(value);
    }).join('\n');
  }

  return String(data);
}
