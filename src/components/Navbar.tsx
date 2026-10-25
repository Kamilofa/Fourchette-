import React, { useState } from 'react';
import { Phone, ShoppingBag, Calendar, Menu as MenuIcon, X, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenPayment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenReservation,
  onOpenPayment,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark / Brand */}
          <a href="#" className="flex items-center gap-3 group whitespace-nowrap shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                5 Fourchettes
              </span>
              <span className="text-[11px] text-amber-700 tracking-widest uppercase font-semibold">
                Douala · Restau & Bar
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a href="#services" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              Nos Services
            </a>
            <a href="#menu" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              La Carte
            </a>
            <a href="#avis" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              Avis Clients (4.1★)
            </a>
            <a 
              href="#paiement" 
              onClick={(e) => { e.preventDefault(); onOpenPayment(); }} 
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 font-semibold text-amber-700"
            >
              Paiement Mobile (6 55 44 14 14)
            </a>
            <a href="#contact" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              Accès & Horaires
            </a>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Phone call */}
            <a
              href={`tel:${RESTAURANT_INFO.phoneDial}`}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Appeler le restaurant"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{RESTAURANT_INFO.phone}</span>
            </a>

            {/* Cart trigger button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-900 rounded-lg transition-all text-xs font-medium whitespace-nowrap shrink-0"
              aria-label="Voir le panier de commande"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline font-mono tabular-nums font-semibold">
                {cartTotal > 0 ? `${cartTotal.toLocaleString()} FCFA` : 'Panier'}
              </span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-amber-600 text-white rounded-full font-mono tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action CTA */}
            <button
              onClick={onOpenReservation}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réserver une table</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Ouvrir le menu mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-stone-100"
            >
              Nos Services (Terrasse, Salle, Drive, Livraison)
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-stone-100"
            >
              La Carte & Spécialités Indiennes / Pizzas
            </a>
            <a
              href="#avis"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-stone-100"
            >
              Avis Clients Google (4.1★ sur 868 avis)
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenPayment(); }}
              className="text-left px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 font-semibold"
            >
              Paiement Mobile Money (Orange / MTN 6 55 44 14 14)
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-stone-100"
            >
              Accès & Horaires à Douala
            </a>
          </nav>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <a
              href={`tel:${RESTAURANT_INFO.phoneDial}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-stone-100 text-stone-900 border border-stone-200 text-sm font-semibold"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Appeler le {RESTAURANT_INFO.phone}</span>
            </a>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold"
            >
              <span>Discuter sur WhatsApp (+237 6 55 44 14 14)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
