import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { dbService } from '../services/dbService';

interface ReservationSectionProps {
  onOpenDepositPayment: (amount: number, reservationRef: string) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  onOpenDepositPayment,
}) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<'salle' | 'terrasse' | 'vip'>('terrasse');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [needsHighChair, setNeedsHighChair] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reservationRef, setReservationRef] = useState('');

  const timeSlots = [
    { label: 'Déjeuner', times: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'] },
    { label: 'Dîner & Soirée', times: ['17:30', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'] }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const ref = `RES-5F-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationRef(ref);
    setSubmitted(true);

    // Persist to Supabase & local DB
    dbService.saveReservation({
      id: ref,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      reservation_date: date,
      reservation_time: time,
      guest_count: guests,
      area: area,
      needs_high_chair: needsHighChair,
      is_birthday: isBirthday,
      special_notes: specialNotes.trim() || undefined,
      deposit_amount: 0,
      status: 'confirmed',
      created_at: new Date().toISOString()
    }).catch(err => console.warn('Reservation save error:', err));
  };

  const whatsappReservationMessage = encodeURIComponent(
    `Bonjour Restaurant 5 Fourchettes Douala !\n\nJe souhaite confirmer ma réservation de table :\n\n` +
    `• Référence : ${reservationRef || 'Demande directe'}\n` +
    `• Nom : ${name}\n` +
    `• Téléphone : ${phone}\n` +
    `• Date : ${date}\n` +
    `• Heure : ${time}\n` +
    `• Convives : ${guests} personne(s)\n` +
    `• Espace : ${area === 'salle' ? 'Salle climatisée' : area === 'terrasse' ? 'Terrasse extérieure' : 'Salon VIP Privé'}\n` +
    `${needsHighChair ? '• Chaise haute requise pour enfant\n' : ''}` +
    `${isBirthday ? '• Célébration anniversaire\n' : ''}` +
    `${specialNotes ? `• Notes : ${specialNotes}\n` : ''}`
  );

  return (
    <section id="reservation" className="py-20 bg-white border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context, perks & trust markers */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Réservation instantanée</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Réservez votre table au Restaurant 5 Fourchettes
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed">
              Pour un dîner romantique en terrasse, un déjeuner d'affaires au frais ou un anniversaire en famille, réservez en 1 minute.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Réservation recommandée pour le brunch</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Le dimanche dès 11h, notre brunch gourmand attire beaucoup de monde. Réservez à l'avance pour être certain d'avoir une table.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Chaises hautes & menu enfant</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Vos enfants sont accueillis comme des rois avec du mobilier adapté et des menus conçus pour leurs papilles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Garantie & Paiement Mobile Money</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Option d'acompte par Orange Money ou MTN MoMo au <strong className="text-stone-900 font-mono">{RESTAURANT_INFO.phone}</strong> pour les grands groupes ou événements VIP.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-600">
              <span>Besoin d'un renseignement immédiat ? </span>
              <a href={`tel:${RESTAURANT_INFO.phoneDial}`} className="text-amber-800 font-bold hover:underline">
                Appelez le {RESTAURANT_INFO.phone}
              </a>
            </div>
          </div>

          {/* Right Column: High Conversion Reservation Form */}
          <div className="lg:col-span-7">
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">
                      Formulaire de Réservation Prioritaire
                    </h3>
                    <p className="text-xs text-stone-500">
                      Remplissez vos préférences pour bloquer votre table immédiatement.
                    </p>
                  </div>

                  {/* Date, Time & Guests Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Heure *
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      >
                        {timeSlots.map(group => (
                          <optgroup key={group.label} label={group.label} className="bg-white text-stone-800">
                            {group.times.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Convives *
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25].map(n => (
                          <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Seating Area Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-stone-700">
                      Choix de l'espace :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setArea('terrasse')}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          area === 'terrasse'
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Terrasse Ouverte
                      </button>

                      <button
                        type="button"
                        onClick={() => setArea('salle')}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          area === 'salle'
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Salle Climatisée
                      </button>

                      <button
                        type="button"
                        onClick={() => setArea('vip')}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          area === 'vip'
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Salon VIP Privé
                      </button>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Votre Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Cédric Kamga"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Téléphone (Appel / WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 6 99 XX XX XX"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Special checkboxes */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsHighChair}
                        onChange={(e) => setNeedsHighChair(e.target.checked)}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Chaise haute pour enfant requise</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBirthday}
                        onChange={(e) => setIsBirthday(e.target.checked)}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Célébration d'anniversaire</span>
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all"
                    >
                      Confirmer ma réservation de table
                    </button>
                    <p className="text-[11px] text-center text-stone-500 mt-2">
                      Confirmation instantanée. Vous recevrez les détails sur votre téléphone.
                    </p>
                  </div>

                </form>
              ) : (
                /* Success screen */
                <div className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-stone-900">
                      Votre Table est Pré-Réservée !
                    </h3>
                    <p className="text-xs text-stone-600">
                      Réf de réservation : <strong className="text-amber-800 font-mono font-bold">{reservationRef}</strong>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 shadow-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Date & Heure :</span>
                      <strong className="text-stone-900">{date} à {time}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Convives :</span>
                      <strong className="text-stone-900">{guests} personne{guests > 1 ? 's' : ''}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Espace :</span>
                      <strong className="text-amber-800">
                        {area === 'terrasse' ? 'Terrasse Panoramique' : area === 'salle' ? 'Salle Climatisée' : 'Salon VIP'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Client :</span>
                      <span className="text-stone-900 font-semibold">{name} ({phone})</span>
                    </div>
                  </div>

                  {/* Actions: Guarantee by MoMo or Confirm WhatsApp */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenDepositPayment(5000, reservationRef)}
                      className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Garantir ma table avec un acompte MoMo (5 000 FCFA)</span>
                    </button>

                    <a
                      href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappReservationMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Transmettre sur WhatsApp (+237 6 55 44 14 14)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Faire une autre réservation
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
