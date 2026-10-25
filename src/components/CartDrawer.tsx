import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Bike, Car, Utensils, AlertCircle } from 'lucide-react';
import { MenuItem } from '../data/restaurantData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [id: string]: number };
  menuItems: MenuItem[];
  onUpdateQuantity: (item: MenuItem, change: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (amount: number, details: { mode: string; address: string; phone: string; name: string }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  menuItems,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [orderMode, setOrderMode] = useState<'livraison' | 'drive' | 'table'>('livraison');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [specialNote, setSpecialNote] = useState('');

  if (!isOpen) return null;

  // Calculate items in cart
  const itemEntries = Object.entries(cartItems)
    .map(([id, quantity]) => {
      const item = menuItems.find((m) => m.id === id);
      return { item, quantity };
    })
    .filter((entry): entry is { item: MenuItem; quantity: number } => Boolean(entry.item && entry.quantity > 0));

  const subtotal = itemEntries.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = orderMode === 'livraison' ? (subtotal >= 25000 ? 0 : 2000) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemEntries.length === 0) return;
    onProceedToCheckout(total, {
      mode: orderMode,
      name: clientName,
      phone: clientPhone,
      address: clientAddress,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl text-stone-900">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">Votre Panier Gourmand</h3>
            <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              {itemEntries.length} article{itemEntries.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {itemEntries.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                title="Vider le panier"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vider</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {itemEntries.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Votre panier est vide</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Ajoutez de savoureuses pizzas au feu de bois, spécialités indiennes ou boissons rafraîchissantes depuis notre carte.
              </p>
              <button
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Parcourir la carte
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {itemEntries.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {item.price.toLocaleString()} FCFA
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item, -1)}
                        className="p-1 text-stone-500 hover:text-stone-900"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-amber-700 px-1">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item, 1)}
                        className="p-1 text-stone-500 hover:text-stone-900"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right font-mono text-xs font-bold text-stone-900 shrink-0">
                      {(item.price * quantity).toLocaleString()} FCFA
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Mode Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Mode de commande souhaité :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderMode('livraison')}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                      orderMode === 'livraison'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Livraison</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderMode('drive')}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                      orderMode === 'drive'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Drive / Emporter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderMode('table')}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                      orderMode === 'table'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Sur Place</span>
                  </button>
                </div>
              </div>

              {/* Customer Coordinates Form */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Coordonnées de Réception
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Votre Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Cédric Kamga"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Votre Téléphone (WhatsApp / Appel) *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: 6 99 XX XX XX"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                {orderMode === 'livraison' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Adresse de livraison à Douala *</label>
                    <input
                      type="text"
                      required
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Quartier (Akwa, Bonanjo, Bali, etc.), repère précis"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Instructions ou remarques</label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="Ex: Sans piment, sonner à l'entrée..."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>
              </div>

              {/* Strict Notice regarding payment validation */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Validation obligatoire :</strong> La commande ne sera transmise en cuisine qu'après vérification du paiement Mobile Money au <strong>6 55 44 14 14</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Totals & Mobile Money Checkout CTA */}
        {itemEntries.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total plats</span>
                <span className="font-mono text-stone-900 font-semibold">{subtotal.toLocaleString()} FCFA</span>
              </div>
              {orderMode === 'livraison' && (
                <div className="flex justify-between text-stone-600">
                  <span>Frais de livraison</span>
                  <span className="font-mono text-stone-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">Gratuit (dès 25k)</strong> : `${deliveryFee.toLocaleString()} FCFA`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-200">
                <span className="text-stone-900">Total à régler</span>
                <span className="text-amber-700 font-mono text-base">{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={!clientName.trim() || !clientPhone.trim()}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Passer au paiement Mobile Money (6 55 44 14 14)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-stone-500">
              Paiement sécurisé MTN MoMo & Orange Money. Aucune commande validée sans transfert.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
