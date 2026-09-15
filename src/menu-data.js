/**
 * Sarawan Fast Food - Menu Data
 * Location: Islam Nagar Block M, Aziz Nagar, Karachi
 * 
 * Includes all dishes and prices specified in the requirements PDF:
 * BBQ, Karahi, Fast Food, Chinese, and Drinks.
 */

export const MENU_ITEMS = [
  // BBQ
  {
    id: 'bbq-1',
    name: 'Chicken Tikka',
    category: 'bbq',
    categoryLabel: 'BBQ',
    price: 350,
    description: 'Tender quarter leg or breast marinated in special spicy tandoori masala, char-grilled over hot coals. Served with mint chutney & sliced onions.',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Best Seller',
    portion: '1 Quarter Piece'
  },
  {
    id: 'bbq-2',
    name: 'Chicken Malai Boti',
    category: 'bbq',
    categoryLabel: 'BBQ',
    price: 450,
    description: 'Melt-in-your-mouth boneless chicken cubes marinated in fresh cream, yogurt, white pepper and mild aromatic spices, charcoal grilled on skewers.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Chef Special',
    portion: '8 Boneless Cubes'
  },
  {
    id: 'bbq-3',
    name: 'Seekh Kabab',
    category: 'bbq',
    categoryLabel: 'BBQ',
    price: 300,
    description: 'Finely minced beef blended with coriander, green chillies, onions, and traditional royal spices, flame-grilled on seekh skewers.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Charcoal Grilled',
    portion: '4 Pieces'
  },

  // Karahi
  {
    id: 'karahi-1',
    name: 'Chicken Karahi',
    category: 'karahi',
    categoryLabel: 'Karahi',
    price: 850,
    description: 'Authentic Karachi-style chicken karahi prepared in a smoking iron wok with ripe tomatoes, freshly julienned ginger, green chillies, and crushed black pepper.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Karachi Classic',
    portion: 'Half Kg'
  },
  {
    id: 'karahi-2',
    name: 'Mutton Karahi',
    category: 'karahi',
    categoryLabel: 'Karahi',
    price: 1450,
    description: 'Tender baby mutton cuts cooked to rich perfection in pure desi ghee wok with garlic, ginger, roasted cumin, and fragrant crushed spices.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Premium Mutton',
    portion: 'Half Kg'
  },

  // Fast Food
  {
    id: 'fast-1',
    name: 'Zinger Burger',
    category: 'fast-food',
    categoryLabel: 'Fast Food',
    price: 450,
    description: 'Signature crispy golden batter-fried chicken thigh fillet, topped with iceberg lettuce, pickled jalapeños, and spicy garlic mayo in a toasted sesame bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Crispy & Juicy',
    portion: '1 Jumbo Burger'
  },
  {
    id: 'fast-2',
    name: 'Chicken Burger',
    category: 'fast-food',
    categoryLabel: 'Fast Food',
    price: 350,
    description: 'Juicy seasoned minced chicken patty grilled and layered with melted cheddar cheese slice, fresh crunchy onion rings, lettuce, and secret house sauce.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Classic',
    portion: '1 Burger'
  },
  {
    id: 'fast-3',
    name: 'Chicken Shawarma',
    category: 'fast-food',
    categoryLabel: 'Fast Food',
    price: 300,
    description: 'Thinly carved marinated rotisserie chicken loaded into a warm pita roll with crunchy cucumber pickles, shredded cabbage, and creamy tahini-garlic sauce.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Street Favorite',
    portion: '1 Large Wrap'
  },

  // Chinese
  {
    id: 'chinese-1',
    name: 'Chicken Chow Mein',
    category: 'chinese',
    categoryLabel: 'Chinese',
    price: 450,
    description: 'Wok-tossed hand-pulled egg noodles with tender chicken strips, julienne carrots, cabbage, capsicum, and savory dark soy-ginger reduction.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Wok Tossed',
    portion: '1 Full Platter'
  },
  {
    id: 'chinese-2',
    name: 'Chicken Manchurian',
    category: 'chinese',
    categoryLabel: 'Chinese',
    price: 550,
    description: 'Succulent crispy chicken chunks simmered in a sweet, tangy & spicy Indo-Chinese garlic sauce with bell peppers and spring onions.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    tag: 'Gravy Specialty',
    portion: '1 Bowl with Gravy'
  },
  {
    id: 'chinese-3',
    name: 'Chicken Fried Rice',
    category: 'chinese',
    categoryLabel: 'Chinese',
    price: 400,
    description: 'Aromatic basmati rice flash-fried at intense heat with fluffy scrambled eggs, shredded chicken, peas, carrots, and sesame oil aroma.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Egg & Chicken',
    portion: '1 Full Bowl'
  },

  // Drinks
  {
    id: 'drink-1',
    name: 'Soft Drink',
    category: 'drinks',
    categoryLabel: 'Drinks',
    price: 100,
    description: 'Ice-cold carbonated beverage can (Pepsi, 7Up, Mirinda, Mountain Dew or Pakola) served chilled.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Chilled',
    portion: '345 ml Can'
  },
  {
    id: 'drink-2',
    name: 'Mineral Water',
    category: 'drinks',
    categoryLabel: 'Drinks',
    price: 80,
    description: 'Pure, refreshing sealed bottled mineral water, chilled to perfection.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    tag: 'Purified',
    portion: '500 ml Bottle'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Dishes' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'karahi', label: 'Karahi' },
  { id: 'fast-food', label: 'Fast Food' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'drinks', label: 'Drinks' }
];

export const RESTAURANT_INFO = {
  name: 'Sarawan Fast Food',
  tagline: 'Taste That Brings You Back',
  location: 'Islam Nagar Block M, Aziz Nagar, Karachi',
  city: 'Karachi, Pakistan',
  phoneDemo: '+92 300 0000000',
  landlineDemo: '(021) 3456-7890',
  hours: 'Monday – Sunday: 4:00 PM – 2:00 AM (Late Night Service)',
  mapsQuery: 'Islam Nagar Aziz Nagar Karachi',
  mapsUrl: 'https://maps.google.com/?q=Islam+Nagar+Aziz+Nagar+Karachi+Pakistan'
};
