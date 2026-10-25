import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface PrivateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateEventModal: React.FC<PrivateEventModalProps> = ({ isOpen, onClose }) => {
  const [eventType, setEventType] = useState('anniversaire');
  const [guests, setGuests] = useState('20');
  const [targetDate, setTargetDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('150000 - 300000 FCFA');
  const [specialRequest, setSpecialRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappEventMessage = encodeURIComponent(
    `Bonjour Restaurant 5 Fourchettes Douala !\n\nJe souhaite obtenir un devis de privatisation :\n` +
    `• Événement : ${eventType === 'anniversaire' ? "Anniversaire d'enfant / adulte" : eventType === 'pro' ? 'Déjeuner / Dîner d\'entreprise' : 'Réception privée'}\n` +
    `• Convives estimés : ${guests} personnes\n` +
    `• Date souhaitée : ${targetDate || 'À définir'}\n` +
    `• Budget estimé : ${budget}\n` +
    `• Contact : ${name} (${phone})\n` +
    `${specialRequest ? `• Remarques : ${specialRequest}\n` : ''}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 text-stone-900">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold">
                Espace VIP & Réceptions
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                Demande de Devis Privatisation & Salle Privée
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Anniversaires d'enfants avec menu dédié, repas d'entreprises, réceptions familiales à Douala.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Type d'événement *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                >
                  <option value="anniversaire">Anniversaire Enfant / Famille</option>
                  <option value="pro">Repas d'Affaires / Entreprise</option>
                  <option value="buffet">Buffet à volonté de Groupe</option>
                  <option value="autre">Autre Célébration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre de convives *
                </label>
                <input
                  type="text"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Ex: 15 à 30 personnes"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Date approximative
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fourchette Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                >
                  <option value="100000 - 200000 FCFA">100 000 - 200 000 FCFA</option>
                  <option value="200000 - 400000 FCFA">200 000 - 400 000 FCFA</option>
                  <option value="Plus de 400000 FCFA">Plus de 400 000 FCFA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre Nom *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mme Eboumbou"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Téléphone (Appel/WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 6 99 XX XX XX"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Souhaits particuliers (gâteau, son, menu personnalisé...)
              </label>
              <textarea
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Précisez vos besoins..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Envoyer ma demande de devis
              </button>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappEventMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-stone-900">Demande prise en compte !</h3>
            <p className="text-xs text-stone-600">
              Notre maître d'hôtel vous recontactera sous 2 heures avec une proposition adaptée à votre budget.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
