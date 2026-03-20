import { privateKeyToAccount } from 'viem/accounts';
import { SiweMessage } from 'siwe';
import { createHttpClient } from './http.js';
import { saveConfig, clearAuth, getToken, loadConfig } from './config.js';
import { CLIError, EXIT_CODES } from './errors.js';

interface NonceResponse {
  nonce: string;
  expiresAt: string;
}

interface AuthVerifyResponse {
  token: string;
  user: { address: string };
}

export async function login(): Promise<{ token: string; address: string }> {
  const privateKey = process.env.GRAILS_PRIVATE_KEY;
  if (!privateKey) {
    throw new CLIError(
      'GRAILS_PRIVATE_KEY environment variable is required for authentication',
      'AUTH_NO_KEY',
      undefined,
      EXIT_CODES.AUTH_REQUIRED,
    );
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const http = createHttpClient();

  // Step 1: Get nonce
  const { nonce, expiresAt } = await http.get<NonceResponse>('/auth/nonce', { address: account.address });

  // Step 2: Create SIWE message
  const message = new SiweMessage({
    domain: 'grails.app',
    address: account.address,
    statement: 'Sign in to Grails ENS Marketplace',
    uri: 'https://grails.app',
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: expiresAt,
  });
  const messageStr = message.prepareMessage();

  // Step 3: Sign
  const signature = await account.signMessage({ message: messageStr });

  // Step 4: Verify
  const result = await http.post<AuthVerifyResponse>('/auth/verify', {
    message: messageStr,
    signature,
  });

  // Step 5: Store token
  saveConfig({
    token: result.token,
    address: result.user.address,
    expiresAt,
  });

  return { token: result.token, address: result.user.address };
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      const http = createHttpClient();
      await http.post('/auth/logout');
    } catch {
      // Clear locally regardless
    }
  }
  clearAuth();
}

export async function ensureAuth(): Promise<string> {
  let token = getToken();
  if (token) return token;

  // Try auto-refresh if private key is available
  if (process.env.GRAILS_PRIVATE_KEY) {
    const result = await login();
    return result.token;
  }

  throw new CLIError(
    'Authentication required. Run `grails auth login` with GRAILS_PRIVATE_KEY set.',
    'AUTH_REQUIRED',
    401,
    EXIT_CODES.AUTH_REQUIRED,
  );
}

export function getAuthStatus(): { authenticated: boolean; address?: string; expiresAt?: string } {
  const config = loadConfig();
  const token = getToken();
  if (!token) {
    return { authenticated: false };
  }
  return {
    authenticated: true,
    address: config.address,
    expiresAt: config.expiresAt,
  };
}
