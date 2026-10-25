import { buildApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createGoogleVerifier } from './google.ts';
import { Store } from './store.ts';

const config = loadConfig();
const store = new Store(config.databasePath);
const app = await buildApp({ config, store, verifyGoogle: createGoogleVerifier(config.googleClientId) });

const shutdown = async () => {
  await app.close();
  store.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await app.listen({ host: config.host, port: config.port });
