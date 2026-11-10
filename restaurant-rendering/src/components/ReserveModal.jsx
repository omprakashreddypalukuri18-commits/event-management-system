import { useState } from 'react';
import { X, CalendarDays, Users, Clock, CheckCircle2 } from 'lucide-react';

export default function ReserveModal({ isOpen, onClose }) {
  const [guests, setGuests] = useState('2 Guests');
  const [date, setDate] = useState('2026-11-12');
  const [slot, setSlot] = useState('7:30 PM');
  const [name, setName] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Reserve a table"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="reserve-modal">
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">SAFFRON &amp; HEARTH</span>
            <h3>Reserve a Candlelit Table</h3>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            onClick={handleClose}
            aria-label="Close reservation modal"
          >
            <X size={18} />
          </button>
        </div>

        {confirmed ? (
          <div className="reserve-confirmed">
            <CheckCircle2 size={40} />
            <h4>Table Reserved for {guests}</h4>
            <p>
              We look forward to welcoming{' '}
              <strong>{name.trim() || 'you'}</strong> on{' '}
              <strong>{date}</strong> at <strong>{slot}</strong>.
            </p>
            <button
              type="button"
              className="confirm-order-btn"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form className="reserve-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Guest Name</span>
              <input
                type="text"
                placeholder="e.g. Om Prakash"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <div className="form-row-2">
              <label className="form-field">
                <span>
                  <Users size={13} /> Party Size
                </span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option>2 Guests</option>
                  <option>4 Guests</option>
                  <option>6 Guests</option>
                  <option>8+ Family Table</option>
                </select>
              </label>

              <label className="form-field">
                <span>
                  <CalendarDays size={13} /> Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-field">
              <span>
                <Clock size={13} /> Preferred Seating
              </span>
              <div className="slot-pills">
                {['12:30 PM', '2:00 PM', '7:30 PM', '9:00 PM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`slot-pill ${slot === time ? 'is-active' : ''}`}
                    onClick={() => setSlot(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="confirm-order-btn">
              Confirm Table Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
