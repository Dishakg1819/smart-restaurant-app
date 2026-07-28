export type Category = 'starters' | 'mains' | 'desserts' | 'drinks'

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image: string
  tags?: string[]
  popular?: boolean
}

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
]

export const menuItems: MenuItem[] = [
  // --- STARTERS ---
  {
    id: 'bruschetta',
    name: 'Tomato Basil Bruschetta',
    description: 'Toasted sourdough, heirloom tomato, garlic & fresh basil.',
    price: 100,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop',
    tags: ['Vegetarian'],
    popular: true,
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    description: 'Clay-tandoor grilled cottage cheese cubes with peppers & mint chutney.',
    price: 180,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop',
    tags: ['Vegetarian', 'Tandoori'],
    popular: true,
  },
  {
    id: 'vegetable-samosa',
    name: 'Crispy Veg Samosas',
    description: 'Flaky pastry filled with spiced potato and peas served with chutney.',
    price: 120,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    tags: ['Vegetarian', 'Popular'],
  },
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken bites tossed with curry leaves and red chilies.',
    price: 210,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop',
    tags: ['Spicy', 'South Indian'],
    popular: true,
  },
  {
    id: 'masala-dosa',
    name: 'Crispy Masala Dosa',
    description: 'Fermented crepe stuffed with spiced potato masala, served with coconut chutney & sambar.',
    price: 160,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop',
    tags: ['South Indian', 'Vegetarian'],
    popular: true,
  },

  // --- MAINS ---
  {
    id: 'ribeye',
    name: 'Grilled Ribeye Steak',
    description: 'Prime cut, rosemary butter, roasted baby potatoes.',
    price: 150,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop',
    tags: ['Chef’s pick'],
    popular: true,
  },
  {
    id: 'salmon',
    name: 'Pan-Seared Salmon',
    description: 'Crispy skin salmon, charred asparagus, lemon butter.',
    price: 270,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
    tags: ['Gluten-free'],
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken (Murgh Makhani)',
    description: 'Tender tandoori chicken simmered in rich tomato cream gravy.',
    price: 280,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop',
    tags: ['Chef’s pick', 'Non-Veg'],
    popular: true,
  },
  {
    id: 'mutton-chettinad',
    name: 'Mutton Chettinad',
    description: 'Fiery Chettinad-style lamb curry infused with freshly roasted spices, black pepper & coconut.',
    price: 320,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop',
    tags: ['Spicy', 'South Indian'],
    popular: true,
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani & Garlic Naan',
    description: 'Slow-cooked black lentils with butter, served with tandoori garlic naan.',
    price: 220,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
    tags: ['Vegetarian', 'Comfort Food'],
  },
  {
    id: 'chicken-biryani',
    name: 'Hyderabadi Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken, saffron, & raita.',
    price: 290,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    tags: ['Bestseller', 'South Indian'],
    popular: true,
  },

  // --- DESSERTS ---
  {
    id: 'tiramisu',
    name: 'Classic Tiramisu',
    description: 'Espresso-soaked ladyfingers, mascarpone, cocoa dust.',
    price: 300,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
    tags: ['Vegetarian'],
    popular: true,
  },
  {
    id: 'cheesecake',
    name: 'Berry Cheesecake',
    description: 'Vanilla bean cheesecake, seasonal berries, biscuit base.',
    price: 255,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop',
    tags: ['Vegetarian'],
  },
  {
    id: 'royal-kulfi-ice-cream',
    name: 'Saffron Pista Kulfi Ice Cream',
    description: 'Rich traditional condensed milk ice cream flavored with saffron, cardamom & crushed pistachios.',
    price: 260,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',
    tags: ['Vegetarian', 'Indian Special'],
    popular: true,
  },
  {
    id: 'mango-ice-cream',
    name: 'Alphonso Mango Scoop',
    description: 'Double scoop of artisanal ice cream made with sweet Alphonso mango pulp.',
    price: 140,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop',
    tags: ['Vegetarian', 'Fruit Special'],
  },
  {
    id: 'vanilla-bean-ice-cream',
    name: 'Classic Vanilla Bean Ice Cream',
    description: 'Creamy Madagascar vanilla bean ice cream served with chocolate drizzle.',
    price: 120,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop',
    tags: ['Vegetarian'],
  },

  // --- DRINKS ---
  {
    id: 'negroni',
    name: 'Classic Negroni',
    description: 'Gin, Campari, sweet vermouth, orange peel over ice.',
    price: 130,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop',
    tags: ['18+'],
  },
  {
    id: 'lemonade',
    name: 'Fresh Mint Lemonade',
    description: 'Hand-squeezed lemons, muddled mint, sparkling water.',
    price: 160,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    tags: ['Non-alcoholic'],
    popular: true,
  },
  {
    id: 'filter-coffee',
    name: 'South Indian Filter Coffee',
    description: 'Traditional frothed decoction coffee brewed with chicory and hot milk.',
    price: 110,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop',
    tags: ['South Indian', 'Hot Drink'],
    popular: true,
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    description: 'Chilled blend of sweet Alphonso mango pulp, fresh yogurt, & cardamom.',
    price: 170,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop',
    tags: ['Non-alcoholic', 'Refreshing'],
  },
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Traditional milk tea brewed with fresh ginger, cardamom, and Assam leaves.',
    price: 90,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
    tags: ['Hot Drink'],
  },
]