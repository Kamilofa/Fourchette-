import React, { useState } from 'react';
import { 
  Utensils, 
  Sun, 
  Bike, 
  Car, 
  Users, 
  Wine, 
  CheckCircle2, 
  ArrowRight,
  Accessibility,
  Baby,
  Sparkles
} from 'lucide-react';
import { SERVICES, RestaurantService, RESTAURANT_INFO } from '../data/restaurantData';

interface ServicesSectionProps {
  onOpenReservation: () => void;
  onOpenOrder: () => void;
  onOpenPrivateEventModal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenReservation,
  onOpenOrder,
  onOpenPrivateEventModal,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Bike': return <Bike className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Wine': return <Wine className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleAction = (type: RestaurantService['actionType']) => {
    if (type === 'reserve') onOpenReservation();
    else if (type === 'order') onOpenOrder();
    else if (type === 'private') onOpenPrivateEventModal();
    else window.location.href = `tel:${RESTAURANT_INFO.phoneDial}`;
  };

  return (
    <section id="services" className="py-20 bg-white border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
            Expérience & Prestations
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Des services pensés pour votre confort et vos envies gourmandes
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Que ce soit pour un déjeuner d'affaires au calme, un brunch familial du dimanche ou une commande express livrée à Douala, le Restaurant 5 Fourchettes s'adapte à tous vos moments.
          </p>
        </div>

        {/* Fluid Interactive Service Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {SERVICES.map((service) => {
            const isActive = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 border ${
                  isActive 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{getIcon(service.iconName)}</span>
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed Feature Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 lg:p-10 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  {getIcon(selectedService.iconName)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {selectedService.badge}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {selectedService.title}
              </h3>

              <p className="text-stone-600 text-base leading-relaxed">
                {selectedService.fullDesc}
              </p>

              {/* Specific features for the selected service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-700">
                {selectedService.id === 'table' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Salle climatisée & insonorisée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Service en salle rapide & attentionné</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Chaises hautes pour enfants disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Accès fauteuil roulant garanti</span>
                    </div>
                  </>
                )}

                {selectedService.id === 'terrasse' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Terrasse ouverte aérée & ombragée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Parfait pour les dîners romantiques</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Ambiance lounge douce & feutrée</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Service complet de bar & cocktails</span>
                    </div>
                  </>
                )}

                {selectedService.id === 'livraison' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Livraison Akwa, Bonanjo, Bonapriso, Deido</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Emballage thermique spécial pizza & sauces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Paiement MoMo au 6 55 44 14 14 ou cash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Suivi de commande par WhatsApp</span>
                    </div>
                  </>
                )}

                {selectedService.id === 'drive' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Prêt en 20 minutes chrono</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Stationnement gratuit devant le guichet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Remise du sac directement au volant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Idéal pour les repas du midi pressés</span>
                    </div>
                  </>
                )}

                {selectedService.id === 'prive' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Salle à manger privée modulable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Accueil spécial fêtes d'enfants & gâteaux</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Formule à volonté & buffet sur commande</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Équipement sonore et vidéo disponible</span>
                    </div>
                  </>
                )}

                {selectedService.id === 'bar' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Limonade Japonaise signature & mocktails</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Carte de vins rouges, blancs et rosés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Grand choix de bières fraîches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Cafés italiens & Chai indien traditionnel</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  onClick={() => handleAction(selectedService.actionType)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <span>{selectedService.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side Visual / Feature spotlight */}
            <div className="lg:col-span-5 bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
                <span className="text-stone-500">Disponibilité à Douala</span>
                <span className="font-bold text-emerald-700">Ouvert 6j/7</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-amber-600 shadow-xs">
                    <Accessibility className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Accessibilité totale PMR</h4>
                    <p className="text-stone-500 text-[11px] mt-0.5">Entrée sans marches, places assises et toilettes adaptées aux personnes à mobilité réduite.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-amber-600 shadow-xs">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Familles & Enfants Bienvenus</h4>
                    <p className="text-stone-500 text-[11px] mt-0.5">Chaises hautes, menu enfant et cadre sécurisé pour fêter les anniversaires d'enfants.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-amber-600 shadow-xs">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Stationnement Garanti</h4>
                    <p className="text-stone-500 text-[11px] mt-0.5">Parking gratuit réservé à la clientèle et parking gratuit sécurisé dans la rue.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneDial}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Une question ? Appelez le {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
