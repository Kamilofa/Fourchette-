import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check, Flame, Leaf, Award } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/restaurantData';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  cartItems: { [id: string]: number };
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  cartItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAdd = (item: MenuItem, qty: number = 1) => {
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
              Carte Gastronomique & Pâtisseries
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              La Carte du Restaurant 5 Fourchettes
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              Plats généreux préparés à la commande par nos chefs. Choisissez vos plats préférés pour déguster sur place, à emporter ou en livraison à Douala.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un plat..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs transition-colors"
            />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const qtyInCart = cartItems[item.id] || 0;
              const isJustAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-300 overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Dish Visual Header */}
                  <div className={`relative h-44 w-full bg-gradient-to-br ${item.imageFallback} flex items-center justify-center p-4 overflow-hidden`}>
                    
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Dish title display */}
                    <div className="text-center relative z-10 px-4">
                      <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold mb-1 block">
                        {item.categoryLabel}
                      </span>
                      <h4 className="font-serif font-bold text-xl text-white drop-shadow-md">
                        {item.name}
                      </h4>
                    </div>

                    {/* Badges */}
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
                    <div className="absolute bottom-3 right-3 bg-stone-950/85 backdrop-blur-sm text-amber-300 border border-stone-700 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums shadow-md">
                      {item.price.toLocaleString()} FCFA
                    </div>
                  </div>

                  {/* Dish Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-stone-600 text-xs leading-relaxed line-clamp-3">
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
                            <span className="text-emerald-700 font-medium">100% Halal</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                        {item.price.toLocaleString()} <span className="text-xs font-normal text-stone-500">FCFA</span>
                      </div>

                      {qtyInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-stone-100 border border-amber-300 rounded-xl p-1">
                          <button
                            onClick={() => onAddToCart(item, -1)}
                            className="p-1 hover:bg-stone-200 rounded-lg text-stone-700 hover:text-stone-900 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-amber-700 tabular-nums">
                            {qtyInCart}
                          </span>
                          <button
                            onClick={() => handleAdd(item, 1)}
                            className="p-1 hover:bg-stone-200 rounded-lg text-amber-700 hover:text-amber-800 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(item, 1)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 hover:bg-amber-600 text-stone-800 hover:text-white border border-stone-200 hover:border-amber-600'
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
                              <span>Ajouter</span>
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
    </section>
  );
};
