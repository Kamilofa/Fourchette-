import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Search,
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  MessageCircle,
  UtensilsCrossed,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { dbService, OrderRecord } from '../services/dbService';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface OrderStatusDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderRef?: string;
}

export const OrderStatusDashboardModal: React.FC<OrderStatusDashboardModalProps> = ({
  isOpen,
  onClose,
  initialOrderRef,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [matchedOrders, setMatchedOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [savedLastRef, setSavedLastRef] = useState<string>('');

  // Read last order ref from localStorage
  useEffect(() => {
    try {
      const ref = localStorage.getItem('5f_last_order_ref') || '';
      setSavedLastRef(ref);
      if (!initialOrderRef && ref && isOpen) {
        setSearchQuery(ref);
        loadOrder(ref);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  // When initialOrderRef is provided
  useEffect(() => {
    if (initialOrderRef && isOpen) {
      setSearchQuery(initialOrderRef);
      loadOrder(initialOrderRef);
    }
  }, [initialOrderRef, isOpen]);

  // Load specific order by ref or search
  const loadOrder = useCallback(async (ref: string, silent = false) => {
    if (!ref.trim()) return;
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    setHasSearched(true);
    try {
      const single = await dbService.getOrderByReference(ref.trim());
      if (single) {
        setCurrentOrder(single);
        setMatchedOrders([single]);
      } else {
        // Search more broadly by phone or name
        const results = await dbService.searchOrders(ref.trim());
        setMatchedOrders(results);
        if (results.length > 0) {
          setCurrentOrder(results[0]);
        } else {
          setCurrentOrder(null);
        }
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading order status:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadOrder(searchQuery.trim());
    }
  };

  // Real-time auto-polling every 12 seconds when modal is open and an order is loaded
  useEffect(() => {
    if (!isOpen || !currentOrder) return;
    const interval = setInterval(() => {
      loadOrder(currentOrder.id, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [isOpen, currentOrder?.id, loadOrder]);

  if (!isOpen) return null;

  // Status mapping logic
  const getStatusStepIndex = (status: OrderRecord['order_status']) => {
    switch (status) {
      case 'received':
        return 1; // Pending
      case 'preparing':
        return 2; // Preparing
      case 'delivering':
        return 3; // Delivering / Out for delivery
      case 'completed':
        return 4; // Delivered
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = currentOrder ? getStatusStepIndex(currentOrder.order_status) : 1;

  const getStatusBadge = (status: OrderRecord['order_status']) => {
    switch (status) {
      case 'received':
        return {
          label: 'En attente / Reçue (Pending)',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          headline: 'Commande Enregistrée & En Attente (Pending)',
          description: 'Paiement Mobile Money vérifié. Votre commande est transmise en cuisine au 5 Fourchettes.',
          icon: Clock,
          color: 'text-amber-600',
        };
      case 'preparing':
        return {
          label: 'En préparation en cuisine (Preparing)',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
          headline: 'En Préparation en Cuisine (Preparing)',
          description: 'Nos chefs préparent actuellement vos plats chauds, pizzas au four et sauces indiennes.',
          icon: ChefHat,
          color: 'text-blue-600',
        };
      case 'delivering':
        return {
          label: 'En cours de livraison (Delivering)',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          headline: 'En Cours d\'Acheminement (Delivering)',
          description: 'Le livreur est en route à Douala vers votre adresse ou votre commande est prête au drive.',
          icon: Truck,
          color: 'text-purple-600',
        };
      case 'completed':
        return {
          label: 'Livrée avec succès (Delivered)',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          headline: 'Commande Livrée / Terminée (Delivered)',
          description: 'Votre commande a été remise avec succès. Bon appétit de la part du 5 Fourchettes Douala !',
          icon: CheckCircle2,
          color: 'text-emerald-600',
        };
      case 'cancelled':
        return {
          label: 'Commande Annulée',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          headline: 'Commande Annulée',
          description: 'Cette commande a été annulée. Contactez le restaurant au 6 55 44 14 14 pour plus d\'informations.',
          icon: AlertCircle,
          color: 'text-rose-600',
        };
      default:
        return {
          label: 'Statut en cours',
          badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
          headline: 'Traitement en cours',
          description: 'Statut en attente de mise à jour.',
          icon: Clock,
          color: 'text-stone-600',
        };
    }
  };

  const statusInfo = currentOrder ? getStatusBadge(currentOrder.order_status) : null;
  const isCancelled = currentOrder?.order_status === 'cancelled';

  const orderDate = currentOrder?.created_at
    ? new Date(currentOrder.created_at).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const whatsappInquiryMessage = encodeURIComponent(
    `Bonjour Restaurant 5 Fourchettes Douala, je souhaite avoir des nouvelles de ma commande ${currentOrder?.id || ''} au nom de ${currentOrder?.customer_name || ''}.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-start justify-between relative border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <UtensilsCrossed className="w-3 h-3" />
                Restaurant 5 Fourchettes Douala
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase En Direct
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Suivi de Commande en Direct
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Vérifiez en temps réel si votre commande est <strong>En attente (Pending)</strong>, <strong>En préparation (Preparing)</strong> ou <strong>Livrée (Delivered)</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors shrink-0 ml-2"
            aria-label="Fermer le suivi de commande"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/60">
          
          {/* Search bar & quick filters */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Entrez votre N° de commande (ex: CMD-5F-4821) ou N° téléphone..."
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Vérifier</span>
                </button>

                {currentOrder && (
                  <button
                    type="button"
                    onClick={() => loadOrder(currentOrder.id)}
                    disabled={isRefreshing}
                    title="Actualiser le statut depuis Supabase"
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl transition-all shrink-0 flex items-center justify-center"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
                  </button>
                )}
              </div>
            </form>

            {/* Quick shortcuts if last order exists */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-stone-400">Accès rapide :</span>
                {savedLastRef && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(savedLastRef);
                      loadOrder(savedLastRef);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold transition-colors"
                  >
                    <span>Ma dernière commande ({savedLastRef})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <span className="text-[11px] text-stone-400">
                  Ou testez : <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">6 99 24 55 12</code>
                </span>
              </div>

              {currentOrder && (
                <span className="text-[10px] text-stone-400">
                  Dernière synchro : {lastUpdated.toLocaleTimeString('fr-FR')}
                </span>
              )}
            </div>
          </div>

          {/* If multiple orders matched (by phone number for instance) */}
          {matchedOrders.length > 1 && (
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-stone-600 block">
                {matchedOrders.length} commandes trouvées pour votre recherche. Sélectionnez celle à suivre :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setCurrentOrder(ord)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                      currentOrder?.id === ord.id
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-medium'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">{ord.id}</span>
                      <span className="font-mono text-amber-700">{ord.total_amount?.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex justify-between mt-1">
                      <span>{ord.order_mode === 'livraison' ? 'Livraison Douala' : 'Retrait Drive'}</span>
                      <span className="font-semibold capitalize text-stone-800">{ord.order_status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Order View */}
          {currentOrder && statusInfo ? (
            <div className="space-y-5">
              
              {/* Status Stepper Progress Bar */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                      Progression de la commande
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-mono flex items-center gap-2">
                      <span>{currentOrder.id}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-sans font-semibold ${statusInfo.badgeClass}`}>
                        {statusInfo.label}
                      </span>
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500">
                    {orderDate}
                  </span>
                </div>

                {/* 4-Step Visual Timeline */}
                {!isCancelled ? (
                  <div className="relative pt-3 pb-2">
                    {/* Connecting Bar */}
                    <div className="hidden sm:block absolute top-[34px] left-[10%] right-[10%] h-1 bg-stone-200 rounded-full -z-0">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 transition-all duration-700 rounded-full"
                        style={{
                          width:
                            currentStep === 1
                              ? '0%'
                              : currentStep === 2
                              ? '33%'
                              : currentStep === 3
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                      
                      {/* Step 1: Pending */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                            currentStep >= 1
                              ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-stone-900 mt-2">1. En attente</span>
                        <span className="text-[10px] text-stone-500">Paiement vérifié & reçu</span>
                        {currentStep === 1 && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                            En cours
                          </span>
                        )}
                      </div>

                      {/* Step 2: Preparing */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                            currentStep >= 2
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          <ChefHat className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-stone-900 mt-2">2. En préparation</span>
                        <span className="text-[10px] text-stone-500">Cuisine & four à pizza</span>
                        {currentStep === 2 && (
                          <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                            En cuisine
                          </span>
                        )}
                      </div>

                      {/* Step 3: Delivering */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                            currentStep >= 3
                              ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          <Truck className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-stone-900 mt-2">3. Acheminement</span>
                        <span className="text-[10px] text-stone-500">En route / Prêt drive</span>
                        {currentStep === 3 && (
                          <span className="inline-block mt-1 text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                            En livraison
                          </span>
                        )}
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                            currentStep >= 4
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-stone-900 mt-2">4. Livrée</span>
                        <span className="text-[10px] text-stone-500">Remise avec succès</span>
                        {currentStep === 4 && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Terminée
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <strong className="block font-bold">Cette commande a été annulée</strong>
                      <span>Veuillez appeler notre standard au {RESTAURANT_INFO.phone} pour toute précision ou réclamation.</span>
                    </div>
                  </div>
                )}

                {/* Status Explanation Card */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${statusInfo.badgeClass}`}>
                  <statusInfo.icon className={`w-5 h-5 ${statusInfo.color} shrink-0 mt-0.5`} />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {statusInfo.headline}
                    </h4>
                    <p className="text-xs leading-relaxed">
                      {statusInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Detail Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer & Delivery card */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Détails Client & Livraison</span>
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Destinataire :</span>
                      <strong className="text-stone-900">{currentOrder.customer_name}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500">Téléphone :</span>
                      <a href={`tel:${currentOrder.customer_phone}`} className="text-amber-700 font-mono font-bold hover:underline">
                        {currentOrder.customer_phone}
                      </a>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500">Mode :</span>
                      <span className="font-semibold capitalize text-stone-800">
                        {currentOrder.order_mode === 'livraison'
                          ? '🛵 Livraison à domicile Douala'
                          : currentOrder.order_mode === 'drive'
                          ? '🚗 Retrait Drive / Comptoir'
                          : '🍽️ Service sur table'}
                      </span>
                    </div>

                    {currentOrder.delivery_address && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Adresse :</span>
                        <span className="text-stone-900 text-right font-medium max-w-[60%]">
                          {currentOrder.delivery_address}
                        </span>
                      </div>
                    )}

                    {currentOrder.special_note && (
                      <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-600 italic">
                        Note : « {currentOrder.special_note} »
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment verification card */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Paiement & Sécurité</span>
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Bénéficiaire :</span>
                      <strong className="text-stone-900">5 Fourchettes ({RESTAURANT_INFO.phone})</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500">Mode de règlement :</span>
                      <span className="font-semibold text-stone-800">{currentOrder.payment_method}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500">Réf. Transaction :</span>
                      <span className="font-mono font-bold text-amber-800">
                        {currentOrder.payment_reference || 'Vérifié par standard'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500">Statut du Paiement :</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Paiement Validé
                      </span>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-stone-100 font-bold text-sm">
                      <span className="text-stone-800">Total Réglé :</span>
                      <span className="text-amber-700 font-mono text-base">
                        {currentOrder.total_amount?.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Items List */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                    <span>Plats et spécialités commandés ({currentOrder.items?.length || 0})</span>
                  </span>
                  <span className="font-mono text-amber-700 font-bold">
                    {currentOrder.total_amount?.toLocaleString()} FCFA
                  </span>
                </h4>

                <div className="divide-y divide-stone-100">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-800 font-mono font-bold flex items-center justify-center text-[11px] border border-amber-200">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="font-semibold text-stone-900">{item.name}</span>
                            {item.note && (
                              <p className="text-[10px] text-stone-500 italic">« {item.note} »</p>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-stone-700 font-medium">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-xs text-stone-500 italic">
                      Détail des plats archivé.
                    </div>
                  )}

                  {currentOrder.delivery_fee ? (
                    <div className="py-2 flex items-center justify-between text-xs text-stone-600">
                      <span>Frais de livraison Douala :</span>
                      <span className="font-mono font-semibold">{currentOrder.delivery_fee.toLocaleString()} FCFA</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Live Assistance Actions */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <strong className="text-stone-900 block font-bold">
                    Une question sur la livraison ou le temps d'attente ?
                  </strong>
                  <span className="text-stone-600 text-[11px]">
                    Notre équipe en salle et cuisine à Douala répond immédiatement.
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappInquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Cuisine</span>
                  </a>

                  <a
                    href={`tel:${RESTAURANT_INFO.phoneDial}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl transition-all"
                  >
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>{RESTAURANT_INFO.phone}</span>
                  </a>
                </div>
              </div>

            </div>
          ) : hasSearched && !isLoading ? (
            /* Empty state when no order found */
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Aucune commande trouvée pour « {searchQuery} »
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Vérifiez le numéro saisi (ex: <code>CMD-5F-4821</code>) ou le numéro de téléphone utilisé lors du paiement Mobile Money.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Effacer la recherche
                </button>
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=Bonjour%20je%20ne%20trouve%20pas%20ma%20commande`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Demander l'aide d'un serveur</span>
                </a>
              </div>
            </div>
          ) : (
            /* Default prompt when opening modal without search */
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-4">
              <div className="w-14 h-14 bg-stone-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-stone-200">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Suivez votre repas en temps réel
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Entrez votre référence reçue par SMS après validation de votre transfert Orange Money ou MTN MoMo au <strong>6 55 44 14 14</strong>.
                </p>
              </div>

              {savedLastRef && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery(savedLastRef);
                      loadOrder(savedLastRef);
                    }}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Charger ma dernière commande ({savedLastRef})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="text-stone-500 flex items-center gap-2">
            <span className="font-medium">Restaurant 5 Fourchettes</span>
            <span>·</span>
            <span>Douala, Cameroun</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
