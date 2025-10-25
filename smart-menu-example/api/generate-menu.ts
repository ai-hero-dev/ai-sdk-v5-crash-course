import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import z from 'zod';

const model = google('gemini-2.0-flash');

const menuSchema = z.object({
  restaurantName: z.string().describe('An elegant, creative restaurant name'),
  cuisine: z.string().describe('The type of cuisine'),
  tagline: z.string().describe('A catchy tagline for the restaurant'),
  appetizers: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()).describe('dietary tags like vegan, gluten-free, spicy'),
    })
  ).describe('3-4 creative appetizers'),
  mains: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()),
    })
  ).describe('5-6 exquisite main courses'),
  desserts: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()),
    })
  ).describe('3-4 decadent desserts'),
  beverages: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      category: z.enum(['cocktail', 'wine', 'beer', 'non-alcoholic']),
    })
  ).describe('4-6 specialty beverages'),
});

export const POST = async (req: Request) => {
  const { cuisineType = 'fusion', theme = 'modern' } = await req.json();

  const result = streamObject({
    model,
    schema: menuSchema,
    prompt: `Generate an excessive, impressive, and creative restaurant menu for a ${theme} ${cuisineType} restaurant.

    Make it luxurious and detailed with:
    - A sophisticated restaurant name
    - Elaborate descriptions for each dish
    - Creative ingredient combinations
    - Realistic but upscale pricing
    - Interesting dietary tags
    - Premium beverages

    Make every item sound absolutely irresistible and unique. Be creative and excessive with the descriptions!`,
  });

  return result.toTextStreamResponse();
};
