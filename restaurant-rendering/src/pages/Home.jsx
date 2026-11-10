import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import Offers from '../components/Offers';
import Footer from '../components/Footer';
import OrderTray from '../components/OrderTray';
import ReserveModal from '../components/ReserveModal';

/**
 * Home Page — Concept: Restaurant Rendering
 * Renders four core components sequentially one below the other:
 * 1. Header
 * 2. Menu
 * 3. Offers
 * 4. Footer
 */
export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartQuantities = useMemo(() => {
    const map = {};
    for (const item of cartItems) {
      map[item.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  const handleAddItem = (dish) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId, nextQty) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== dishId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === dishId ? { ...i, quantity: nextQty } : i))
    );
  };

  const handleApplyOffer = (offer) => {
    setAppliedOffer(offer);
    setIsTrayOpen(true);
  };

  return (
    <div className="home-page" data-testid="home-page">
      <Header
        cartCount={totalItems}
        onOpenCart={() => setIsTrayOpen(true)}
        onOpenReserve={() => setIsReserveOpen(true)}
      />

      <main className="home-main">
        <Menu
          cartQuantities={cartQuantities}
          onAddItem={handleAddItem}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <Offers
          appliedOffer={appliedOffer}
          onApplyOffer={handleApplyOffer}
        />
      </main>

      <Footer onOpenReserve={() => setIsReserveOpen(true)} />

      <OrderTray
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        items={cartItems}
        appliedOffer={appliedOffer}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveOffer={() => setAppliedOffer(null)}
        onClearTray={() => {
          setCartItems([]);
          setAppliedOffer(null);
        }}
      />

      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
      />
    </div>
  );
}
