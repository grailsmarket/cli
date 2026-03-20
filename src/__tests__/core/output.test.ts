import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatOutput, printOutput } from '../../output.js';

describe('formatOutput', () => {
  it('returns JSON envelope by default', () => {
    const result = formatOutput({ foo: 'bar' });
    expect(JSON.parse(result)).toEqual({ ok: true, data: { foo: 'bar' } });
  });

  it('includes meta when provided', () => {
    const result = formatOutput({ foo: 'bar' }, {}, { page: 1 });
    expect(JSON.parse(result)).toEqual({ ok: true, data: { foo: 'bar' }, meta: { page: 1 } });
  });

  it('omits meta when not provided', () => {
    const result = formatOutput({ foo: 'bar' });
    expect(JSON.parse(result)).not.toHaveProperty('meta');
  });

  it('returns raw JSON in quiet mode', () => {
    const result = formatOutput({ foo: 'bar' }, { quiet: true });
    expect(result).toBe(JSON.stringify({ foo: 'bar' }));
  });

  it('returns human-readable format for objects', () => {
    const result = formatOutput({ name: 'test', count: 42 }, { human: true });
    expect(result).toContain('name');
    expect(result).toContain('test');
    expect(result).toContain('count');
    expect(result).toContain('42');
  });

  it('returns human-readable format for null', () => {
    const result = formatOutput(null, { human: true });
    expect(result).toContain('null');
  });

  it('returns string as-is in human mode', () => {
    const result = formatOutput('hello', { human: true });
    expect(result).toBe('hello');
  });

  it('returns number as string in human mode', () => {
    const result = formatOutput(42, { human: true });
    expect(result).toBe('42');
  });

  it('returns boolean as string in human mode', () => {
    const result = formatOutput(true, { human: true });
    expect(result).toBe('true');
  });

  it('handles empty array in human mode', () => {
    const result = formatOutput([], { human: true });
    expect(result).toContain('(empty)');
  });

  it('handles array of primitives in human mode', () => {
    const result = formatOutput(['a', 'b'], { human: true });
    expect(result).toContain('a');
    expect(result).toContain('b');
  });

  it('handles array of objects in human mode', () => {
    const result = formatOutput([{ x: 1 }], { human: true });
    expect(result).toContain('x');
    expect(result).toContain('1');
  });

  it('handles empty object in human mode', () => {
    const result = formatOutput({}, { human: true });
    expect(result).toContain('{}');
  });

  it('handles nested objects in human mode', () => {
    const result = formatOutput({ outer: { inner: 'val' } }, { human: true });
    expect(result).toContain('outer');
    expect(result).toContain('inner');
    expect(result).toContain('val');
  });

  it('handles undefined in human mode', () => {
    const result = formatOutput(undefined, { human: true });
    expect(result).toContain('null');
  });

  it('quiet takes precedence over human', () => {
    const result = formatOutput({ foo: 'bar' }, { quiet: true, human: true });
    expect(result).toBe(JSON.stringify({ foo: 'bar' }));
  });
});

describe('printOutput', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls console.log with formatted output', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    printOutput({ test: true });
    expect(logSpy).toHaveBeenCalledWith(
      JSON.stringify({ ok: true, data: { test: true } }, null, 2),
    );
  });
});
