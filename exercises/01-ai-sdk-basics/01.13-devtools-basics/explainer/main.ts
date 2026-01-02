import { runLocalDevServer } from '#shared/run-local-dev-server.ts';

await runLocalDevServer({
  root: import.meta.dirname,
});
