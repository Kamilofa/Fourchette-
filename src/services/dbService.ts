import { supabase } from '../lib/supabase';

export interface ClientRecord {
  id?: string;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  notes?: string;
  last_order_at?: string;
  created_at?: string;
}

export interface OrderRecord {
  id: string;
  client_id?: string;
  customer_name: string;
  customer_phone: string;
  order_mode: 'livraison' | 'drive' | 'table';
  delivery_address?: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; note?: string }>;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_reference: string;
  payment_status: 'verified' | 'pending' | 'failed';
  order_status: 'received' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  special_note?: string;
  created_at?: string;
}

export interface ReservationRecord {
  id: string;
  client_id?: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  area: 'terrasse' | 'salle' | 'vip';
  needs_high_chair: boolean;
  is_birthday: boolean;
  special_notes?: string;
  deposit_amount: number;
  deposit_ref?: string;
  status: 'confirmed' | 'seated' | 'cancelled';
  created_at?: string;
}

// Local storage fallback keys
const LOCAL_CLIENTS_KEY = '5f_clients_db';
const LOCAL_ORDERS_KEY = '5f_orders_db';
const LOCAL_RESERVATIONS_KEY = '5f_reservations_db';

// Helper for local storage
const getLocalData = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// Initial mock clients for demo presentation if empty
const INITIAL_DEMO_CLIENTS: ClientRecord[] = [
  {
    full_name: 'Marcella Ngo',
    phone: '6 99 24 55 12',
    address: 'Bonapriso, Rue des Palmiers',
    city: 'Douala',
    total_orders: 4,
    total_spent: 48500,
    notes: 'Cliente fidèle, adore la Pizza Tikka XXL et terrasse.',
    last_order_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    full_name: 'Armand Tcheutchoua',
    phone: '6 77 88 19 40',
    address: 'Akwa, Boulevard de la Liberté',
    city: 'Douala',
    total_orders: 2,
    total_spent: 27000,
    notes: 'Guide local Google, amateur de spécialités indiennes.',
    last_order_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    full_name: 'Vanessa Eboumbou',
    phone: '6 55 10 33 89',
    address: 'Bonanjo, près des banques',
    city: 'Douala',
    total_orders: 3,
    total_spent: 46500,
    notes: 'Déjeuners d\'affaires, paiement régulier MTN MoMo.',
    last_order_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

export const dbService = {
  // 1. Save or Update Client
  async saveClient(client: Omit<ClientRecord, 'total_orders' | 'total_spent'> & { orderAmount?: number }): Promise<string> {
    const cleanPhone = client.phone.trim();
    const orderSpent = client.orderAmount || 0;

    // Local fallback update
    const localClients = getLocalData<ClientRecord>(LOCAL_CLIENTS_KEY, INITIAL_DEMO_CLIENTS);
    const existingIndex = localClients.findIndex(c => c.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, ''));

    let savedClientId = `cl-${Date.now()}`;

    if (existingIndex >= 0) {
      localClients[existingIndex] = {
        ...localClients[existingIndex],
        full_name: client.full_name || localClients[existingIndex].full_name,
        address: client.address || localClients[existingIndex].address,
        total_orders: localClients[existingIndex].total_orders + 1,
        total_spent: localClients[existingIndex].total_spent + orderSpent,
        last_order_at: new Date().toISOString()
      };
      savedClientId = localClients[existingIndex].id || savedClientId;
    } else {
      const newClient: ClientRecord = {
        id: savedClientId,
        full_name: client.full_name,
        phone: cleanPhone,
        email: client.email || '',
        address: client.address || 'Douala',
        city: 'Douala',
        total_orders: 1,
        total_spent: orderSpent,
        notes: client.notes || 'Nouveau client',
        last_order_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      localClients.unshift(newClient);
    }
    setLocalData(LOCAL_CLIENTS_KEY, localClients);

    // Try Supabase sync
    try {
      const { data: existingSupabaseClient } = await supabase
        .from('clients')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingSupabaseClient) {
        const { data: updated } = await supabase
          .from('clients')
          .update({
            full_name: client.full_name || existingSupabaseClient.full_name,
            address: client.address || existingSupabaseClient.address,
            total_orders: (existingSupabaseClient.total_orders || 0) + 1,
            total_spent: Number(existingSupabaseClient.total_spent || 0) + orderSpent,
            last_order_at: new Date().toISOString()
          })
          .eq('id', existingSupabaseClient.id)
          .select()
          .single();
        if (updated?.id) return updated.id;
      } else {
        const { data: inserted } = await supabase
          .from('clients')
          .insert({
            full_name: client.full_name,
            phone: cleanPhone,
            email: client.email || null,
            address: client.address || 'Douala',
            city: 'Douala',
            total_orders: 1,
            total_spent: orderSpent,
            notes: client.notes || 'Client enregistré via le site',
            last_order_at: new Date().toISOString()
          })
          .select()
          .single();
        if (inserted?.id) return inserted.id;
      }
    } catch (err) {
      console.warn('Supabase clients table sync notice (local storage active):', err);
    }

    return savedClientId;
  },

  // 2. Save Order
  async saveOrder(order: OrderRecord): Promise<void> {
    // 1. Update client record first
    const clientId = await this.saveClient({
      full_name: order.customer_name,
      phone: order.customer_phone,
      address: order.delivery_address,
      orderAmount: order.total_amount
    });

    order.client_id = clientId;
    order.created_at = new Date().toISOString();

    // 2. Local fallback
    const localOrders = getLocalData<OrderRecord>(LOCAL_ORDERS_KEY, []);
    localOrders.unshift(order);
    setLocalData(LOCAL_ORDERS_KEY, localOrders);
    try {
      localStorage.setItem('5f_last_order_ref', order.id);
    } catch {}

    // 3. Supabase insert
    try {
      await supabase.from('orders').insert({
        id: order.id,
        client_id: order.client_id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        order_mode: order.order_mode,
        delivery_address: order.delivery_address || null,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.delivery_fee,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_reference: order.payment_reference,
        payment_status: order.payment_status,
        order_status: order.order_status,
        special_note: order.special_note || null,
        created_at: order.created_at
      });
    } catch (err) {
      console.warn('Supabase orders table sync notice:', err);
    }
  },

  // 3. Save Reservation
  async saveReservation(res: ReservationRecord): Promise<void> {
    const clientId = await this.saveClient({
      full_name: res.customer_name,
      phone: res.customer_phone,
      orderAmount: res.deposit_amount || 0,
      notes: `Réservation ${res.area} pour ${res.guest_count} personnes`
    });

    res.client_id = clientId;
    res.created_at = new Date().toISOString();

    // Local fallback
    const localRes = getLocalData<ReservationRecord>(LOCAL_RESERVATIONS_KEY, []);
    localRes.unshift(res);
    setLocalData(LOCAL_RESERVATIONS_KEY, localRes);

    // Supabase insert
    try {
      await supabase.from('reservations').insert({
        id: res.id,
        client_id: res.client_id,
        customer_name: res.customer_name,
        customer_phone: res.customer_phone,
        reservation_date: res.reservation_date,
        reservation_time: res.reservation_time,
        guest_count: res.guest_count,
        area: res.area,
        needs_high_chair: res.needs_high_chair,
        is_birthday: res.is_birthday,
        special_notes: res.special_notes || null,
        deposit_amount: res.deposit_amount,
        deposit_ref: res.deposit_ref || null,
        status: res.status,
        created_at: res.created_at
      });
    } catch (err) {
      console.warn('Supabase reservations table sync notice:', err);
    }
  },

  // 4. Fetch All Clients
  async getClients(): Promise<ClientRecord[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_order_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalData<ClientRecord>(LOCAL_CLIENTS_KEY, INITIAL_DEMO_CLIENTS);
  },

  // 5. Fetch All Orders
  async getOrders(): Promise<OrderRecord[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalData<OrderRecord>(LOCAL_ORDERS_KEY, []);
  },

  // 6. Fetch All Reservations
  async getReservations(): Promise<ReservationRecord[]> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalData<ReservationRecord>(LOCAL_RESERVATIONS_KEY, []);
  },

  // 7. Update Order Status
  async updateOrderStatus(orderId: string, status: OrderRecord['order_status']): Promise<void> {
    const localOrders = getLocalData<OrderRecord>(LOCAL_ORDERS_KEY, []);
    const idx = localOrders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      localOrders[idx].order_status = status;
      setLocalData(LOCAL_ORDERS_KEY, localOrders);
    }

    try {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase update order status error:', err);
    }
  },

  // 8. Find Order by Reference / ID
  async getOrderByReference(refOrId: string): Promise<OrderRecord | null> {
    if (!refOrId) return null;
    const clean = refOrId.trim();

    // Check Supabase first
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.ilike.%${clean}%,payment_reference.ilike.%${clean}%`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data as OrderRecord;
      }
    } catch {
      // Fallback to local
    }

    const localOrders = getLocalData<OrderRecord>(LOCAL_ORDERS_KEY, []);
    const found = localOrders.find(
      (o) =>
        o.id.toLowerCase().includes(clean.toLowerCase()) ||
        o.payment_reference?.toLowerCase().includes(clean.toLowerCase())
    );
    return found || null;
  },

  // 9. Search Orders by Reference or Phone
  async searchOrders(query: string): Promise<OrderRecord[]> {
    if (!query || !query.trim()) {
      return this.getOrders();
    }
    const clean = query.trim().toLowerCase();
    const digitsOnly = query.replace(/\D/g, '');

    // Try Supabase
    try {
      let req = supabase.from('orders').select('*');
      if (digitsOnly.length >= 6) {
        req = req.or(`id.ilike.%${clean}%,customer_phone.ilike.%${digitsOnly}%,payment_reference.ilike.%${clean}%`);
      } else {
        req = req.or(`id.ilike.%${clean}%,customer_name.ilike.%${clean}%,payment_reference.ilike.%${clean}%`);
      }

      const { data, error } = await req.order('created_at', { ascending: false }).limit(20);
      if (!error && data && data.length > 0) {
        return data as OrderRecord[];
      }
    } catch {
      // Fallback
    }

    // Local fallback search
    const localOrders = getLocalData<OrderRecord>(LOCAL_ORDERS_KEY, []);
    return localOrders.filter((o) => {
      const phoneDigits = o.customer_phone.replace(/\D/g, '');
      const idMatch = o.id.toLowerCase().includes(clean);
      const nameMatch = o.customer_name.toLowerCase().includes(clean);
      const refMatch = o.payment_reference?.toLowerCase().includes(clean);
      const phoneMatch = digitsOnly.length >= 4 && phoneDigits.includes(digitsOnly);
      return idMatch || nameMatch || refMatch || phoneMatch;
    });
  }
};

