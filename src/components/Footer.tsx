import React from 'react';
import { UtensilsCrossed, Phone, MapPin, MessageCircle, ShieldCheck, Database } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FooterProps {
  onOpenReservation: () => void;
  onOpenPayment: () => void;
  onScrollToMenu: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenReservation,
  onOpenPayment,
  onScrollToMenu,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-white text-stone-700 border-t border-stone-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          
          {/* Brand & mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shadow-xs">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-stone-900 block">Restaurant 5 Fourchettes</span>
                <span className="text-[11px] text-amber-800 uppercase tracking-widest font-bold">Douala · Cameroun</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              L'adresse gastronomique de référence à Douala : spécialités indiennes renommées, pizzas artisanales XXL au four, grillades savoureuses et terrasse conviviale.
            </p>

            <div className="pt-2 text-xs text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Paiement certifié Mobile Money au <strong className="text-stone-900 font-mono">{RESTAURANT_INFO.phone}</strong></span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Navigation</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <a href="#services" className="hover:text-amber-800 transition-colors">Nos Services</a>
              </li>
              <li>
                <button onClick={onScrollToMenu} className="hover:text-amber-800 transition-colors text-left">
                  La Carte & Menus
                </button>
              </li>
              <li>
                <a href="#avis" className="hover:text-amber-800 transition-colors">Avis Clients (4.1★)</a>
              </li>
              <li>
                <button onClick={onOpenReservation} className="hover:text-amber-800 transition-colors text-left">
                  Réserver une Table
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-800 transition-colors">Accès & Horaires</a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold transition-colors text-left"
                  >
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>Base Clients Supabase</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Specialties */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Spécialités Vedettes</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>Pizza Tikka XXL au four</li>
              <li>Gambas Géantes Braisées au feu de bois</li>
              <li>Petit Déjeuner Indien & Thé Chai traditionnel</li>
              <li>Tagliatelles Carbonara & Alfredo Poulet</li>
              <li>Limonade Japonaise signature sans alcool</li>
            </ul>
          </div>

          {/* Quick Contact & WhatsApp */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Contact Direct</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Douala, Cameroun</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phoneDial}`} className="hover:text-amber-800 font-mono font-bold">
                  {RESTAURANT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 font-medium"
                >
                  WhatsApp : +237 6 55 44 14 14
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPayment}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors text-center shadow-xs"
              >
                Paiement Mobile Money (6 55 44 14 14)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Restaurant 5 Fourchettes Douala. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Douala, Cameroun</span>
            <span aria-hidden="true">·</span>
            <span>restau5fourchettes.com</span>
            <span aria-hidden="true">·</span>
            <span>MTN MoMo & Orange Money</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
