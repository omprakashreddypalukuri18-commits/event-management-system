import { useState } from 'react';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { OFFERS_DATA } from '../data/restaurantData';

export default function Offers({
  appliedOffer = null,
  onApplyOffer = () => {},
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = async (code) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // Fallback handled silently via UI feedback
    }
    setCopiedCode(code);
    window.setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 2000);
  };

  return (
    <section
      id="offers"
      className="section-block offers-section"
      aria-labelledby="offers-heading"
      data-component="Offers"
    >
      <div className="container">
        <div className="offers-header">
          <div>
            <span className="section-eyebrow">02 · DINING PRIVILEGES</span>
            <h2 id="offers-heading" className="section-title">
              Seasonal Offers &amp; Table Specials
            </h2>
            <p className="section-subtitle">
              Apply a dining code directly to your order tray or copy it for your
              next evening table at Saffron &amp; Hearth.
            </p>
          </div>
          {appliedOffer && (
            <div className="active-offer-banner" role="status">
              <Sparkles size={15} />
              <span>
                Active code: <strong>{appliedOffer.code}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="offers-grid">
          {OFFERS_DATA.map((offer) => {
            const isApplied = appliedOffer?.id === offer.id;
            const isCopied = copiedCode === offer.code;

            return (
              <article
                key={offer.id}
                className={`offer-card ${isApplied ? 'is-applied' : ''}`}
              >
                <div className="offer-top">
                  <span className="offer-tag">
                    <Tag size={12} />
                    {offer.tag}
                  </span>
                  <span className="offer-badge">{offer.discountLabel}</span>
                </div>

                <h3 className="offer-headline">{offer.headline}</h3>
                <p className="offer-desc">{offer.description}</p>
                <p className="offer-schedule">{offer.schedule}</p>

                <div className="offer-ticket">
                  <div className="promo-code-box">
                    <span className="promo-label">CODE</span>
                    <code className="promo-code">{offer.code}</code>
                  </div>

                  <button
                    type="button"
                    className="copy-code-btn"
                    onClick={() => handleCopy(offer.code)}
                    aria-label={`Copy promo code ${offer.code}`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="offer-card-footer">
                  <span className="offer-highlight">{offer.highlight}</span>
                  <button
                    type="button"
                    className={`apply-offer-btn ${isApplied ? 'is-applied' : ''}`}
                    onClick={() => onApplyOffer(offer)}
                  >
                    <span>{isApplied ? 'Applied ✓' : 'Apply Offer'}</span>
                    {!isApplied && <ArrowRight size={14} />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
