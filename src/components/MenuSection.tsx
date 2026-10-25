import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Check, 
  Flame, 
  Leaf, 
  Award, 
  Maximize2, 
  SlidersHorizontal,
  Grid3X3,
  Image as ImageIcon
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/restaurantData';
import { DishDetailModal } from './DishDetailModal';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, quantity: number, note?: string) => void;
  cartItems: { [id: string]: number };
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  cartItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'price-asc' | 'price-desc'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Toute la carte' },
    { id: 'pizzas', label: 'Pizzas XXL au Four' },
    { id: 'indien', label: 'Spécialités Indiennes' },
    { id: 'pates', label: 'Pâtes & Spécialités' },
    { id: 'grillades', label: 'Grillades & Burgers' },
    { id: 'entrees', label: 'Entrées & Salades' },
    { id: 'boissons', label: 'Bar & Cocktails' },
  ];

  const filteredItems = useMemo(() => {
    let result = MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem, qty: number = 1) => {
    e.stopPropagation();
    onAddToCart(item, qty);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <section id="menu" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
              Carte Gastronomique & Pâtisseries
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              La Carte Interactive du 5 Fourchettes
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              Cliquez sur n'importe quel plat pour l'agrandir, découvrir ses ingrédients et personnaliser votre commande.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un plat, pizza..."
                className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs transition-colors"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
              >
                <option value="default">Tri par défaut</option>
                <option value="popular">Plats populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Vue grille compacte"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'large' ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Vue grande galerie visuelle"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-stone-200 shadow-xs overflow-x-auto mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <p className="text-stone-500 text-sm">Aucun plat trouvé pour votre recherche "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredItems.map((item) => {
              const qtyInCart = cartItems[item.id] || 0;
              const isJustAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDishForModal(item)}
                  className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  {/* Dish Visual Header with Authentic Image Crop */}
                  <div className={`relative ${viewMode === 'large' ? 'h-64 sm:h-72' : 'h-48 sm:h-52'} w-full bg-stone-950 overflow-hidden select-none`}>
                    
                    {item.imageSrc ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          style={{
                            transformOrigin: item.cropOrigin || 'center',
                            transform: `scale(${item.scale !== undefined ? item.scale : 1})`,
                          }}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('/public/')) {
                              target.src = `/public${item.imageSrc}`;
                            }
                          }}
                        />

                        {/* Scrim overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />

                        {/* Hover Magnifying Prompt */}
                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                          <span className="px-3 py-1.5 rounded-xl bg-white/90 text-stone-950 text-xs font-bold shadow-lg flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Agrandir le plat</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${item.imageFallback} flex items-center justify-center p-4 text-white text-center`}>
                        <h4 className="font-serif font-bold text-xl drop-shadow-md">{item.name}</h4>
                      </div>
                    )}

                    {/* Badges top-left */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {item.popular && (
                        <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>Populaire</span>
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-emerald-800 text-emerald-100 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          <span>Végé</span>
                        </span>
                      )}
                      {item.spicy && (
                        <span className="bg-red-800 text-red-100 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>Épicé</span>
                        </span>
                      )}
                    </div>

                    {/* Price bottom-right pill */}
                    <div className="absolute bottom-3 right-3 bg-stone-950/90 backdrop-blur-sm text-amber-300 border border-stone-700 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums shadow-md z-10">
                      {item.price.toLocaleString()} FCFA
                    </div>
                  </div>

                  {/* Dish Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      <p className="mt-2 text-stone-600 text-xs leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Clean metadata line without pills */}
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500">
                        <span>{item.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>Portion généreuse</span>
                        {item.halal && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-semibold">100% Halal</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div 
                      className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                        {item.price.toLocaleString()} <span className="text-xs font-normal text-stone-500">FCFA</span>
                      </div>

                      {qtyInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-stone-100 border border-amber-300 rounded-xl p-1">
                          <button
                            onClick={(e) => handleQuickAdd(e, item, -1)}
                            className="p-1 hover:bg-stone-200 rounded-lg text-stone-700 hover:text-stone-900 transition-colors"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-amber-700 tabular-nums">
                            {qtyInCart}
                          </span>
                          <button
                            onClick={(e) => handleQuickAdd(e, item, 1)}
                            className="p-1 hover:bg-stone-200 rounded-lg text-amber-700 hover:text-amber-800 transition-colors"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleQuickAdd(e, item, 1)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Ajouté</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Commander</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Interactive Lightbox / Dish Detail Modal */}
      <DishDetailModal
        item={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onAddToCart={onAddToCart}
      />

    </section>
  );
};
