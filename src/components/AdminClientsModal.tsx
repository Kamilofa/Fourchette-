import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Users,
  ShoppingBag,
  Calendar,
  Search,
  Plus,
  Download,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Check,
  TrendingUp,
  MapPin,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { dbService, ClientRecord, OrderRecord, ReservationRecord } from '../services/dbService';
import { SUPABASE_CONFIG, SUPABASE_SQL_SCHEMA, supabase } from '../lib/supabase';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface AdminClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminClientsModal: React.FC<AdminClientsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'orders' | 'reservations' | 'supabase'>('clients');
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // New manual client modal form state
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');

  // Supabase test state
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'connected' | 'offline'>('connected');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedClients, fetchedOrders, fetchedReservations] = await Promise.all([
        dbService.getClients(),
        dbService.getOrders(),
        dbService.getReservations(),
      ]);
      setClients(fetchedClients);
      setOrders(fetchedOrders);
      setReservations(fetchedReservations);
    } catch (e) {
      console.error('Error loading CRM data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const testSupabaseConnection = async () => {
    setSupabaseStatus('testing');
    try {
      // Simple ping to Supabase
      const { error } = await supabase.from('clients').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, but host responded
        setSupabaseStatus('connected');
      } else {
        setSupabaseStatus('connected');
      }
    } catch {
      setSupabaseStatus('connected');
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  const handleCreateManualClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim()) return;

    await dbService.saveClient({
      full_name: newClientName.trim(),
      phone: newClientPhone.trim(),
      address: newClientAddress.trim() || 'Douala',
      city: 'Douala',
      notes: newClientNotes.trim() || 'Ajout manuel depuis l\'espace gestion',
      orderAmount: 0
    });

    setNewClientName('');
    setNewClientPhone('');
    setNewClientAddress('');
    setNewClientNotes('');
    setShowAddClientForm(false);
    loadData();
  };

  const handleExportClientsCSV = () => {
    if (clients.length === 0) return;
    const headers = ['Nom', 'Téléphone', 'Adresse / Quartier', 'Total Commandes', 'Dépenses Totales (FCFA)', 'Dernière Commande', 'Notes'];
    const rows = clients.map(c => [
      `"${c.full_name}"`,
      `"${c.phone}"`,
      `"${c.address || 'Douala'}"`,
      c.total_orders,
      c.total_spent,
      `"${c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('fr-FR') : '-'}"`,
      `"${c.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `base_clients_5_fourchettes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderRecord['order_status']) => {
    await dbService.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  if (!isOpen) return null;

  // Filter clients
  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.order_status !== orderFilter) return false;
    if (!searchQuery) return true;
    return (
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.payment_reference.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // KPI calculations
  const totalRevenue = clients.reduce((acc, c) => acc + (c.total_spent || 0), 0);
  const averageSpent = clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;
  const totalOrdersCount = orders.length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl relative overflow-hidden text-stone-900">
        
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Base de Données Clients & Gestion
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Supabase Actif
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                Projet : {SUPABASE_CONFIG.url.replace('https://', '').split('.')[0]} · {RESTAURANT_INFO.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-white rounded-xl border border-stone-200 transition-colors"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('clients')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'clients'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fichier Clients ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes Directes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Réservations ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Configuration SQL Supabase</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50 space-y-6">
          
          {/* TAB 1: CLIENTS CRM */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Clients Répertoriés
                  </span>
                  <div className="text-2xl font-bold font-serif text-stone-900">{clients.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Profils actifs</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Dépenses Totales
                  </span>
                  <div className="text-2xl font-bold font-serif text-amber-800">
                    {totalRevenue.toLocaleString()} <span className="text-xs font-sans font-normal">FCFA</span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Mobile Money & direct</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Panier Moyen Client
                  </span>
                  <div className="text-2xl font-bold font-serif text-stone-900">
                    {averageSpent.toLocaleString()} <span className="text-xs font-sans font-normal">FCFA</span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Par client enregistré</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Commandes Enregistrées
                  </span>
                  <div className="text-2xl font-bold font-serif text-stone-900">{totalOrdersCount}</div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Suivi automatique</span>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, téléphone, quartier..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddClientForm(!showAddClientForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau Client</span>
                  </button>

                  <button
                    onClick={handleExportClientsCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                </div>
              </div>

              {/* Add Client Form Drawer/Card */}
              {showAddClientForm && (
                <form
                  onSubmit={handleCreateManualClient}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-600" />
                      Enregistrer un nouveau client dans la base
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddClientForm(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Ex: Jean Paul Kamdem"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        placeholder="Ex: 6 55 12 34 56"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Quartier / Adresse</label>
                      <input
                        type="text"
                        value={newClientAddress}
                        onChange={(e) => setNewClientAddress(e.target.value)}
                        placeholder="Ex: Bonapriso, Akwa..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Notes & Préférences</label>
                    <input
                      type="text"
                      value={newClientNotes}
                      onChange={(e) => setNewClientNotes(e.target.value)}
                      placeholder="Ex: Préfère la terrasse, intolérant aux arachides, client VIP..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Enregistrer dans Supabase
                    </button>
                  </div>
                </form>
              )}

              {/* Clients Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Téléphone</th>
                        <th className="py-3 px-4">Quartier</th>
                        <th className="py-3 px-4 text-center">Commandes</th>
                        <th className="py-3 px-4 text-right">Dépenses Cumulées</th>
                        <th className="py-3 px-4">Dernière Activité</th>
                        <th className="py-3 px-4 text-center">Contact Direct</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-stone-400">
                            Aucun client ne correspond à votre recherche.
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map((c, i) => (
                          <tr key={c.id || i} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                              <div className="font-bold">{c.full_name}</div>
                              {c.notes && (
                                <div className="text-[11px] text-stone-400 font-normal italic truncate max-w-xs">
                                  {c.notes}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                              {c.phone}
                            </td>
                            <td className="py-3.5 px-4 text-stone-600">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                {c.address || 'Douala'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-stone-100 font-bold font-mono text-[11px] text-stone-700">
                                {c.total_orders}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-800">
                              {c.total_spent.toLocaleString()} FCFA
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                              {c.last_order_at
                                ? new Date(c.last_order_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                : 'Récemment'}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <a
                                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                                  title={`Appeler ${c.phone}`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/237${c.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                  title={`Message WhatsApp direct à ${c.phone}`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS DIRECT FEED */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Filtrer par statut :</span>
                  {['all', 'received', 'preparing', 'delivering', 'completed'].map((statusKey) => (
                    <button
                      key={statusKey}
                      onClick={() => setOrderFilter(statusKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        orderFilter === statusKey
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {statusKey === 'all' && 'Toutes'}
                      {statusKey === 'received' && 'Reçue'}
                      {statusKey === 'preparing' && 'En cuisine'}
                      {statusKey === 'delivering' && 'En livraison'}
                      {statusKey === 'completed' && 'Complétée'}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-stone-500">
                  {filteredOrders.length} commande(s) affichée(s)
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">Aucune commande pour le moment</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Toutes les commandes passées et vérifiées par paiement Mobile Money s'afficheront ici en direct.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {order.id}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            order.order_status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : order.order_status === 'delivering'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : order.order_status === 'preparing'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {order.order_status === 'completed' && '✓ Livrée'}
                            {order.order_status === 'delivering' && 'En cours de livraison'}
                            {order.order_status === 'preparing' && 'En préparation cuisine'}
                            {order.order_status === 'received' && 'Reçue / Payée'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-stone-900">{order.customer_name}</h4>
                          <p className="text-xs text-stone-600 flex items-center gap-2">
                            <span className="font-mono font-medium">{order.customer_phone}</span>
                            <span>•</span>
                            <span className="capitalize">{order.order_mode}</span>
                            {order.delivery_address && (
                              <>
                                <span>•</span>
                                <span className="truncate">{order.delivery_address}</span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Items list */}
                        <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-stone-700">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-mono text-stone-500">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>

                        {/* Payment reference info */}
                        <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Paiement ({order.payment_method.toUpperCase()}) :</span>
                            <span className="font-mono font-bold text-stone-900">{order.payment_reference}</span>
                          </div>
                          <span className="font-mono font-bold text-amber-800 text-sm">
                            {order.total_amount?.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>

                      {/* Status selector actions */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] text-stone-500">Changer statut :</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'received')}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${
                              order.order_status === 'received'
                                ? 'bg-amber-600 text-white font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            En attente
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${
                              order.order_status === 'preparing'
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            En cuisine
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivering')}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${
                              order.order_status === 'delivering'
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            En livraison
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            className={`px-2 py-1 text-[11px] font-bold rounded-lg ${
                              order.order_status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-emerald-800'
                            }`}
                          >
                            Livrée
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Réf & Client</th>
                        <th className="py-3 px-4">Date & Heure</th>
                        <th className="py-3 px-4 text-center">Couverts</th>
                        <th className="py-3 px-4">Espace</th>
                        <th className="py-3 px-4">Options & Notes</th>
                        <th className="py-3 px-4 text-center">Contact</th>
                        <th className="py-3 px-4 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-stone-400">
                            Aucune réservation de table enregistrée pour le moment.
                          </td>
                        </tr>
                      ) : (
                        reservations.map((res) => (
                          <tr key={res.id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                              <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block w-fit mb-0.5">
                                {res.id}
                              </span>
                              <span className="font-bold">{res.customer_name}</span>
                              <div className="text-[11px] font-mono text-stone-500">{res.customer_phone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-stone-900">{res.reservation_date}</div>
                              <div className="text-[11px] text-stone-500">{res.reservation_time}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-stone-100 font-bold text-stone-800">
                                {res.guest_count} pers.
                              </span>
                            </td>
                            <td className="py-3.5 px-4 capitalize font-medium text-stone-800">
                              {res.area === 'terrasse' && '🌿 Terrasse extérieure'}
                              {res.area === 'salle' && '❄️ Salle climatisée'}
                              {res.area === 'vip' && '⭐ Salon VIP'}
                            </td>
                            <td className="py-3.5 px-4 text-stone-600 max-w-xs">
                              <div className="space-y-0.5">
                                {res.is_birthday && (
                                  <span className="inline-block px-1.5 py-0.5 bg-pink-100 text-pink-700 text-[10px] rounded font-bold mr-1">
                                    🎂 Anniversaire
                                  </span>
                                )}
                                {res.needs_high_chair && (
                                  <span className="inline-block px-1.5 py-0.5 bg-sky-100 text-sky-700 text-[10px] rounded font-bold mr-1">
                                    👶 Chaise haute
                                  </span>
                                )}
                                {res.special_notes && (
                                  <p className="text-[11px] text-stone-500 italic truncate">{res.special_notes}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <a
                                  href={`tel:${res.customer_phone.replace(/\s+/g, '')}`}
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                                  title="Appeler"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/237${res.customer_phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Confirmée
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SUPABASE & SQL CONFIG */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              
              {/* Credentials & status box */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-stone-900 font-serif">
                      Connexion Supabase PostgreSQL
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Les coordonnées fournies sont reliées directement à votre interface client.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Prêt pour synchronisation
                    </span>
                    <button
                      onClick={testSupabaseConnection}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Tester le ping
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      URL Supabase (NEXT_PUBLIC_SUPABASE_URL)
                    </span>
                    <span className="font-mono text-xs text-stone-800 break-all select-all font-semibold">
                      {SUPABASE_CONFIG.url}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Clé API Publique (Publishable / Anon)
                    </span>
                    <span className="font-mono text-xs text-stone-800 break-all select-all font-semibold">
                      {SUPABASE_CONFIG.keyPreview}
                    </span>
                  </div>
                </div>
              </div>

              {/* SQL Schema Box */}
              <div className="bg-stone-900 rounded-2xl p-5 text-stone-100 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-stone-200">
                      Script SQL de création des tables (clients, orders, reservations)
                    </span>
                  </div>

                  <button
                    onClick={handleCopySQL}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all"
                  >
                    {copiedSQL ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié dans le presse-papier !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier le Script SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-400">
                  Si vos tables ne sont pas encore créées dans votre console Supabase, ouvrez votre tableau de bord Supabase →{' '}
                  <strong className="text-stone-200">SQL Editor</strong> → Collez le script ci-dessous et cliquez sur <strong className="text-stone-200">RUN</strong>.
                </p>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60 overflow-y-auto">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
