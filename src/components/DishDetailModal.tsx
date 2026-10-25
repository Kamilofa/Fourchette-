import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Leaf, 
  Flame, 
  Award,
  Layers,
  Utensils
} from 'lucide-react';
import { MenuItem } from '../data/restaurantData';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customNote?: string) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFullOriginalCapture, setShowFullOriginalCapture] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [optionName: string]: { label: string; extraPrice: number } }>({});
  const [customNote, setCustomNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  // Calculate option extra costs
  const optionsTotal = Object.values(selectedOptions).reduce((acc, curr) => acc + curr.extraPrice, 0);
  const unitPrice = item.price + optionsTotal;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (optionName: string, choice: { label: string; extraPrice: number }) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choice
    }));
  };

  const handleAdd = () => {
    const selectedOptionsStr = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v.label}`)
      .join(', ');
    const note = [selectedOptionsStr, customNote].filter(Boolean).join(' | ');

    onAddToCart(item, quantity, note);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-6 text-stone-900 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-md transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Interactive Image Showcase Header */}
          <div className="relative h-64 sm:h-80 w-full bg-stone-950 overflow-hidden select-none">
            {item.imageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: showFullOriginalCapture ? 'center' : (item.cropOrigin || 'center'),
                    transform: showFullOriginalCapture 
                      ? `scale(${zoomLevel})` 
                      : `scale(${(item.scale !== undefined ? item.scale : 1) * zoomLevel})`,
                  }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.retried) {
                      target.dataset.retried = '1';
                      if (item.imageSrc?.startsWith('/images/')) {
                        target.src = item.imageSrc.replace('/images/', '/src/assets/images/');
                      } else if (item.imageSrc?.startsWith('/src/assets/images/')) {
                        target.src = item.imageSrc.replace('/src/assets/images/', '/images/');
                      }
                    }
                  }}
                />

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Interactive Zoom Controls & Toggle */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2 py-1.5 rounded-xl border border-stone-700 text-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                    className="p-1 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-1 font-bold text-amber-400">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                    className="p-1 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white ml-1 border-l border-stone-700 pl-2"
                    title="Réinitialiser zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Toggle to view authentic full Google Capture */}
                <button
                  type="button"
                  onClick={() => setShowFullOriginalCapture(!showFullOriginalCapture)}
                  className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-stone-800 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showFullOriginalCapture ? 'Vue cadrée du plat' : 'Voir capture menu Google Maps'}</span>
                </button>

                {/* Dish Name Overlay on image */}
                <div className="absolute bottom-4 right-4 z-10 text-right pointer-events-none">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md block">
                    {unitPrice.toLocaleString()} FCFA
                  </span>
                  <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>
                </div>
              </div>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${item.imageFallback} flex items-center justify-center p-6 text-white text-center`}>
                <h3 className="font-serif font-bold text-2xl drop-shadow-md">{item.name}</h3>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  {item.categoryLabel}
                </span>
                {item.popular && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>Plat Populaire</span>
                  </span>
                )}
                {item.vegetarian && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>Végétarien</span>
                  </span>
                )}
                {item.spicy && (
                  <span className="bg-red-100 text-red-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>Épicé</span>
                  </span>
                )}
                {item.halal && (
                  <span className="bg-stone-100 text-stone-800 text-[10px] font-medium px-2 py-0.5 rounded">
                    100% Halal
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {item.name}
              </h2>

              <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ingredients list */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-700" />
                  <span>Composition & Ingrédients Sélectionnés</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options (if any) */}
            {item.options && item.options.length > 0 && (
              <div className="space-y-4 pt-1">
                {item.options.map((optGroup, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {optGroup.name} :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {optGroup.choices.map((choice, cIdx) => {
                        const isSelected = selectedOptions[optGroup.name]?.label === choice.label;
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleSelectOption(optGroup.name, choice)}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between text-left transition-all ${
                              isSelected
                                ? 'bg-amber-50 text-amber-900 border-amber-500 shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <span>{choice.label}</span>
                            {choice.extraPrice > 0 ? (
                              <span className="font-mono text-amber-700 font-bold ml-2">
                                +{choice.extraPrice.toLocaleString()} F
                              </span>
                            ) : (
                              <span className="text-[11px] text-stone-400">Inclus</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Remarque pour la cuisine (optionnel) :
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ex: Bien cuit, sans oignon, piment à part..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
              />
            </div>

          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quantity stepper */}
          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-1.5 shadow-xs">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900"
              aria-label="Diminuer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-stone-900 px-3 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-amber-700 hover:text-amber-800"
              aria-label="Augmenter"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Ajouté au panier !</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Ajouter à ma commande · {totalPrice.toLocaleString()} FCFA</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
