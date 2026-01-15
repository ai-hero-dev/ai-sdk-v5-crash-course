// TODO: declare the langfuseSpanProcessor variable using the
// LangfuseSpanProcessor class from the @langfuse/otel package
export const langfuseSpanProcessor = TODO;

// TODO: declare the otelSDK variable using the NodeSDK class
// from the @opentelemetry/sdk-node package,
// and pass it the langfuseSpanProcessor in the spanProcessors array
export const otelSDK = TODO;

otelSDK.start();
