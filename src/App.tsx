import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { ReservationSection } from './components/ReservationSection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { PrivateEventModal } from './components/PrivateEventModal';
import { MENU_ITEMS, MenuItem, RESTAURANT_INFO } from './data/restaurantData';
import { Phone, Calendar, ShoppingBag, MessageCircle } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<{ [id: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentPresetAmount, setPaymentPresetAmount] = useState<number>(10000);
  const [paymentOrderRef, setPaymentOrderRef] = useState<string>('');
  const [paymentOrderType, setPaymentOrderType] = useState<'order' | 'reservation' | 'custom'>('custom');
  const [isPrivateEventOpen, setIsPrivateEventOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (item: MenuItem, change: number) => {
    setCartItems((prev) => {
      const current = prev[item.id] || 0;
      const updated = current + change;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: updated };
    });
  };

  const handleClearCart = () => {
    setCartItems({});
  };

  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cartItems]);

  const handleProceedToCheckout = (amount: number, details: { mode: string; address: string; phone: string; name: string }) => {
    const ref = `CMD-5F-${Math.floor(1000 + Math.random() * 9000)}`;
    setPaymentPresetAmount(amount);
    setPaymentOrderRef(ref);
    setPaymentOrderType('order');
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handleOpenDepositPayment = (amount: number, reservationRef: string) => {
    setPaymentPresetAmount(amount);
    setPaymentOrderRef(reservationRef);
    setPaymentOrderType('reservation');
    setIsPaymentOpen(true);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={scrollToReservation}
        onOpenPayment={() => {
          setPaymentPresetAmount(10000);
          setPaymentOrderRef(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
          setPaymentOrderType('custom');
          setIsPaymentOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenReservation={scrollToReservation}
          onScrollToMenu={scrollToMenu}
          onOpenPayment={() => {
            setPaymentPresetAmount(10000);
            setPaymentOrderRef(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
            setPaymentOrderType('custom');
            setIsPaymentOpen(true);
          }}
        />

        <ServicesSection
          onOpenReservation={scrollToReservation}
          onOpenOrder={() => {
            scrollToMenu();
            setIsCartOpen(true);
          }}
          onOpenPrivateEventModal={() => setIsPrivateEventOpen(true)}
        />

        <MenuSection
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
        />

        <TestimonialsCarousel />

        <ReservationSection
          onOpenDepositPayment={handleOpenDepositPayment}
        />

        <InfoSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenReservation={scrollToReservation}
        onOpenPayment={() => {
          setPaymentPresetAmount(10000);
          setPaymentOrderRef(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
          setPaymentOrderType('custom');
          setIsPaymentOpen(true);
        }}
        onScrollToMenu={scrollToMenu}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        menuItems={MENU_ITEMS}
        onUpdateQuantity={handleAddToCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Mobile Money Payment Modal with Strict Verification (6 55 44 14 14) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        presetAmount={paymentPresetAmount}
        orderReference={paymentOrderRef}
        orderType={paymentOrderType}
      />

      {/* Private Event & VIP Quote Modal */}
      <PrivateEventModal
        isOpen={isPrivateEventOpen}
        onClose={() => setIsPrivateEventOpen(false)}
      />

      {/* Discreet Sticky Bottom CTA Bar on Mobile (Strictly under 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-between gap-2 shadow-xl">
        <button
          onClick={scrollToReservation}
          className="flex-1 py-2.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Réserver</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 py-2.5 px-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          <span>Panier {cartCount > 0 ? `(${cartCount})` : ''}</span>
        </button>

        <a
          href={`tel:${RESTAURANT_INFO.phoneDial}`}
          className="p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-amber-700 rounded-xl flex items-center justify-center"
          title={`Appeler le ${RESTAURANT_INFO.phone}`}
          aria-label="Appeler le restaurant"
        >
          <Phone className="w-4 h-4" />
        </a>

        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl flex items-center justify-center"
          title="WhatsApp direct"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
