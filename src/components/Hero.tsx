import React, { useMemo } from 'react';
import { Star, Clock, MapPin, ArrowRight, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeroProps {
  onOpenReservation: () => void;
  onScrollToMenu: () => void;
  onOpenPayment: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenReservation,
  onScrollToMenu,
  onOpenPayment,
}) => {
  // Real-time status based on local Douala hours (11:30 - 15:00 and 17:30 - 23:30)
  const openStatus = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentDecimal = hours + minutes / 60;

    const isLunch = currentDecimal >= 11.5 && currentDecimal < 15.0;
    const isDinner = currentDecimal >= 17.5 && currentDecimal < 23.5;

    if (isLunch) {
      return {
        isOpen: true,
        text: 'Ouvert actuellement · Service Déjeuner (fermeture à 15h)',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    }
    if (isDinner) {
      return {
        isOpen: true,
        text: 'Ouvert actuellement · Service Dîner & Bar (fermeture à 23h30)',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    }
    if (currentDecimal < 11.5) {
      return {
        isOpen: false,
        text: 'Ouvre à 11h30 pour le déjeuner · Réservations ouvertes',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      };
    }
    return {
      isOpen: false,
      text: 'Pause d\'après-midi · Rouvre à 17h30 pour le dîner',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200 bg-gradient-to-b from-amber-50/40 via-white to-stone-50">
      {/* Background ambient warm illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-200/30 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & High Conversion CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live status & Verified Location Badge */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${openStatus.badgeClass}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{openStatus.text}</span>
              </span>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 shadow-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Douala, Cameroun</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <p className="text-amber-700 font-bold tracking-wider text-xs sm:text-sm uppercase">
                Restaurant Gastronomique · Pizzeria & Bar à Douala
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Saveurs indiennes authentiques & pizzas XXL au feu de bois
              </h1>
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Bienvenue au <span className="text-amber-800 font-bold">Restaurant 5 Fourchettes</span>. Plats particulièrement copieux, gambas braisées, terrasse panoramique, service attentionné et livraison express dans tout Douala.
              </p>
            </div>

            {/* Adjacent Proof Strip (Claim-to-Proof) */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
              <div>
                <div className="flex items-center gap-1 text-amber-600 font-bold text-base sm:text-lg">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.1 / 5</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">868 avis Google vérifiés</p>
              </div>

              <div>
                <div className="font-bold text-stone-900 text-base sm:text-lg font-mono">
                  8k - 16k
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">FCFA par personne</p>
              </div>

              <div>
                <div className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-1">
                  <span>100% Halal</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">& options végétariennes</p>
              </div>

              <div>
                <div className="font-bold text-emerald-700 text-base sm:text-lg">
                  Orange / MTN
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">MoMo au 6 55 44 14 14</p>
              </div>
            </div>

            {/* High-Converting CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToMenu}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Commander nos plats</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenReservation}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 hover:border-amber-500 font-semibold text-sm rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                <span>Réserver une table</span>
              </button>

              <button
                onClick={onOpenPayment}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                title="Payer par MTN ou Orange Money"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Paiement Mobile Money (6 55 44 14 14)</span>
              </button>
            </div>

            {/* Quick Customer Care Line */}
            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
              <a
                href={`tel:${RESTAURANT_INFO.phoneDial}`}
                className="inline-flex items-center gap-1.5 text-stone-700 hover:text-amber-700 font-medium transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Ligne directe & commandes : <strong className="text-stone-900 font-mono font-bold">{RESTAURANT_INFO.phone}</strong></span>
              </a>
              <span>·</span>
              <span className="text-stone-500">Terrasse & Salle climatisée</span>
            </div>

          </div>

          {/* Right Column: Visual Showcase using authentic images from user captures */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xl">
              
              {/* Main Visual Image from user screenshots */}
              <div className="relative aspect-[4/3] overflow-hidden group">
                <img
                  src="/public/assets/aistudio/Screenshot_20261025_112200_Maps_3920c27f.jpg"
                  alt="Restaurant 5 Fourchettes Douala - Gambas géantes et pizza XXL"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Visual gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />

                {/* Floating highlight badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Plats copieux & Pizzas XXL</span>
                </div>

                {/* Floating Price sticker */}
                <div className="absolute top-3 right-3 bg-amber-600 text-white px-2.5 py-1 rounded-md text-xs font-bold font-mono shadow-sm">
                  8k - 16k FCFA
                </div>

                {/* Bottom photo caption */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    Spécialités de la maison
                  </p>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    Gambas braisées au feu de bois & Pizza Tikka
                  </h3>
                  <p className="text-xs text-stone-200">
                    "Très bon accueil, serveuse professionnelle, pizza XXL au top !"
                  </p>
                </div>
              </div>

              {/* Mini Gallery Strip with other captured authentic dishes */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 grid grid-cols-3 gap-2">
                <div className="rounded-lg overflow-hidden border border-stone-200 bg-white relative group cursor-pointer" onClick={onScrollToMenu}>
                  <img
                    src="/public/assets/aistudio/Screenshot_20261025_112253_Maps_44cd291b.jpg"
                    alt="Petit déj indien chai et salade verte 5 fourchettes"
                    className="w-full h-16 object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 text-[10px] text-white font-semibold bg-stone-900/80 px-1 rounded truncate max-w-[90%]">
                    Spécialités Indiennes
                  </span>
                </div>

                <div className="rounded-lg overflow-hidden border border-stone-200 bg-white relative group cursor-pointer" onClick={onScrollToMenu}>
                  <img
                    src="/public/assets/aistudio/Screenshot_20261025_112305_Maps_9238cdc6.jpg"
                    alt="Pizzas artisanales et pâtes fraîches"
                    className="w-full h-16 object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 text-[10px] text-white font-semibold bg-stone-900/80 px-1 rounded truncate max-w-[90%]">
                    Pâtes & Pizzas
                  </span>
                </div>

                <div className="rounded-lg overflow-hidden border border-stone-200 bg-white relative group cursor-pointer" onClick={onScrollToMenu}>
                  <img
                    src="/public/assets/aistudio/Screenshot_20261025_112259_Maps_1ee0685f.jpg"
                    alt="Limonade japonaise et cocktails bar 5 fourchettes"
                    className="w-full h-16 object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 text-[10px] text-white font-semibold bg-stone-900/80 px-1 rounded truncate max-w-[90%]">
                    Bar & Cocktails
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
