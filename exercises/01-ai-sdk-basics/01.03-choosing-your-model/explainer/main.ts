// Requires an OPENAI_API_KEY environment variable in .env
import { openai } from '@ai-sdk/openai';

// Requires a GOOGLE_GENERATIVE_AI_API_KEY environment variable in .env
import { google } from '@ai-sdk/google';

// Requires an ANTHROPIC_API_KEY environment variable in .env
import { anthropic } from '@ai-sdk/anthropic';

// const model = openai('gpt-4o-mini');

const model = google("gemini-2.0-flash")

console.dir(model, { depth: null });
