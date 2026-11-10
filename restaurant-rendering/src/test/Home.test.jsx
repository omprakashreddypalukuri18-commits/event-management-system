import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';

describe('Home page — Restaurant Rendering', () => {
  it('renders Header, Menu, Offers, and Footer one below the other in exact order', () => {
    const { container } = render(<Home />);

    const header = container.querySelector('[data-component="Header"]');
    const menu = container.querySelector('[data-component="Menu"]');
    const offers = container.querySelector('[data-component="Offers"]');
    const footer = container.querySelector('[data-component="Footer"]');

    expect(header).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
    expect(offers).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Verify exact sequential vertical DOM order: Header -> Menu -> Offers -> Footer
    const componentsInOrder = Array.from(
      container.querySelectorAll('[data-component]')
    ).map((el) => el.getAttribute('data-component'));

    expect(componentsInOrder).toEqual(['Header', 'Menu', 'Offers', 'Footer']);

    expect(
      header.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      menu.compareDocumentPosition(offers) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      offers.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('filters dishes by category and dietary toggle', () => {
    render(<Home />);

    expect(screen.getByText('Saffron Garlic Butter Prawns')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Starters/i }));
    expect(
      screen.getByText('Smoked Burrata & Heirloom Flatbread')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Saffron Garlic Butter Prawns')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Mains & Specials/i }));
    expect(screen.getByText('Saffron Garlic Butter Prawns')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Veg Only/i }));
    expect(
      screen.queryByText('Saffron Garlic Butter Prawns')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Wild Mushroom & Black Truffle Risotto')
    ).toBeInTheDocument();
  });

  it('adds dishes to the order tray and applies an offer discount', () => {
    render(<Home />);

    // Add Saffron Garlic Butter Prawns (₹680) twice = ₹1360
    const addPrawnsBtn = screen.getByRole('button', {
      name: /Add Saffron Garlic Butter Prawns to tray/i,
    });
    fireEvent.click(addPrawnsBtn);
    fireEvent.click(
      screen.getByRole('button', {
        name: /Increase Saffron Garlic Butter Prawns quantity/i,
      })
    );

    expect(
      screen.getByRole('button', { name: /Open order tray with 2 items/i })
    ).toBeInTheDocument();

    // Apply LUNCH20 (20% off) from Offers component
    const applyButtons = screen.getAllByRole('button', { name: /Apply Offer/i });
    fireEvent.click(applyButtons[0]);

    // Tray drawer opens with subtotal ₹1360 and 20% discount −₹272 = ₹1088
    expect(screen.getByRole('dialog', { name: /Order tray/i })).toBeInTheDocument();
    expect(screen.getByText('−₹272')).toBeInTheDocument();
    expect(screen.getByText('₹1088')).toBeInTheDocument();
  });
});
