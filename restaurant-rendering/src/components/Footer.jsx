import { Flame, MapPin, Phone, Mail, Clock, ArrowUp } from 'lucide-react';
import { RESTAURANT_INFO, OPENING_HOURS } from '../data/restaurantData';

export default function Footer({ onOpenReserve = () => {} }) {
  return (
    <footer id="footer" className="site-footer" data-component="Footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-icon" aria-hidden="true">
                <Flame size={18} strokeWidth={2.2} />
              </span>
              <span className="footer-brand-name">{RESTAURANT_INFO.name}</span>
            </div>
            <p className="footer-story">
              An intimate wood-fired dining room celebrating slow fermentation,
              coastal spices, and warm neighborhood hospitality.
            </p>
            <button
              type="button"
              className="footer-reserve-link"
              onClick={onOpenReserve}
            >
              Book a Candlelit Table →
            </button>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li>
                <a href="#header">Header &amp; Story</a>
              </li>
              <li>
                <a href="#menu">Seasonal Menu</a>
              </li>
              <li>
                <a href="#offers">Offers &amp; Specials</a>
              </li>
              <li>
                <a href="#footer">Location &amp; Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Kitchen Hours</h3>
            <ul className="footer-hours">
              {OPENING_HOURS.map((entry) => (
                <li key={entry.days}>
                  <span className="hours-days">{entry.days}</span>
                  <span className="hours-time">
                    <Clock size={12} />
                    {entry.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Visit &amp; Contact</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={15} />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li>
                <Phone size={15} />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li>
                <Mail size={15} />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2026 {RESTAURANT_INFO.name}. Concept: Restaurant Rendering (Header →
            Menu → Offers → Footer).
          </p>
          <a href="#header" className="back-to-top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
