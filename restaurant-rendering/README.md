# Saffron & Hearth — Restaurant Rendering (React + Vite)

**Concept:** Restaurant Rendering — A Home page that renders four modular React components sequentially one below the other:

1. **`Header`** (`src/components/Header.jsx`) — Sticky restaurant navigation bar, table reservation trigger, order tray counter, and editorial hero banner.
2. **`Menu`** (`src/components/Menu.jsx`) — Interactive seasonal menu with category tabs (`All`, `Starters`, `Mains & Specials`, `Desserts & Drinks`), `Veg Only` dietary toggle, and dish quantity controls.
3. **`Offers`** (`src/components/Offers.jsx`) — Seasonal dining privileges with copyable promo codes (`LUNCH20`, `HEARTH250`, `SWEETFEAST`) and one-click offer application to the order tray.
4. **`Footer`** (`src/components/Footer.jsx`) — Restaurant story, section navigation, kitchen hours, address & contact details, and back-to-top anchor.

## Component Structure

```
restaurant-rendering/
├── index.html
├── package.json
├── vite.config.js
├── public/images/                # Editorial hero & dish photography
└── src/
    ├── main.jsx                  # App entry point + bundled typography
    ├── App.jsx                   # Renders <Home />
    ├── index.css                 # Design tokens & responsive layout styles
    ├── data/
    │   └── restaurantData.js     # Menu items, offers, and hours data
    ├── pages/
    │   └── Home.jsx              # Renders Header -> Menu -> Offers -> Footer
    ├── components/
    │   ├── Header.jsx
    │   ├── Menu.jsx
    │   ├── Offers.jsx
    │   ├── Footer.jsx
    │   ├── OrderTray.jsx
    │   └── ReserveModal.jsx
    └── test/
        ├── setup.js
        └── Home.test.jsx         # Verifies vertical component rendering & flows
```

## Run Locally

```bash
cd restaurant-rendering
npm install
npm run dev
```

## Build & Test

```bash
cd restaurant-rendering
npm test
npm run build
```
