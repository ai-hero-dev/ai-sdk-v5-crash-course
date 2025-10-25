export const MenuHeader = ({
  restaurantName,
  cuisine,
  tagline
}: {
  restaurantName?: string;
  cuisine?: string;
  tagline?: string;
}) => (
  <div className="text-center mb-12 space-y-4 animate-fade-in">
    <div className="inline-block">
      <h1 className="text-6xl font-serif font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
        {restaurantName || 'Loading...'}
      </h1>
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
    </div>
    {cuisine && (
      <p className="text-xl text-amber-700 font-light tracking-wide uppercase">
        {cuisine} Cuisine
      </p>
    )}
    {tagline && (
      <p className="text-lg text-gray-600 italic font-light max-w-2xl mx-auto">
        "{tagline}"
      </p>
    )}
  </div>
);

export const MenuItem = ({
  name,
  description,
  price,
  tags,
  index = 0
}: {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  index?: number;
}) => (
  <div
    className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-2xl font-serif font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
        {name}
      </h3>
      <span className="text-2xl font-bold text-amber-600 ml-4 flex-shrink-0">
        ${price.toFixed(2)}
      </span>
    </div>
    <p className="text-gray-600 leading-relaxed mb-3">
      {description}
    </p>
    {tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export const BeverageItem = ({
  name,
  description,
  price,
  category,
  index = 0
}: {
  name: string;
  description: string;
  price: number;
  category: string;
  index?: number;
}) => (
  <div
    className="p-5 rounded-lg bg-gradient-to-br from-white to-amber-50 border border-amber-200 hover:shadow-lg transition-all duration-300"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-gray-900 mb-1">{name}</h4>
        <p className="text-sm text-amber-700 font-medium uppercase tracking-wide mb-2">
          {category}
        </p>
      </div>
      <span className="text-xl font-bold text-amber-600 ml-3">
        ${price.toFixed(2)}
      </span>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export const MenuSection = ({
  title,
  children,
  icon
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
}) => (
  <section className="mb-16 animate-slide-up">
    <div className="flex items-center gap-3 mb-6">
      {icon && <span className="text-4xl">{icon}</span>}
      <h2 className="text-4xl font-serif font-bold text-gray-900 relative">
        {title}
        <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {children}
    </div>
  </section>
);

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl">🍽️</span>
      </div>
    </div>
    <p className="mt-6 text-xl text-gray-600 animate-pulse">
      Crafting your exquisite menu...
    </p>
  </div>
);

export const GenerateButton = ({
  onClick,
  loading,
  disabled
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Generating...
        </>
      ) : (
        <>
          <span>✨</span>
          Generate New Menu
          <span>✨</span>
        </>
      )}
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
  </button>
);
