import { serve } from '@hono/node-server';
import tailwindcss from '@tailwindcss/vite';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { once } from 'node:events';
import path from 'node:path';
import { createServer } from 'vite';

type SimpleAPIRoute = (
  req: Request,
) => Promise<Response> | Response;

const indexHtmlTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>AI SDK v5 Crash Course</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/root.tsx"></script>
  </body>
</html>
`;

const runHonoApp = async (opts: {
  root: string;
  getModule: (url: string) => Promise<any>;
}) => {
  const app = new Hono();

  app.use('/*', cors());

  app.use('/*', async (c) => {
    const url = new URL(c.req.url);

    if (url.pathname.includes('favicon')) {
      c.res = new Response('Not found', { status: 404 });
      return;
    }

    if (url.pathname === '/') {
      return c.redirect('http://localhost:3000');
    }

    try {
      const modulePath = path.join(
        opts.root,
        url.pathname.slice(1) + '.ts',
      );

      const mod = await opts.getModule(modulePath);

      const handler: SimpleAPIRoute | undefined =
        mod[c.req.method.toUpperCase()];

      if (!handler) {
        c.res = new Response('Not found', { status: 404 });
        return;
      }

      c.res = await handler(c.req.raw);
      return;
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Error when evaluating SSR module')
      ) {
        c.res = new Response('Not found', { status: 404 });
        return;
      } else {
        console.error(e);
        c.res = new Response('Internal server error', {
          status: 500,
        });
        return;
      }
    }
  });

  const honoServer = serve({
    fetch: app.fetch,
    port: 3001,
  });

  await once(honoServer, 'listening');

  return honoServer;
};

/**
 * Runs a local dev server for a given root directory and routes.
 *
 * Client code is assumed to be at `./client` of the root directory.
 * Server code is assumed to be at `./api` of the root directory.
 */
export const runLocalDevServer = async (opts: {
  root: string;
}) => {
  const viteServer = await createServer({
    configFile: false,
    server: {
      port: 3000,
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
    plugins: [
      tailwindcss(),
      {
        name: 'virtual-index-html',
        configureServer(server) {
          server.middlewares.use('/', (req, res, next) => {
            const url = new URL(
              `http://localhost:3000${req.url ?? ''}`,
            );
            if (
              url.pathname === '/' ||
              url.pathname === '/index.html'
            ) {
              res.setHeader('Content-Type', 'text/html');
              res.end(indexHtmlTemplate);
              return;
            }
            next();
          });
        },
      },
    ],
    root: path.join(opts.root, 'client'),
  });

  const honoServer = await runHonoApp({
    root: opts.root,
    getModule: async (url) => {
      const mod = await viteServer.ssrLoadModule(url);
      return mod;
    },
  });

  await viteServer.listen();

  viteServer.printUrls();

  return {
    close: () => {
      viteServer.close();
      honoServer?.close();
    },
  };
};
