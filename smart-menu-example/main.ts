import { runLocalDevServer } from '#shared/run-local-dev-server.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { close } = await runLocalDevServer({
  root: __dirname,
});

process.on('SIGINT', () => {
  close();
  process.exit(0);
});
