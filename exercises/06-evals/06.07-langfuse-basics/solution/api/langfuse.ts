import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { LangfuseSpanProcessor } from '@langfuse/otel';

declare global {
  // eslint-disable-next-line no-var
  var __langfuseOtelStarted: boolean | undefined;
}

export function initLangfuseOtel() {
  if (globalThis.__langfuseOtelStarted) return;
  globalThis.__langfuseOtelStarted = true;

  const sdk = new NodeSDK({
    contextManager: new AsyncLocalStorageContextManager(),
    spanProcessors: [
      new LangfuseSpanProcessor({
        publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
        secretKey: process.env.LANGFUSE_SECRET_KEY!,
        baseUrl: process.env.LANGFUSE_BASE_URL!,
        environment: process.env.NODE_ENV,
      }),
    ],
  });

  sdk.start();
}
