import { Flame, ShoppingBag, CalendarDays, Star, Clock, ArrowDown } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Header({
  cartCount = 0,
  onOpenCart = () => {},
  onOpenReserve = () => {},
}) {
  return (
    <header id="header" className="site-header" data-component="Header">
      <nav className="top-nav" aria-label="Primary restaurant navigation">
        <div className="container nav-inner">
          <a href="#header" className="brand-mark">
            <span className="brand-icon" aria-hidden="true">
              <Flame size={18} strokeWidth={2.2} />
            </span>
            <span className="brand-text">
              <span className="brand-name">{RESTAURANT_INFO.name}</span>
              <span className="brand-sub">{RESTAURANT_INFO.tagline}</span>
            </span>
          </a>

          <div className="nav-links">
            <a href="#header" className="nav-link">
              Home
            </a>
            <a href="#menu" className="nav-link">
              Menu
            </a>
            <a href="#offers" className="nav-link">
              Offers
            </a>
            <a href="#footer" className="nav-link">
              Contact
            </a>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-outline-light btn-sm"
              onClick={onOpenReserve}
            >
              <CalendarDays size={15} />
              <span>Reserve</span>
            </button>
            <button
              type="button"
              className="btn-accent btn-sm tray-btn"
              onClick={onOpenCart}
              aria-label={`Open order tray with ${cartCount} items`}
            >
              <ShoppingBag size={15} />
              <span>Tray</span>
              <span className="tray-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="hero-banner">
        <img
          src={RESTAURANT_INFO.heroImage}
          alt="Candlelit wood-fired bistro table with blistered flatbreads and saffron risotto"
          className="hero-bg-img"
        />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              Concept: Restaurant Rendering · Est. {RESTAURANT_INFO.established}
            </span>
            <h1 className="hero-title">Fire, Spice &amp; Seasonal Craft</h1>
            <p className="hero-subtitle">
              Artisanal 48-hour sourdough flatbreads, coastal saffron small plates,
              and comforting hearth-roasted mains served in warm candlelight.
            </p>

            <div className="hero-cta-row">
              <a href="#menu" className="btn-primary-hero">
                <span>Explore the Menu</span>
                <ArrowDown size={16} />
              </a>
              <a href="#offers" className="btn-secondary-hero">
                View Today&apos;s Offers
              </a>
            </div>

            <div className="hero-highlights">
              <span className="highlight-chip">
                <Clock size={14} />
                {RESTAURANT_INFO.hoursStatus}
              </span>
              <span className="highlight-chip">
                <Star size={14} fill="currentColor" />
                {RESTAURANT_INFO.rating} ({RESTAURANT_INFO.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
