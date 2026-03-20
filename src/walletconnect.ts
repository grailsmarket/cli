import { SignClient } from '@walletconnect/sign-client';

const PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const METADATA = {
  name: 'Grails CLI',
  description: 'CLI for the Grails ENS Marketplace',
  url: 'https://grails.app',
  icons: ['https://grails.app/favicon.ico'],
};

class WalletConnectService {
  private signClient: InstanceType<typeof SignClient> | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.signClient = await SignClient.init({
      projectId: PROJECT_ID,
      metadata: METADATA,
      logger: 'error',
    });

    this.signClient.on('session_delete', () => {
      // Session deleted by wallet — nothing to do locally,
      // config still has the topic but restoreSession will fail gracefully
    });

    this.signClient.on('session_expire', () => {
      // Same as above
    });

    this.initialized = true;
  }

  async connect(timeoutMs = 60_000): Promise<{ uri: string; waitForApproval: () => Promise<{ topic: string; address: string }> }> {
    if (!this.initialized) await this.initialize();
    if (!this.signClient) throw new Error('WalletConnect not initialized');

    const { uri, approval } = await this.signClient.connect({
      optionalNamespaces: {
        eip155: {
          methods: ['personal_sign'],
          chains: ['eip155:1'],
          events: ['accountsChanged', 'chainChanged'],
        },
      },
    });

    if (!uri) throw new Error('Failed to generate pairing URI');

    return {
      uri,
      waitForApproval: () =>
        new Promise<{ topic: string; address: string }>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error('WalletConnect pairing timed out')),
            timeoutMs,
          );

          approval()
            .then((session) => {
              clearTimeout(timer);
              const accounts = session.namespaces.eip155?.accounts || [];
              if (accounts.length === 0) {
                reject(new Error('No accounts returned from wallet'));
                return;
              }
              const [, , address] = accounts[0].split(':');
              resolve({ topic: session.topic, address });
            })
            .catch((err) => {
              clearTimeout(timer);
              reject(err);
            });
        }),
    };
  }

  restoreSession(topic: string): { topic: string; address: string } | null {
    if (!this.signClient) return null;

    const sessions = this.signClient.session.getAll();
    const session = sessions.find((s) => s.topic === topic);
    if (!session) return null;

    const accounts = session.namespaces.eip155?.accounts || [];
    if (accounts.length === 0) return null;

    const [, , address] = accounts[0].split(':');
    return { topic: session.topic, address };
  }

  async signMessage(topic: string, address: string, message: string): Promise<string> {
    if (!this.signClient) throw new Error('WalletConnect not initialized');

    const result = await this.signClient.request({
      topic,
      chainId: 'eip155:1',
      request: {
        method: 'personal_sign',
        params: [
          // personal_sign expects hex-encoded message first, then address
          `0x${Buffer.from(message, 'utf-8').toString('hex')}`,
          address,
        ],
      },
    });

    return result as string;
  }

  async disconnect(topic: string): Promise<void> {
    if (!this.signClient) return;

    try {
      await this.signClient.disconnect({
        topic,
        reason: { code: 6000, message: 'User disconnected' },
      });
    } catch {
      // Best-effort disconnect
    }
  }
}

export const walletConnect = new WalletConnectService();
