import { X, Plus, Minus, Tag, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function OrderTray({
  isOpen,
  onClose,
  items,
  appliedOffer,
  onUpdateQuantity,
  onRemoveOffer,
  onClearTray,
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const offerEligible =
    appliedOffer && subtotal >= appliedOffer.minOrder;

  let discountAmount = 0;
  if (offerEligible) {
    if (appliedOffer.discountType === 'percent') {
      discountAmount = Math.round((subtotal * appliedOffer.discountValue) / 100);
    } else if (appliedOffer.discountType === 'flat') {
      discountAmount = Math.min(subtotal, appliedOffer.discountValue);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  const handleConfirmOrder = () => {
    setOrderPlaced(true);
    window.setTimeout(() => {
      onClearTray();
      setOrderPlaced(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Order tray"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="order-drawer">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={18} />
            <h3>Your Dining Tray</h3>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            aria-label="Close order tray"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {orderPlaced ? (
            <div className="drawer-success">
              <CheckCircle2 size={42} />
              <h4>Kitchen Ticket Confirmed</h4>
              <p>
                Our wood-fired hearth is preparing your dishes fresh. Estimated
                wait: 18 minutes.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your dining tray is currently empty.</p>
              <span>
                Explore the Seasonal Menu to add wood-fired dishes or drinks.
              </span>
              {appliedOffer && (
                <div className="applied-chip-note">
                  <Tag size={14} />
                  <span>
                    Offer <strong>{appliedOffer.code}</strong> saved — add ₹
                    {appliedOffer.minOrder}+ to unlock.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <ul className="tray-list">
                {items.map((item) => (
                  <li key={item.id} className="tray-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="tray-item-img"
                    />
                    <div className="tray-item-info">
                      <span className="tray-item-name">{item.name}</span>
                      <span className="tray-item-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <div className="qty-stepper compact">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {appliedOffer && (
                <div className="drawer-offer-box">
                  <div className="drawer-offer-row">
                    <span>
                      <Tag size={14} /> {appliedOffer.code}
                    </span>
                    <button
                      type="button"
                      className="remove-offer-btn"
                      onClick={onRemoveOffer}
                    >
                      Remove
                    </button>
                  </div>
                  {offerEligible ? (
                    <p className="offer-status ok">
                      {appliedOffer.discountType === 'free_item'
                        ? 'Complimentary Pistachio Baklava Cheesecake unlocked!'
                        : `Privilege applied — saving ₹${discountAmount}`}
                    </p>
                  ) : (
                    <p className="offer-status pending">
                      Add ₹{appliedOffer.minOrder - subtotal} more to unlock this
                      privilege.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && !orderPlaced && (
          <div className="drawer-footer">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-line discount">
                <span>Offer ({appliedOffer.code})</span>
                <span>−₹{discountAmount}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Estimated Total</span>
              <span>₹{total}</span>
            </div>
            <button
              type="button"
              className="confirm-order-btn"
              onClick={handleConfirmOrder}
            >
              Send Order to Kitchen · ₹{total}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
