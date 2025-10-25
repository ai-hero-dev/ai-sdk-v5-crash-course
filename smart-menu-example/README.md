# Smart Menu Generator - Modern AI-Powered Restaurant Menu

A beautiful, modern example showcasing AI SDK v5's `streamObject` capabilities with an exquisite restaurant menu generator.

## Features

- **Real-time Streaming**: Watch as the AI generates your menu in real-time
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Customizable**: Choose from multiple cuisines and themes
- **Structured Data**: Demonstrates streaming complex objects with Zod schemas

## What Makes This Modern?

### Visual Design
- **Gradient Backgrounds**: Soft, layered gradients with animated blob effects
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Elegant Typography**: Combination of serif and sans-serif fonts for hierarchy
- **Golden Color Palette**: Warm amber/gold tones for a premium feel
- **Smooth Shadows**: Layered shadows that respond to hover states

### User Experience
- **Progressive Loading**: Items appear with staggered animations as they stream in
- **Interactive Elements**: Hover effects on menu items with smooth transitions
- **Responsive Grid**: Automatically adapts to different screen sizes
- **Loading States**: Beautiful spinner with contextual messaging
- **Form Controls**: Styled dropdowns for cuisine and theme selection

### Technical Features
- **Streaming Objects**: Uses AI SDK v5's `useObject` hook for real-time updates
- **Type Safety**: Full TypeScript with Zod schema validation
- **Modern React**: Uses React 19 with hooks and functional components
- **Tailwind CSS**: Utility-first styling with custom animations
- **Optimized Rendering**: Efficient updates as partial objects stream in

## How to Run

1. Make sure you have your `.env` file configured with your API keys:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

2. Run the development server:
   ```bash
   pnpm tsx smart-menu-example/main.ts
   ```

3. Open your browser to `http://localhost:3000`

4. Click "Generate New Menu" and watch the magic happen!

## How It Works

### Backend (`api/generate-menu.ts`)
The API endpoint uses `streamObject` to generate a structured menu:
- Defines a comprehensive Zod schema for the menu structure
- Streams the object generation in real-time
- Returns a text stream response that the frontend can consume

### Frontend (`client/root.tsx`)
The React app uses the `useObject` hook to:
- Subscribe to the streaming object updates
- Render menu items as they arrive
- Provide interactive controls for customization

### Components (`client/components.tsx`)
Modern, reusable components for:
- Menu header with gradient text
- Menu items with hover effects
- Beverage cards with category badges
- Section headers with decorative elements
- Loading spinner and generate button

### Styling (`client/styles.css`)
Custom animations and enhancements:
- Fade-in and slide-up animations
- Blob background animations
- Custom scrollbar styling
- Responsive breakpoints

## Customization

You can customize the menu generation by:

1. **Cuisine Type**: Choose from Italian, Japanese, French, Mediterranean, Thai, Mexican, Indian, or Fusion
2. **Theme**: Select from Modern, Rustic, Elegant, Coastal, Urban, or Romantic

Each combination produces a unique menu with appropriate dishes, descriptions, and pricing.

## Schema Structure

```typescript
{
  restaurantName: string,
  cuisine: string,
  tagline: string,
  appetizers: Array<{
    name: string,
    description: string,
    price: number,
    tags: string[]
  }>,
  mains: Array<...>,
  desserts: Array<...>,
  beverages: Array<{
    name: string,
    description: string,
    price: number,
    category: 'cocktail' | 'wine' | 'beer' | 'non-alcoholic'
  }>
}
```

## Learning Objectives

This example demonstrates:
- Advanced usage of `streamObject` for complex data structures
- Real-time UI updates with streaming data
- Modern component design patterns
- Responsive and accessible UI design
- Error handling and loading states
- Integration of AI SDK v5 with React

## Design Principles Applied

1. **Visual Hierarchy**: Clear distinction between sections and items
2. **Progressive Enhancement**: Content appears gracefully as it loads
3. **Feedback**: Loading states and hover interactions
4. **Consistency**: Unified color scheme and spacing system
5. **Performance**: Efficient rendering with minimal re-renders
6. **Accessibility**: Semantic HTML and proper ARIA labels

Enjoy creating your exquisite AI-generated menus!
