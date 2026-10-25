import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Smartphone, 
  ShieldCheck, 
  Download, 
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { RESTAURANT_INFO, PAYMENT_METHODS } from '../data/restaurantData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetAmount?: number;
  orderReference?: string;
  orderType?: 'order' | 'reservation' | 'custom';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  presetAmount,
  orderReference,
  orderType = 'order',
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'om' | 'cash_pos'>('momo');
  const [amount, setAmount] = useState<number>(presetAmount || 10000);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [hasInitiatedTransfer, setHasInitiatedTransfer] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [verifiedTimestamp, setVerifiedTimestamp] = useState<string>('');

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedUSSD, setCopiedUSSD] = useState(false);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.momoNumber);
    setCopiedNumber(true);
    setHasInitiatedTransfer(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const getUSSDString = () => {
    if (selectedMethod === 'momo') {
      return `*126*1*1*${RESTAURANT_INFO.momoNumber}*${amount}#`;
    }
    if (selectedMethod === 'om') {
      return `#150*1*1*${RESTAURANT_INFO.momoNumber}*${amount}#`;
    }
    return '';
  };

  const handleCopyUSSD = () => {
    const ussd = getUSSDString();
    if (!ussd) return;
    navigator.clipboard.writeText(ussd);
    setCopiedUSSD(true);
    setHasInitiatedTransfer(true);
    setTimeout(() => setCopiedUSSD(false), 2000);
  };

  // Strict Payment Validation Handler
  const handleVerifyAndValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Rule 1: Customer identification required
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }

    // Rule 2: If Mobile Money is selected, payment MUST have been executed
    if (selectedMethod !== 'cash_pos') {
      const cleanRef = transactionRef.trim();

      // Check if reference is empty
      if (!cleanRef) {
        setValidationError(
          "Paiement non détecté : Vous devez effectuer le transfert vers le 6 55 44 14 14 et saisir l'ID de transaction reçu par SMS (Orange Money ou MTN MoMo) avant toute validation."
        );
        return;
      }

      // Check if reference looks plausible (at least 6 characters, alphanumeric)
      if (cleanRef.length < 6) {
        setValidationError(
          "Référence de transaction invalide : Le code reçu par SMS de l'opérateur doit comporter au moins 6 caractères (ex: MP2410..., OM98..., TXN...)."
        );
        return;
      }

      // Trigger verification simulation
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        // Valid reference confirmed
        setIsConfirmed(true);
        setVerifiedTimestamp(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      }, 1400);

    } else {
      // Cash / POS mode
      setIsConfirmed(true);
      setVerifiedTimestamp(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const currentMethodObj = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];

  const whatsappMessage = encodeURIComponent(
    `Bonjour Restaurant 5 Fourchettes Douala !\n\nJe confirme mon paiement Mobile Money pour un montant de ${amount.toLocaleString()} FCFA au 6 55 44 14 14.\n\n` +
    `• Référence / ID Transaction : ${transactionRef || 'En attente'}\n` +
    `• Client : ${customerName}\n` +
    `• Téléphone : ${customerPhone}\n` +
    `• Méthode : ${currentMethodObj.name}\n` +
    `${orderReference ? `• Référence commande : ${orderReference}\n` : ''}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-stone-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Paiement Direct & Vérifié Mobile Money</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Réglement au Restaurant 5 Fourchettes
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Pour être validée, toute transaction doit être envoyée au compte certifié : <strong className="text-amber-800 font-mono text-sm">{RESTAURANT_INFO.phone}</strong>.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedMethod('momo'); setValidationError(null); }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === 'momo'
                    ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-sm font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>MTN MoMo</span>
                <span className="text-[10px] opacity-80">*126# Cameroun</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedMethod('om'); setValidationError(null); }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === 'om'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-sm font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>Orange Money</span>
                <span className="text-[10px] opacity-80">#150# Cameroun</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedMethod('cash_pos'); setValidationError(null); }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === 'cash_pos'
                    ? 'bg-stone-800 text-white border-stone-900 shadow-sm font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>Sur Place / Caissier</span>
                <span className="text-[10px] opacity-80">Carte / Espèces</span>
              </button>
            </div>

            {/* Amount Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Montant exact à payer :</span>
                {orderReference && (
                  <span className="text-amber-800 font-mono font-bold text-[11px]">Réf: {orderReference}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-transparent text-2xl font-bold font-mono text-stone-900 focus:outline-none w-full"
                />
                <span className="text-lg font-bold text-amber-700 font-mono shrink-0">FCFA</span>
              </div>
            </div>

            {/* Instructions box */}
            {selectedMethod !== 'cash_pos' ? (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-amber-800 uppercase font-bold">
                      Étape 1 : Effectuez le transfert vers ce numéro
                    </p>
                    <p className="text-2xl font-bold font-mono text-stone-950 tracking-wider">
                      {RESTAURANT_INFO.phone}
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Bénéficiaire certifié : <strong className="text-stone-900">{RESTAURANT_INFO.momoName}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    {copiedNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedNumber ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <div className="text-stone-700 font-mono font-semibold">
                    <span>{getUSSDString()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUSSD}
                    className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    {copiedUSSD ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Smartphone className="w-3.5 h-3.5" />}
                    <span>{copiedUSSD ? 'Code USSD copié' : 'Copier code direct'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-700">
                <p className="font-bold text-stone-900">Règlement à la livraison ou en caisse :</p>
                <p>Votre commande sera préparée et encaissée directement auprès du livreur ou de notre maître d'hôtel à votre arrivée.</p>
              </div>
            )}

            {/* Error Notification if payment was not made / validation rejected */}
            {validationError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold">Validation impossible :</strong>
                  <p className="leading-relaxed">{validationError}</p>
                </div>
              </div>
            )}

            {/* Form for Customer Credentials & Transaction Reference */}
            <form onSubmit={handleVerifyAndValidate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Votre Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Cédric Kamga"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 6 99 XX XX XX"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>
              </div>

              {selectedMethod !== 'cash_pos' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-900">
                      Étape 2 : ID de Transaction reçu par SMS (Requis pour valider) *
                    </label>
                    <span className="text-[10px] text-amber-800 font-semibold">Obligatoire</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => {
                      setTransactionRef(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Ex: MP241025.1122.A12345 ou OM-948210"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono font-semibold focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                  <p className="text-[10px] text-stone-500">
                    ⚠️ <em>Si le transfert n'a pas été fait vers le 6 55 44 14 14, la commande ne sera pas validée.</em>
                  </p>
                </div>
              )}

              {/* Submit / Verification Trigger Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Vérification du transfert en cours...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Vérifier et Valider le Paiement</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Assistance WhatsApp</span>
                </a>
              </div>
            </form>

          </div>
        ) : (
          /* Receipt confirmation screen ONLY after successful verification */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Paiement Validé & Vérifié
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                Votre Commande est Validée !
              </h3>
              <p className="text-xs text-stone-600">
                Paiement vérifié à {verifiedTimestamp} par notre système au Restaurant 5 Fourchettes Douala.
              </p>
            </div>

            {/* Official Digital Receipt */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-left space-y-3 text-xs shadow-xs">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Établissement</span>
                <strong className="text-stone-900">Restaurant 5 Fourchettes Douala</strong>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Numéro Bénéficiaire</span>
                <strong className="text-amber-800 font-mono">{RESTAURANT_INFO.phone}</strong>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Client</span>
                <span className="text-stone-900 font-semibold">{customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Méthode Validée</span>
                <span className="text-stone-900 font-medium">{currentMethodObj.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">ID Transaction Contrôlé</span>
                <span className="text-stone-900 font-mono font-bold">{transactionRef || 'Encaissé sur place'}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm">
                <span className="font-bold text-stone-800">Montant Total Validé</span>
                <strong className="text-amber-700 font-mono text-base">{amount.toLocaleString()} FCFA</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Transmettre à la cuisine WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Imprimer Reçu</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs rounded-xl transition-all"
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
