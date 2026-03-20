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
  if (process.env.GRAILS_PRIVATE_KEY) {
    return loginWithPrivateKey();
  }
  return loginWithWalletConnect();
}

async function loginWithPrivateKey(): Promise<{ token: string; address: string }> {
  const privateKey = process.env.GRAILS_PRIVATE_KEY!;
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const http = createHttpClient();

  const { nonce, expiresAt } = await http.get<NonceResponse>('/auth/nonce', { address: account.address });

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

  const signature = await account.signMessage({ message: messageStr });

  const result = await http.post<AuthVerifyResponse>('/auth/verify', {
    message: messageStr,
    signature,
  });

  saveConfig({
    token: result.token,
    address: result.user.address,
    expiresAt,
  });

  return { token: result.token, address: result.user.address };
}

async function loginWithWalletConnect(): Promise<{ token: string; address: string }> {
  const { walletConnect } = await import('./walletconnect.js');
  const config = loadConfig();

  await walletConnect.initialize();

  let topic: string;
  let address: string;

  // Try restoring existing session
  if (config.wcSessionTopic) {
    const restored = walletConnect.restoreSession(config.wcSessionTopic);
    if (restored) {
      topic = restored.topic;
      address = restored.address;
    } else {
      // Stale topic — fall through to new connection
      ({ topic, address } = await connectWithQR(walletConnect));
    }
  } else {
    ({ topic, address } = await connectWithQR(walletConnect));
  }

  // SIWE flow — same as private key, but signed via wallet
  const http = createHttpClient();
  const { nonce, expiresAt } = await http.get<NonceResponse>('/auth/nonce', { address });

  const message = new SiweMessage({
    domain: 'grails.app',
    address,
    statement: 'Sign in to Grails ENS Marketplace',
    uri: 'https://grails.app',
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: expiresAt,
  });
  const messageStr = message.prepareMessage();

  process.stderr.write('Requesting signature from wallet...\n');
  const signature = await walletConnect.signMessage(topic, address, messageStr);

  const result = await http.post<AuthVerifyResponse>('/auth/verify', {
    message: messageStr,
    signature,
  });

  saveConfig({
    token: result.token,
    address: result.user.address,
    expiresAt,
    wcSessionTopic: topic,
  });

  return { token: result.token, address: result.user.address };
}

async function connectWithQR(wc: Awaited<typeof import('./walletconnect.js')>['walletConnect']): Promise<{ topic: string; address: string }> {
  const { uri, waitForApproval } = await wc.connect();

  // Display QR code on stderr (keep stdout clean for JSON)
  if (process.stderr.isTTY) {
    const qrcode = await import('qrcode-terminal');
    qrcode.generate(uri, { small: true }, (code: string) => {
      process.stderr.write('\nScan this QR code with your wallet:\n\n');
      process.stderr.write(code + '\n\n');
    });
  } else {
    process.stderr.write('WalletConnect URI (paste in wallet):\n');
  }
  process.stderr.write(uri + '\n');
  process.stderr.write('Waiting for wallet approval...\n');

  return waitForApproval();
}

export async function logout(): Promise<void> {
  const config = loadConfig();
  const token = getToken();
  if (token) {
    try {
      const http = createHttpClient();
      await http.post('/auth/logout');
    } catch {
      // Clear locally regardless
    }
  }

  // Disconnect WalletConnect session if present
  if (config.wcSessionTopic) {
    try {
      const { walletConnect } = await import('./walletconnect.js');
      await walletConnect.initialize();
      await walletConnect.disconnect(config.wcSessionTopic);
    } catch {
      // Best-effort disconnect
    }
  }

  clearAuth();
}

export async function ensureAuth(): Promise<string> {
  let token = getToken();
  if (token) return token;

  // Auto-refresh: private key mode
  if (process.env.GRAILS_PRIVATE_KEY) {
    const result = await login();
    return result.token;
  }

  // Auto-refresh: WalletConnect restored session
  const config = loadConfig();
  if (config.wcSessionTopic) {
    const result = await login();
    return result.token;
  }

  throw new CLIError(
    'Authentication required. Run `grails auth login` to authenticate.',
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
