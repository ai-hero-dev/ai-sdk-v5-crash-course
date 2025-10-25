import { experimental_useObject as useObject } from '@ai-sdk/react';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import z from 'zod';
import {
  BeverageItem,
  GenerateButton,
  LoadingSpinner,
  MenuHeader,
  MenuItem,
  MenuSection,
} from './components';
import './styles.css';

const menuSchema = z.object({
  restaurantName: z.string(),
  cuisine: z.string(),
  tagline: z.string(),
  appetizers: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()),
    })
  ),
  mains: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()),
    })
  ),
  desserts: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      tags: z.array(z.string()),
    })
  ),
  beverages: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      category: z.enum(['cocktail', 'wine', 'beer', 'non-alcoholic']),
    })
  ),
});

const cuisineOptions = [
  { value: 'fusion', label: 'Fusion' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'french', label: 'French' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'thai', label: 'Thai' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'indian', label: 'Indian' },
];

const themeOptions = [
  { value: 'modern', label: 'Modern' },
  { value: 'rustic', label: 'Rustic' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'coastal', label: 'Coastal' },
  { value: 'urban', label: 'Urban' },
  { value: 'romantic', label: 'Romantic' },
];

function App() {
  const [cuisineType, setCuisineType] = useState('fusion');
  const [theme, setTheme] = useState('modern');

  const { object, submit, isLoading } = useObject({
    api: '/api/generate-menu',
    schema: menuSchema,
  });

  const handleGenerate = () => {
    submit({ cuisineType, theme });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Controls */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
            Smart Menu Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered exquisite menu creation with streaming
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Cuisine Type
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border-2 border-amber-300 bg-white text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all disabled:opacity-50"
              >
                {cuisineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border-2 border-amber-300 bg-white text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all disabled:opacity-50"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <GenerateButton
            onClick={handleGenerate}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>

        {/* Menu Content */}
        {isLoading && !object && <LoadingSpinner />}

        {object && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-amber-100">
            <MenuHeader
              restaurantName={object.restaurantName}
              cuisine={object.cuisine}
              tagline={object.tagline}
            />

            {/* Appetizers */}
            {object.appetizers && object.appetizers.length > 0 && (
              <MenuSection title="Appetizers" icon="🥗">
                {object.appetizers.map((item, index) => (
                  <MenuItem key={index} {...item} index={index} />
                ))}
              </MenuSection>
            )}

            {/* Main Courses */}
            {object.mains && object.mains.length > 0 && (
              <MenuSection title="Main Courses" icon="🍽️">
                {object.mains.map((item, index) => (
                  <MenuItem key={index} {...item} index={index} />
                ))}
              </MenuSection>
            )}

            {/* Desserts */}
            {object.desserts && object.desserts.length > 0 && (
              <MenuSection title="Desserts" icon="🍰">
                {object.desserts.map((item, index) => (
                  <MenuItem key={index} {...item} index={index} />
                ))}
              </MenuSection>
            )}

            {/* Beverages */}
            {object.beverages && object.beverages.length > 0 && (
              <MenuSection title="Beverages" icon="🍷">
                {object.beverages.map((item, index) => (
                  <BeverageItem key={index} {...item} index={index} />
                ))}
              </MenuSection>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 italic">
                All prices are in USD. Menu items are generated by AI and may
                vary with each generation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
