import {
  type InferUITools,
  type JSONValue,
  type UIMessage,
  type UIMessagePart,
} from 'ai';
import z from 'zod/v4';
import { tools } from './tools.ts';

export const metadataSchema = z.object({});

type MyMetadata = z.infer<typeof metadataSchema>;

export const dataPartSchema = z.object({
  weather: z.object({
    weather: z.string().optional(),
    location: z.string().optional(),
    temperature: z.number().optional(),
    loading: z.boolean().default(true),
  }),
});

export type MyDataPart = z.infer<typeof dataPartSchema>;

export type MyToolSet = InferUITools<ReturnType<typeof tools>>;

export type MyUIMessage = UIMessage<
  MyMetadata,
  MyDataPart,
  MyToolSet
>;

export type MyUIMessagePart = UIMessagePart<
  MyDataPart,
  MyToolSet
>;

export type MyProviderMetadata = Record<
  string,
  Record<string, JSONValue | undefined>
>;
