import { useState, useMemo } from 'react';
import { Plus, Minus, Clock, Sparkles, Leaf } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/restaurantData';

export default function Menu({
  cartQuantities = {},
  onAddItem = () => {},
  onUpdateQuantity = () => {},
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesDietary = !vegOnly || item.isVeg;
      return matchesCategory && matchesDietary;
    });
  }, [activeCategory, vegOnly]);

  return (
    <section
      id="menu"
      className="section-block menu-section"
      aria-labelledby="menu-heading"
      data-component="Menu"
    >
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">01 · FROM THE WOOD-FIRED HEARTH</span>
            <h2 id="menu-heading" className="section-title">
              Crafted Seasonal Menu
            </h2>
            <p className="section-subtitle">
              Prepared fresh to order using heirloom produce, cold-pressed oils,
              and hand-roasted whole spices.
            </p>
          </div>

          <button
            type="button"
            className={`veg-toggle ${vegOnly ? 'is-active' : ''}`}
            onClick={() => setVegOnly((prev) => !prev)}
            aria-pressed={vegOnly}
          >
            <Leaf size={15} />
            <span>Veg Only</span>
          </button>
        </div>

        <div className="category-tabs" role="tablist" aria-label="Menu categories">
          {MENU_CATEGORIES.map((category) => {
            const count =
              category === 'All'
                ? MENU_ITEMS.filter((i) => !vegOnly || i.isVeg).length
                : MENU_ITEMS.filter(
                    (i) => i.category === category && (!vegOnly || i.isVeg)
                  ).length;

            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="menu-grid">
          {filteredItems.map((dish) => {
            const qty = cartQuantities[dish.id] || 0;

            return (
              <article key={dish.id} className="dish-card">
                <div className="dish-media">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="dish-image"
                    loading="lazy"
                  />
                  <span
                    className={`diet-pill ${dish.isVeg ? 'is-veg' : 'is-nonveg'}`}
                  >
                    <span className="diet-dot" aria-hidden="true" />
                    {dish.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  {dish.badge && (
                    <span className="dish-badge">
                      <Sparkles size={12} />
                      {dish.badge}
                    </span>
                  )}
                </div>

                <div className="dish-body">
                  <div className="dish-meta">
                    <span className="dish-category">{dish.category}</span>
                    <span className="dish-prep">
                      <Clock size={12} />
                      {dish.prepTime}
                    </span>
                  </div>

                  <h3 className="dish-title">{dish.name}</h3>
                  <p className="dish-desc">{dish.description}</p>

                  <div className="dish-footer">
                    <div className="dish-price-group">
                      <span className="dish-price">₹{dish.price}</span>
                      <span className="dish-spice">{dish.spiceLevel}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => onAddItem(dish)}
                        aria-label={`Add ${dish.name} to tray`}
                      >
                        <Plus size={15} />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div
                        className="qty-stepper"
                        aria-label={`Quantity controls for ${dish.name}`}
                      >
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(dish.id, qty - 1)}
                          aria-label={`Decrease ${dish.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-value">{qty}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQuantity(dish.id, qty + 1)}
                          aria-label={`Increase ${dish.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
