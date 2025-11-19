// Requires an OPENAI_API_KEY environment variable in .env
import { openai } from '@ai-sdk/openai';

// Requires a GOOGLE_GENERATIVE_AI_API_KEY environment variable in .env
import { google } from '@ai-sdk/google';

// Requires an ANTHROPIC_API_KEY environment variable in .env
import { anthropic } from '@ai-sdk/anthropic';

import { groq } from '@ai-sdk/groq';

const model = openai('gpt-5-mini');

console.dir(model, { depth: null });
