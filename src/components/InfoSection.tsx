import React from 'react';
import { MapPin, Clock, Phone, Car, Accessibility, Baby, Navigation, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const InfoSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
            Localisation & Informations Utiles
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Venir au Restaurant 5 Fourchettes à Douala
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Situé au cœur de la ville avec un accès rapide depuis tous les quartiers de Douala.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Schedule & Contact Cards */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Horaires d'ouverture */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-amber-700">
                  <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200">
                    <Clock className="w-5 h-5 text-amber-800" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">Horaires d'Ouverture</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Service Déjeuner</span>
                    <strong className="text-stone-900 font-mono">{RESTAURANT_INFO.openingHours.lunch}</strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-400">Pause Après-midi</span>
                    <span className="text-stone-400 font-mono">15:00 - 17:30</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Service Dîner & Bar</span>
                    <strong className="text-stone-900 font-mono">{RESTAURANT_INFO.openingHours.dinner}</strong>
                  </div>
                  <div className="flex justify-between pt-1 text-amber-800 font-semibold">
                    <span>Dimanche Brunch</span>
                    <span>Dès 11:00 non-stop</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500">
                  * Réservation vivement recommandée pour le brunch du weekend.
                </p>
              </div>

              {/* Card 2: Contact & Mobile Money */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-amber-700">
                  <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200">
                    <Phone className="w-5 h-5 text-amber-800" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">Contact & Commandes</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] text-stone-500">Numéro Téléphonique & MoMo</span>
                    <a
                      href={`tel:${RESTAURANT_INFO.phoneDial}`}
                      className="block text-xl font-bold font-mono text-amber-700 hover:text-amber-800 mt-0.5"
                    >
                      {RESTAURANT_INFO.phone}
                    </a>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500">Indicatif international</span>
                    <p className="text-stone-700 font-mono font-medium">{RESTAURANT_INFO.phoneInternational}</p>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500">Site Officiel</span>
                    <p className="text-stone-700 font-mono font-medium">{RESTAURANT_INFO.website}</p>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <a
                    href={`tel:${RESTAURANT_INFO.phoneDial}`}
                    className="flex-1 py-2 px-3 text-center bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Appeler
                  </a>
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

            </div>

            {/* Practical Amenities Strip */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                  <Car className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Parking Gratuit</h4>
                  <p className="text-stone-500 text-[11px]">Parking privé + stationnement sécurisé dans la rue.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                  <Accessibility className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Accessible PMR</h4>
                  <p className="text-stone-500 text-[11px]">Rampe d'accès, places assises et toilettes adaptées.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                  <Baby className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Accueil Enfants</h4>
                  <p className="text-stone-500 text-[11px]">Chaises hautes disponibles & menu enfant savoureux.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map Preview Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden flex-1 flex flex-col shadow-sm">
              
              {/* Map Preview Graphic */}
              <div className="relative h-64 sm:h-72 bg-stone-100 flex flex-col items-center justify-center p-6 text-center overflow-hidden border-b border-stone-200">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
                
                <div className="relative z-10 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 mx-auto animate-bounce">
                    <MapPin className="w-8 h-8 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      Restaurant 5 Fourchettes
                    </h3>
                    <p className="text-xs text-amber-800 font-bold mt-0.5">
                      Douala, Cameroun
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                      Note Google : 4.1 ★ (868 avis) · Prix 8-16k FCFA
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-stone-600 border border-stone-200 shadow-xs font-medium">
                  Temps réel : Assez animé · Pas d'attente
                </div>
              </div>

              {/* Itinerary launcher buttons */}
              <div className="p-6 space-y-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Itinéraire & GPS
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Facilement accessible en voiture, taxi ou moto à Douala. Présentez-vous directement pour dîner ou commandez à emporter sans descendre de votre véhicule grâce au Drive.
                  </p>
                </div>

                <div className="space-y-2">
                  <a
                    href="https://maps.google.com/?q=Restaurant+5+Fourchettes+Douala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Lancer l'itinéraire Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>

                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=Bonjour%20Restaurant%205%20Fourchettes%2C%20pouvez-vous%20m%27envoyer%20votre%20localisation%20GPS%20exacte%20%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Demander la localisation par WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
