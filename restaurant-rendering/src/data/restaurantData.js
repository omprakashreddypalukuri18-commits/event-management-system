export const RESTAURANT_INFO = {
  name: 'Saffron & Hearth',
  tagline: 'Wood-Fired Bistro & Seasonal Kitchen',
  established: '2019',
  rating: '4.9',
  reviewCount: '1,420+',
  hoursStatus: 'Open Today · 11:30 AM – 11:00 PM',
  address: '42 Heritage Courtyard Road, Jubilee Hills, Hyderabad',
  phone: '+91 98765 43210',
  email: 'hello@saffronandhearth.in',
  heroImage: './images/hero-table.jpg',
};

export const MENU_CATEGORIES = [
  'All',
  'Starters',
  'Mains & Specials',
  'Desserts & Drinks',
];

export const MENU_ITEMS = [
  {
    id: 'burrata-flatbread',
    name: 'Smoked Burrata & Heirloom Flatbread',
    category: 'Starters',
    price: 420,
    prepTime: '14 min',
    isVeg: true,
    badge: "Chef's Pick",
    spiceLevel: 'Mild',
    description:
      '48-hour fermented wood-fired sourdough topped with creamy burrata, blistered heirloom tomatoes, and fresh basil oil.',
    image: './images/dish-burrata-flatbread.jpg',
  },
  {
    id: 'peri-paneer-skewers',
    name: 'Charred Peri-Peri Paneer Skewers',
    category: 'Starters',
    price: 380,
    prepTime: '16 min',
    isVeg: true,
    badge: 'Spicy',
    spiceLevel: 'Medium-Hot',
    description:
      'Smoky flame-seared cottage cheese and bell peppers glazed in herb butter, served with whipped mint yogurt and charred lemon.',
    image: './images/dish-paneer-skewers.jpg',
  },
  {
    id: 'crispy-lotus-stem',
    name: 'Crispy Lotus Stem & Tamarind Glaze',
    category: 'Starters',
    price: 340,
    prepTime: '12 min',
    isVeg: true,
    badge: 'Popular',
    spiceLevel: 'Tangy',
    description:
      'Paper-thin wok-crisped lotus root tossed in toasted sesame, roasted tamarind reduction, scallions, and crisp chili.',
    image: './images/dish-lotus-stem.jpg',
  },
  {
    id: 'saffron-butter-prawns',
    name: 'Saffron Garlic Butter Prawns',
    category: 'Mains & Specials',
    price: 680,
    prepTime: '18 min',
    isVeg: false,
    badge: "Chef's Pick",
    spiceLevel: 'Mild',
    description:
      'Pan-seared jumbo coastal prawns finished in golden Kashmiri saffron butter, confit garlic, parsley, and grilled sourdough.',
    image: './images/dish-saffron-prawns.jpg',
  },
  {
    id: 'truffle-mushroom-risotto',
    name: 'Wild Mushroom & Black Truffle Risotto',
    category: 'Mains & Specials',
    price: 560,
    prepTime: '22 min',
    isVeg: true,
    badge: 'Signature',
    spiceLevel: 'Mild',
    description:
      'Slow-simmered Carnaroli rice folded with roasted forest mushrooms, aged parmesan, crispy fried sage, and truffle oil.',
    image: './images/dish-truffle-risotto.jpg',
  },
  {
    id: 'malabar-pepper-chicken',
    name: 'Malabar Peppercorn Roasted Chicken',
    category: 'Mains & Specials',
    price: 610,
    prepTime: '24 min',
    isVeg: false,
    badge: 'Gluten-Free',
    spiceLevel: 'Peppery',
    description:
      'Herb-crusted chicken supreme roasted over open embers, plated over whipped garlic mash, glazed carrots, and pepper jus.',
    image: './images/dish-pepper-chicken.jpg',
  },
  {
    id: 'pistachio-baklava-cheesecake',
    name: 'Pistachio Baklava Cheesecake',
    category: 'Desserts & Drinks',
    price: 390,
    prepTime: '10 min',
    isVeg: true,
    badge: "Chef's Pick",
    spiceLevel: 'Sweet',
    description:
      'Velvety pistachio cheesecake layered over crisp buttered phyllo pastry, finished with warm wildflower honey and rose petals.',
    image: './images/dish-pistachio-dessert.jpg',
  },
  {
    id: 'blood-orange-spritz',
    name: 'Blood Orange & Rosemary Spritz',
    category: 'Desserts & Drinks',
    price: 260,
    prepTime: '6 min',
    isVeg: true,
    badge: 'Zero-Proof',
    spiceLevel: 'Refreshing',
    description:
      'House-pressed Sicilian blood orange cordial topped with sparkling botanical tonic, charred rosemary sprig, and citrus zest.',
    image: './images/dish-blood-orange-spritz.jpg',
  },
  {
    id: 'espresso-tiramisu',
    name: 'Dark Valrhona Espresso Tiramisu',
    category: 'Desserts & Drinks',
    price: 360,
    prepTime: '10 min',
    isVeg: true,
    badge: 'Classic',
    spiceLevel: 'Rich',
    description:
      'Savoiardi biscuits steeped in single-origin Malabar espresso, layered with mascarpone cream and dark cocoa curls.',
    image: './images/dish-espresso-tiramisu.jpg',
  },
];

export const OFFERS_DATA = [
  {
    id: 'lunch-20',
    tag: 'Midday Privilege',
    headline: '20% OFF Wood-Fired Lunch',
    discountLabel: '20% OFF',
    code: 'LUNCH20',
    schedule: 'Tue – Fri · 12:00 PM – 3:30 PM',
    minOrder: 600,
    discountType: 'percent',
    discountValue: 20,
    description:
      'Enjoy flat 20% savings across all Starters and Wood-Fired Mains when ordering between noon and 3:30 PM.',
    highlight: 'Best for Weekday Dining',
  },
  {
    id: 'hearth-250',
    tag: 'First Table Welcome',
    headline: 'Flat ₹250 OFF Chef’s Mains',
    discountLabel: '₹250 OFF',
    code: 'HEARTH250',
    schedule: 'Valid Daily · Orders above ₹999',
    minOrder: 999,
    discountType: 'flat',
    discountValue: 250,
    description:
      'Instant ₹250 privilege on dine-in pre-orders and chef specials with a minimum tray total of ₹999.',
    highlight: 'Most Redeemed',
  },
  {
    id: 'sweet-feast',
    tag: 'Weekend Pairing',
    headline: 'Complimentary Baklava Cheesecake',
    discountLabel: 'FREE DESSERT',
    code: 'SWEETFEAST',
    schedule: 'Fri – Sun · Orders above ₹1,500',
    minOrder: 1500,
    discountType: 'free_item',
    discountValue: 390,
    description:
      'Receive our signature Pistachio Baklava Cheesecake (worth ₹390) on the house for weekend family tables.',
    highlight: 'Weekend Special',
  },
];

export const OPENING_HOURS = [
  { days: 'Tuesday – Thursday', time: '11:30 AM – 10:30 PM' },
  { days: 'Friday – Sunday', time: '11:30 AM – 11:30 PM' },
  { days: 'Monday', time: 'Closed for Kitchen Prep' },
];
