import { LangfuseSpanProcessor } from '@langfuse/otel';
import { NodeSDK } from '@opentelemetry/sdk-node';

export const langfuseSpanProcessor = new LangfuseSpanProcessor();

export const otelSDK = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});

otelSDK.start();
