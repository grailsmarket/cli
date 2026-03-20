import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CONFIG_DIR = join(homedir(), '.config', 'grails-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface CLIConfig {
  apiUrl: string;
  token?: string;
  address?: string;
  expiresAt?: string;
  wcSessionTopic?: string;
}

const DEFAULT_CONFIG: CLIConfig = {
  apiUrl: 'https://api.grails.app',
};

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): CLIConfig {
  try {
    if (existsSync(CONFIG_FILE)) {
      const raw = readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // Fall through to defaults
  }
  return { ...DEFAULT_CONFIG, apiUrl: process.env.GRAILS_API_URL || DEFAULT_CONFIG.apiUrl };
}

export function saveConfig(config: Partial<CLIConfig>): void {
  ensureConfigDir();
  const existing = loadConfig();
  const merged = { ...existing, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + '\n');
}

export function clearAuth(): void {
  const config = loadConfig();
  delete config.token;
  delete config.address;
  delete config.expiresAt;
  delete config.wcSessionTopic;
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
}

export function getToken(): string | null {
  const config = loadConfig();
  if (!config.token) return null;

  // Check expiry
  if (config.expiresAt) {
    const expiry = new Date(config.expiresAt);
    if (expiry <= new Date()) return null;
  }

  return config.token;
}

export function getApiUrl(): string {
  return process.env.GRAILS_API_URL || loadConfig().apiUrl;
}
