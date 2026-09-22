/**
 * CANTENEX — Complete Application & In-Memory Relational Engine
 * Universal execution (direct file:// or HTTP)
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. DATA & CONSTANTS
     ========================================================================== */
  const MENU_CATEGORIES = [
    { id: 'ALL', label: 'All Items', count: 36 },
    { id: 'BREAKFAST', label: 'Morning Tiffin', count: 7 },
    { id: 'MEALS', label: 'Lunch & Bowls', count: 9 },
    { id: 'SNACKS', label: 'Quick Bites', count: 8 },
    { id: 'DRINKS', label: 'Brews & Coolers', count: 8 },
    { id: 'DESSERTS', label: 'Sweet Finishes', count: 4 },
  ];

  const PICKUP_SLOTS = [
    { id: 'slot-1', label: '⚡ Ready in 10-12 Mins', type: 'immediate', desc: 'Current Kitchen Prep Queue' },
    { id: 'slot-2', label: '11:15 AM — Morning Break', type: 'scheduled', desc: 'Class Short Break (15 mins)' },
    { id: 'slot-3', label: '01:15 PM — Lunch Break', type: 'scheduled', desc: 'Main Campus Lunch Hour' },
    { id: 'slot-4', label: '03:45 PM — Evening Snack', type: 'scheduled', desc: 'Post-Lecture Tea Break' },
    { id: 'slot-5', label: '05:30 PM — After Hours', type: 'scheduled', desc: 'Evening Study & Lab Slot' },
  ];

  const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Artificial Intelligence & DS',
    'Biotechnology',
    'Business Administration (MBA)',
  ];

  const INITIAL_MENU_ITEMS = [
    // BREAKFAST (7 Items)
    {
      id: 'cx-01',
      code: '01',
      name: 'Ghee Podi Masala Dosa',
      category: 'BREAKFAST',
      price: 65,
      prepTime: '8 mins',
      diet: 'veg',
      tag: 'Campus Bestseller',
      description: 'Crisp golden fermented rice crepe roasted in pure A2 ghee, generously dusted with gun-powder podi spice, filled with spiced potato masala, served with 3 house chutneys and hot sambar.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      calories: '340 kcal',
      protein: '9g',
      carbs: '48g',
      fats: '12g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.9,
      highlight: true,
    },
    {
      id: 'cx-02',
      code: '02',
      name: 'Steamed Ghee Idli & Medu Vada Combo',
      category: 'BREAKFAST',
      price: 50,
      prepTime: '5 mins',
      diet: 'veg',
      tag: 'Morning Ritual',
      description: 'Two cloud-soft button idlis dipped in clarified ghee paired with a crispy, freshly fried golden medu vada, served with traditional shallot drumstick sambar and fresh coconut dip.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      calories: '280 kcal',
      protein: '8g',
      carbs: '42g',
      fats: '8g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.8,
    },
    {
      id: 'cx-03',
      code: '03',
      name: 'Ven Pongal with Cashew Ghee Roast',
      category: 'BREAKFAST',
      price: 55,
      prepTime: '6 mins',
      diet: 'veg',
      tag: 'Comfort Bowl',
      description: 'Silky melt-in-mouth rice and yellow moong dal cooked with whole crushed black peppercorns, fresh ginger, curry leaves, and crunchy roasted cashews tempered in pure country butter.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      calories: '310 kcal',
      protein: '7g',
      carbs: '45g',
      fats: '11g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.7,
    },
    {
      id: 'cx-17',
      code: '17',
      name: 'Mysore Masala Dosa with Red Garlic Chutney',
      category: 'BREAKFAST',
      price: 70,
      prepTime: '8 mins',
      diet: 'veg',
      tag: 'Fiery Crisp',
      description: 'Golden butter roasted crepe smeared with pungent red chili garlic Mysore paste, filled with spiced mashed potato filling, served with coconut chutney and piping hot drumstick sambar.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      calories: '360 kcal',
      protein: '9g',
      carbs: '50g',
      fats: '14g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.9,
    },
    {
      id: 'cx-18',
      code: '18',
      name: 'Puri Bhaji with Spiced Potato Masala (3 Pcs)',
      category: 'BREAKFAST',
      price: 55,
      prepTime: '6 mins',
      diet: 'veg',
      tag: 'Student Classic',
      description: 'Trio of puffed golden whole-wheat puris served with aromatic turmeric tempered cumin-potato bhaji, freshly sliced onions, green chilies, and tangy mango pickle.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      calories: '380 kcal',
      protein: '8g',
      carbs: '52g',
      fats: '16g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.8,
    },
    {
      id: 'cx-19',
      code: '19',
      name: 'Crispy Onion Rava Dosa with Ginger Dip',
      category: 'BREAKFAST',
      price: 65,
      prepTime: '9 mins',
      diet: 'veg',
      tag: 'Golden Net',
      description: 'Delicate semolina lacy net crepe studded with crunchy chopped shallots, green chilies, crushed black peppercorns, and roasted cumin. Served crisp with allam ginger pachadi.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      calories: '320 kcal',
      protein: '7g',
      carbs: '46g',
      fats: '12g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.7,
    },
    {
      id: 'cx-20',
      code: '20',
      name: 'Lacy Kerala Appam with Vegetable Stew (2 Pcs)',
      category: 'BREAKFAST',
      price: 60,
      prepTime: '7 mins',
      diet: 'veg',
      tag: 'Coastal Delight',
      description: 'Fermented rice and coconut milk hopper with a soft spongy center and crispy lacy edges, paired with mildly spiced coconut milk stew laden with carrots, beans, and potatoes.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      calories: '260 kcal',
      protein: '6g',
      carbs: '44g',
      fats: '7g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.8,
    },

    // MEALS (9 Items)
    {
      id: 'cx-04',
      code: '04',
      name: 'Malabar Chicken Dum Biryani',
      category: 'MEALS',
      price: 130,
      prepTime: '7 mins',
      diet: 'non-veg',
      tag: "Chef's Signature",
      description: 'Fragrant short-grain Kaima rice layered with tender spiced chicken marinated in roasted Kerala spices, slow-cooked in dum style. Accompanied by mint onion raita, spicy pickle, and boiled farm egg.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=85',
      calories: '580 kcal',
      protein: '32g',
      carbs: '65g',
      fats: '22g',
      inStock: true,
      spiceLevel: 3,
      rating: 5.0,
      featuredSpecial: true,
    },
    {
      id: 'cx-05',
      code: '05',
      name: 'Traditional South Indian Executive Meals',
      category: 'MEALS',
      price: 90,
      prepTime: '5 mins',
      diet: 'veg',
      tag: 'Full Lunch Feast',
      description: 'Unlimited Ponni steamed rice served on eco-leaf with traditional Sambar, spicy Rasam, Kootu, Poriyal of the day, Appalam, curd, spicy pickle, and sweet Payasam.',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85',
      calories: '520 kcal',
      protein: '14g',
      carbs: '78g',
      fats: '16g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.8,
    },
    {
      id: 'cx-06',
      code: '06',
      name: 'Wok-Tossed Schezwan Egg & Chicken Fried Rice',
      category: 'MEALS',
      price: 95,
      prepTime: '10 mins',
      diet: 'non-veg',
      tag: 'Canteen Favorite',
      description: 'High-flame wok tossed basmati rice with shredded chicken, scrambled farm egg, crisp scallions, bell peppers, and fiery in-house Schezwan red pepper reduction.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85',
      calories: '490 kcal',
      protein: '26g',
      carbs: '62g',
      fats: '15g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.9,
    },
    {
      id: 'cx-07',
      code: '07',
      name: 'Flaky Kerala Parotta with Chicken Salna (2 Pcs)',
      category: 'MEALS',
      price: 80,
      prepTime: '6 mins',
      diet: 'non-veg',
      tag: 'Street Legend',
      description: 'Hand-beaten, multi-layered golden flaky Malabar parottas served steaming hot with rich, aromatic street-style chicken salna gravy and sliced red onions.',
      image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      calories: '460 kcal',
      protein: '24g',
      carbs: '48g',
      fats: '20g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.9,
    },
    {
      id: 'cx-21',
      code: '21',
      name: 'Hyderabadi Shahi Paneer Biryani Handi',
      category: 'MEALS',
      price: 115,
      prepTime: '8 mins',
      diet: 'veg',
      tag: 'Royal Feast',
      description: 'Long-grain aged basmati rice cooked on slow dum with tandoor grilled cottage cheese cubes, caramelized fried onions (birista), saffron milk, mint leaves, and rich cucumber raita.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=85',
      calories: '510 kcal',
      protein: '18g',
      carbs: '68g',
      fats: '19g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.8,
      highlight: true,
    },
    {
      id: 'cx-22',
      code: '22',
      name: 'Paneer Butter Masala with 2 Butter Naan',
      category: 'MEALS',
      price: 110,
      prepTime: '8 mins',
      diet: 'veg',
      tag: 'North Indian Star',
      description: 'Silky paneer cubes simmered in a luscious velvet tomato cashew gravy enriched with butter and dried fenugreek kasuri methi, served with 2 freshly charred butter garlic naans.',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      calories: '540 kcal',
      protein: '19g',
      carbs: '58g',
      fats: '26g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.9,
    },
    {
      id: 'cx-23',
      code: '23',
      name: 'Student Mini Thali (Dal Makhani & Jeera Rice)',
      category: 'MEALS',
      price: 85,
      prepTime: '5 mins',
      diet: 'veg',
      tag: 'Everyday Saver',
      description: 'Slow-simmered black lentils in creamy butter gravy, fragrant cumin basmati rice, 2 hot phulkas, fresh pickled onions, and roasted papad for a wholesome lecture break lunch.',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85',
      calories: '450 kcal',
      protein: '15g',
      carbs: '65g',
      fats: '14g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.7,
    },
    {
      id: 'cx-24',
      code: '24',
      name: 'Street-Style Chicken Hakka Noodles',
      category: 'MEALS',
      price: 95,
      prepTime: '9 mins',
      diet: 'non-veg',
      tag: 'Wok Master',
      description: 'Springy egg noodles tossed in high-heat wok with tender chicken strips, crisp cabbage, julienned carrots, scallions, dark soy sauce, and crushed white peppercorns.',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85',
      calories: '470 kcal',
      protein: '25g',
      carbs: '59g',
      fats: '16g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.8,
    },
    {
      id: 'cx-25',
      code: '25',
      name: 'Comfort Curd Rice with Tadka & Pomegranate',
      category: 'MEALS',
      price: 45,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Cooling Bowl',
      description: 'Creamy homemade curd mixed with soft mashed rice, tempered with mustard seeds, curry leaves, ginger, green chilies, roasted urad dal, and sweet ruby pomegranate pearls.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      calories: '260 kcal',
      protein: '7g',
      carbs: '42g',
      fats: '7g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.8,
    },

    // SNACKS (8 Items)
    {
      id: 'cx-08',
      code: '08',
      name: 'Charcoal Grilled Paneer Tikka Kathi Roll',
      category: 'SNACKS',
      price: 75,
      prepTime: '8 mins',
      diet: 'veg',
      tag: 'Grab & Go',
      description: 'Succulent malai paneer cubes marinated in tandoori spices, rolled in a flaky butter parotta with pickled laccha onions, mint coriander chutney, and chatpata chaat masala.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85',
      calories: '390 kcal',
      protein: '16g',
      carbs: '44g',
      fats: '17g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.7,
    },
    {
      id: 'cx-09',
      code: '09',
      name: 'Delhi Style Samosa Chaat Platter (2 Pcs)',
      category: 'SNACKS',
      price: 45,
      prepTime: '5 mins',
      diet: 'veg',
      tag: 'Evening Craving',
      description: 'Crisp pastry triangles stuffed with spiced potatoes and green peas, crushed and drowned in hot ragda chole, whisked yogurt, sweet tamarind glaze, spicy mint chutney, and nylon sev.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85',
      calories: '320 kcal',
      protein: '8g',
      carbs: '46g',
      fats: '12g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.8,
    },
    {
      id: 'cx-10',
      code: '10',
      name: 'Peri Peri Seasoned Crispy Golden Fries',
      category: 'SNACKS',
      price: 60,
      prepTime: '7 mins',
      diet: 'veg',
      tag: 'Addictive Crunch',
      description: 'Double-fried hand-cut Idaho potato batons tossed immediately in spicy African bird’s eye peri-peri seasoning. Served with creamy garlic dip.',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      calories: '350 kcal',
      protein: '5g',
      carbs: '48g',
      fats: '16g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.6,
    },
    {
      id: 'cx-26',
      code: '26',
      name: 'Kolkata Double Egg & Chicken Roll',
      category: 'SNACKS',
      price: 85,
      prepTime: '8 mins',
      diet: 'non-veg',
      tag: 'Protein Loaded',
      description: 'Layered flaky parotta lined with two farm eggs, stuffed with spicy roasted shredded chicken, crunchy sliced red onions, green chilies, fresh lime juice, and Kasundi mustard mayo.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=1200&q=85',
      calories: '440 kcal',
      protein: '28g',
      carbs: '42g',
      fats: '18g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.9,
    },
    {
      id: 'cx-27',
      code: '27',
      name: 'Crispy Onion & Palak Pakoda Basket',
      category: 'SNACKS',
      price: 40,
      prepTime: '6 mins',
      diet: 'veg',
      tag: 'Rainy Day Crunch',
      description: 'Golden, extra-crisp fritters made from thinly sliced red onions and tender baby spinach coated in ajwain-spiced gram flour batter. Served with spicy pudina mint chutney.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85',
      calories: '290 kcal',
      protein: '6g',
      carbs: '36g',
      fats: '14g',
      inStock: true,
      spiceLevel: 2,
      rating: 4.7,
    },
    {
      id: 'cx-28',
      code: '28',
      name: 'Mumbai Butter Pav Bhaji (2 Butter Pavs)',
      category: 'SNACKS',
      price: 70,
      prepTime: '7 mins',
      diet: 'veg',
      tag: 'Campus Sensation',
      description: 'Spicy mashed vegetable curry enriched with pure Amul butter, special Pav Bhaji masala, served with 2 golden pan-toasted butter pavs, fresh lemon wedges, and chopped red onions.',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      calories: '420 kcal',
      protein: '10g',
      carbs: '56g',
      fats: '18g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.9,
      highlight: true,
    },
    {
      id: 'cx-29',
      code: '29',
      name: 'Crispy Vegetable Spring Rolls with Sweet Chili (4 Pcs)',
      category: 'SNACKS',
      price: 55,
      prepTime: '6 mins',
      diet: 'veg',
      tag: 'Golden Crispy',
      description: 'Crispy golden pastry rolls packed with wok-tossed shredded cabbage, bell peppers, carrots, and sweet corn. Served hot with homemade sweet garlic chili dip.',
      image: 'https://images.unsplash.com/photo-1548507297-c20ec26b52c0?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85',
      calories: '280 kcal',
      protein: '6g',
      carbs: '38g',
      fats: '12g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.7,
    },
    {
      id: 'cx-30',
      code: '30',
      name: 'Crunchy Southern Spiced Chicken Popcorn',
      category: 'SNACKS',
      price: 80,
      prepTime: '6 mins',
      diet: 'non-veg',
      tag: 'Crunch Blast',
      description: 'Bite-sized boneless chicken morsels marinated in buttermilk and south-Indian curry leaf masala, breaded and fried to supreme crunch. Served with smoked garlic dip.',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85',
      calories: '370 kcal',
      protein: '24g',
      carbs: '28g',
      fats: '18g',
      inStock: true,
      spiceLevel: 3,
      rating: 4.8,
    },

    // DRINKS (8 Items)
    {
      id: 'cx-11',
      code: '11',
      name: 'Brass Tumbler Degree Filter Coffee',
      category: 'DRINKS',
      price: 25,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Soul Brew',
      description: 'Freshly decocted 80:20 Peaberry Chicory brew frothed with full-cream hot milk, poured from height to create a velvety foam crown. Served in traditional brass dabarah.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      calories: '110 kcal',
      protein: '4g',
      carbs: '14g',
      fats: '4g',
      inStock: true,
      spiceLevel: 0,
      rating: 5.0,
    },
    {
      id: 'cx-12',
      code: '12',
      name: 'Kolkata Kulhad Masala Chai',
      category: 'DRINKS',
      price: 20,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Rainy Day Special',
      description: 'Assam CTC tea leaves slow-simmered with crushed green cardamom, dried ginger, cloves, and cinnamon bark, served in an earthy terracotta kulhad.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      calories: '90 kcal',
      protein: '3g',
      carbs: '12g',
      fats: '3g',
      inStock: true,
      spiceLevel: 1,
      rating: 4.9,
    },
    {
      id: 'cx-13',
      code: '13',
      name: 'Belgian Dark Chocolate Frappé Cold Coffee',
      category: 'DRINKS',
      price: 65,
      prepTime: '4 mins',
      diet: 'veg',
      tag: 'Chilled Fuel',
      description: 'Double espresso shot blended with rich Belgian chocolate ganache, chilled dairy, and crushed ice, topped with cocoa dusting and espresso foam.',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      calories: '220 kcal',
      protein: '6g',
      carbs: '28g',
      fats: '9g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.9,
    },
    {
      id: 'cx-14',
      code: '14',
      name: 'Shikanji Fresh Mint Lime Crusher',
      category: 'DRINKS',
      price: 35,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Hydration Burst',
      description: 'Hand-squeezed Kagzi lime juice shaken with crushed garden spearmint, roasted cumin rock salt, cane sugar, and sparkling soda or chilled water.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85',
      calories: '75 kcal',
      protein: '1g',
      carbs: '18g',
      fats: '0g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.7,
    },
    {
      id: 'cx-31',
      code: '31',
      name: 'Chilled Royal Rose Milk with Sabja Seeds',
      category: 'DRINKS',
      price: 40,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Summer Classic',
      description: 'Thick farm fresh chilled milk blended with aromatic rose petal syrup, floating soaked basil (sabja) seeds, and crushed ice for instant campus refreshment.',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85',
      calories: '160 kcal',
      protein: '5g',
      carbs: '24g',
      fats: '5g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.8,
    },
    {
      id: 'cx-32',
      code: '32',
      name: 'Alphonso Mango Lassi with Roasted Pistachios',
      category: 'DRINKS',
      price: 55,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Creamy Mango',
      description: 'Velvety sweet yogurt churned with real Ratnagiri Alphonso mango pulp, a hint of cardamom, topped with chopped Iranian pistachios and saffron threads.',
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85',
      calories: '210 kcal',
      protein: '7g',
      carbs: '32g',
      fats: '6g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.9,
    },
    {
      id: 'cx-33',
      code: '33',
      name: 'Iced Lemon Peach Hibiscus Brew',
      category: 'DRINKS',
      price: 40,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Zero Guilt Cooler',
      description: 'Cold-brewed organic crimson hibiscus flowers infused with white peach essence, squeezed lemon juice, and a splash of wild mountain honey over cracked ice.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      calories: '60 kcal',
      protein: '0g',
      carbs: '14g',
      fats: '0g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.7,
    },
    {
      id: 'cx-34',
      code: '34',
      name: 'Warm Kesariya Badam Milk with Crushed Cashews',
      category: 'DRINKS',
      price: 45,
      prepTime: '4 mins',
      diet: 'veg',
      tag: 'Nutritious Warmth',
      description: 'Rich boiling milk infused with ground almond paste, Kashmiri saffron strands, cardamom powder, and garnished with roasted golden cashew bits.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      calories: '190 kcal',
      protein: '8g',
      carbs: '22g',
      fats: '8g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.9,
    },

    // DESSERTS (4 Items)
    {
      id: 'cx-15',
      code: '15',
      name: 'Sizzling Warm Belgian Walnut Brownie',
      category: 'DESSERTS',
      price: 80,
      prepTime: '5 mins',
      diet: 'veg',
      tag: 'Decadent Melt',
      description: 'Dense, fudgy 70% dark chocolate brownie packed with roasted California walnuts, warmed through and served with rich chocolate hot fudge drizzle.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85',
      calories: '410 kcal',
      protein: '6g',
      carbs: '46g',
      fats: '22g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.9,
    },
    {
      id: 'cx-16',
      code: '16',
      name: 'Royal Shahi Malai Kulfi on Bamboo Stick',
      category: 'DESSERTS',
      price: 50,
      prepTime: '2 mins',
      diet: 'veg',
      tag: 'Traditional Chilled',
      description: 'Slow-reduced whole buffalo milk infused with Kashmiri saffron strands, green cardamom, chopped Iranian pistachios, and slivered almonds.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85',
      calories: '240 kcal',
      protein: '5g',
      carbs: '26g',
      fats: '13g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.8,
    },
    {
      id: 'cx-35',
      code: '35',
      name: 'Hot Desi Ghee Gulab Jamun with Rabdi (2 Pcs)',
      category: 'DESSERTS',
      price: 55,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Pure Indulgence',
      description: 'Soft golden fried mawa dumplings soaked in rose cardamom sugar syrup, served warm alongside a generous ladle of chilled slow-simmered rabdi.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85',
      calories: '310 kcal',
      protein: '6g',
      carbs: '42g',
      fats: '14g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.9,
    },
    {
      id: 'cx-36',
      code: '36',
      name: 'Rich Saffron Gajar Ka Halwa with Mawa & Nuts',
      category: 'DESSERTS',
      price: 65,
      prepTime: '3 mins',
      diet: 'veg',
      tag: 'Winter Specialty',
      description: 'Slow-cooked grated Delhi carrots in pure country ghee and full-cream milk, sweetened with raw sugar, studded with roasted cashews, raisins, and crumbled mawa.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85',
      calories: '290 kcal',
      protein: '5g',
      carbs: '38g',
      fats: '13g',
      inStock: true,
      spiceLevel: 0,
      rating: 4.8,
    },
  ];

  const INITIAL_ORDERS = [
    {
      id: 'CX-1021',
      studentName: 'Dinesh C',
      regNo: '22BCS142',
      department: 'Computer Science & Engineering',
      items: [
        { id: 'cx-04', name: 'Malabar Chicken Dum Biryani', price: 130, quantity: 1 },
        { id: 'cx-14', name: 'Shikanji Fresh Mint Lime Crusher', price: 35, quantity: 1 },
      ],
      totalAmount: 165,
      pickupSlot: '01:15 PM — Lunch Break',
      pickupType: 'scheduled',
      paymentMethod: 'UPI Demo (Verified)',
      status: 'READY',
      counter: 'Counter 2 (Hot Express)',
      placedAt: '12:48 PM',
      prepProgress: 90,
    },
    {
      id: 'CX-1022',
      studentName: 'Sneha Rangarajan',
      regNo: '23BIT089',
      department: 'Information Technology',
      items: [
        { id: 'cx-01', name: 'Ghee Podi Masala Dosa', price: 65, quantity: 2 },
        { id: 'cx-11', name: 'Brass Tumbler Degree Filter Coffee', price: 25, quantity: 2 },
      ],
      totalAmount: 180,
      pickupSlot: '⚡ Ready in 10-12 Mins',
      pickupType: 'immediate',
      paymentMethod: 'Cash at Counter',
      status: 'PREPARING',
      counter: 'Counter 1 (Tiffin & Dosa)',
      placedAt: '01:02 PM',
      prepProgress: 55,
    },
    {
      id: 'CX-1023',
      studentName: 'Rohan Deshmukh',
      regNo: '21BME205',
      department: 'Mechanical Engineering',
      items: [
        { id: 'cx-07', name: 'Flaky Kerala Parotta with Salna', price: 80, quantity: 1 },
        { id: 'cx-13', name: 'Belgian Dark Chocolate Cold Coffee', price: 65, quantity: 1 },
      ],
      totalAmount: 145,
      pickupSlot: '01:15 PM — Lunch Break',
      pickupType: 'scheduled',
      paymentMethod: 'UPI Demo (Verified)',
      status: 'ACCEPTED',
      counter: 'Counter 3 (Special Gravy)',
      placedAt: '01:08 PM',
      prepProgress: 25,
    },
    {
      id: 'CX-1024',
      studentName: 'Kavya Sree',
      regNo: '24BAI017',
      department: 'Artificial Intelligence & DS',
      items: [
        { id: 'cx-08', name: 'Paneer Tikka Kathi Roll', price: 75, quantity: 1 },
        { id: 'cx-15', name: 'Sizzling Warm Brownie', price: 80, quantity: 1 },
      ],
      totalAmount: 155,
      pickupSlot: '03:45 PM — Evening Snack',
      pickupType: 'scheduled',
      paymentMethod: 'UPI Demo (Verified)',
      status: 'PLACED',
      counter: 'Counter 2 (Hot Express)',
      placedAt: '01:12 PM',
      prepProgress: 10,
    },
  ];

  const INITIAL_REVIEWS = [
    {
      id: 'rev-1',
      menuId: 'cx-04',
      studentName: 'Dinesh C. (CSE)',
      rating: 5,
      comment: 'The chicken dum biryani is incredible! Dum aroma is authentic and chicken pieces are super tender.',
      date: 'Today, 12:45 PM'
    },
    {
      id: 'rev-2',
      menuId: 'cx-01',
      studentName: 'Sneha R. (IT)',
      rating: 5,
      comment: 'Podi dosa is crisp to perfection. Love the fiery gunpowder spice and ginger chutney.',
      date: 'Today, 10:30 AM'
    },
    {
      id: 'rev-3',
      menuId: 'cx-11',
      studentName: 'Rohan D. (Mech)',
      rating: 5,
      comment: 'Authentic degree filter coffee. Perfect frothy head in the brass dabarah!',
      date: 'Today, 09:15 AM'
    },
    {
      id: 'rev-4',
      menuId: 'cx-15',
      studentName: 'Kavya S. (AI&DS)',
      rating: 5,
      comment: 'Warm walnut brownie with hot chocolate sauce is a lifesaver between continuous lectures.',
      date: 'Yesterday, 04:20 PM'
    }
  ];

  /* ==========================================================================
     2. AUDIO & VOICE SYNTHESIS ENGINE
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
    playClick() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }
    playAdd() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        osc2.frequency.setValueAtTime(1046.50, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now + 0.04);
        osc1.stop(now + 0.18);
        osc2.stop(now + 0.18);
      } catch (e) {}
    }
    playSuccess() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + idx * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.35);
        });
      } catch (e) {}
    }
    playChime() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }
    speakAnnouncement(text) {
      if (!this.enabled) return;
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.pitch = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    }
    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.playChime();
        this.speakAnnouncement("Campus audio enabled.");
      }
      return this.enabled;
    }
  }
  const sounds = new SoundEngine();

  /* ==========================================================================
     3. REACTIVE STORE & RELATIONAL ENGINE
     ========================================================================== */
  class Store {
    constructor() {
      this.listeners = new Set();
      const savedMenu = this.load('cantenex_menu', null);
      if (!savedMenu || savedMenu.length < INITIAL_MENU_ITEMS.length) {
        this.menu = [...INITIAL_MENU_ITEMS];
        this.save('cantenex_menu', this.menu);
      } else {
        this.menu = savedMenu;
      }
      this.orders = this.load('cantenex_orders', INITIAL_ORDERS);
      this.reviews = this.load('cantenex_reviews', INITIAL_REVIEWS);
      this.cart = this.load('cantenex_cart', []);
      this.selectedSlot = this.load('cantenex_slot', PICKUP_SLOTS[0]);
      this.activeTrackingId = this.load('cantenex_active_tracking', this.orders[0]?.id || 'CX-1021');
      this.currentUser = this.load('cantenex_user', {
        name: 'Dinesh C',
        regNo: '22BCS142',
        department: 'Computer Science & Engineering',
        role: 'student',
      });
      if (this.currentUser && this.currentUser.name === 'Aravind Swaminathan') {
        this.currentUser.name = 'Dinesh C';
        this.save('cantenex_user', this.currentUser);
      }
      this.orders.forEach(o => {
        if (o.studentName === 'Aravind Swaminathan') o.studentName = 'Dinesh C';
      });
      this.save('cantenex_orders', this.orders);

      window.addEventListener('storage', (e) => {
        if (e.key === 'cantenex_orders') {
          this.orders = this.load('cantenex_orders', INITIAL_ORDERS);
          this.notify('orders');
        }
        if (e.key === 'cantenex_menu') {
          this.menu = this.load('cantenex_menu', INITIAL_MENU_ITEMS);
          this.notify('menu');
        }
        if (e.key === 'cantenex_reviews') {
          this.reviews = this.load('cantenex_reviews', INITIAL_REVIEWS);
          this.notify('reviews');
        }
      });
    }

    load(key, fallback) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    save(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    }

    subscribe(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }

    notify(event, payload) {
      this.listeners.forEach((cb) => cb(event, payload));
    }

    addToCart(item, quantity = 1) {
      const existing = this.cart.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          prepTime: item.prepTime,
          diet: item.diet,
          quantity,
        });
      }
      this.save('cantenex_cart', this.cart);
      this.notify('cart');
    }

    updateCartQuantity(id, quantity) {
      if (quantity <= 0) {
        this.cart = this.cart.filter((i) => i.id !== id);
      } else {
        const item = this.cart.find((i) => i.id === id);
        if (item) item.quantity = quantity;
      }
      this.save('cantenex_cart', this.cart);
      this.notify('cart');
    }

    clearCart() {
      this.cart = [];
      this.save('cantenex_cart', this.cart);
      this.notify('cart');
    }

    getCartSubtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getCartCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    setPickupSlot(slot) {
      this.selectedSlot = slot;
      this.save('cantenex_slot', this.selectedSlot);
      this.notify('slot');
    }

    setActiveTrackingId(id) {
      this.activeTrackingId = id;
      this.save('cantenex_active_tracking', this.activeTrackingId);
      this.notify('orders');
    }

    addReview({ menuId, studentName, rating, comment }) {
      const newRev = {
        id: `rev-${Date.now()}`,
        menuId,
        studentName: studentName || this.currentUser.name,
        rating: Number(rating) || 5,
        comment: comment || 'Delicious and fresh!',
        date: 'Just now',
        timestamp: Date.now(),
      };

      this.reviews.unshift(newRev);
      this.save('cantenex_reviews', this.reviews);

      // Recalculate average rating for menu item
      const dishReviews = this.reviews.filter((r) => r.menuId === menuId);
      if (dishReviews.length > 0) {
        const avg = dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length;
        const item = this.menu.find((i) => i.id === menuId);
        if (item) {
          item.rating = parseFloat(avg.toFixed(1));
          this.save('cantenex_menu', this.menu);
        }
      }

      this.notify('menu');
      this.notify('reviews', newRev);
      return newRev;
    }

    getReviews(menuId) {
      return this.reviews.filter((r) => r.menuId === menuId);
    }

    placeOrder({ studentName, regNo, department, paymentMethod }) {
      if (this.cart.length === 0) return null;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `CX-${randomNum}`;
      
      const hasDosa = this.cart.some((i) => i.id === 'cx-01' || i.id === 'cx-02');
      const hasDrinkOnly = this.cart.every((i) => i.diet === 'veg' && (i.id.includes('11') || i.id.includes('12') || i.id.includes('13') || i.id.includes('14')));
      
      let counter = 'Counter 2 (Hot Express)';
      if (hasDosa) counter = 'Counter 1 (Tiffin & Dosa)';
      else if (hasDrinkOnly) counter = 'Counter 4 (Beverage Bar)';

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newOrder = {
        id: orderId,
        studentName: studentName || this.currentUser.name,
        regNo: regNo || this.currentUser.regNo,
        department: department || this.currentUser.department,
        items: [...this.cart],
        totalAmount: this.getCartSubtotal(),
        pickupSlot: this.selectedSlot.label,
        pickupType: this.selectedSlot.type,
        paymentMethod,
        status: 'PLACED',
        counter,
        placedAt: timeStr,
        prepProgress: 15,
        timestamp: Date.now(),
      };

      this.orders.unshift(newOrder);
      this.save('cantenex_orders', this.orders);
      
      this.activeTrackingId = orderId;
      this.save('cantenex_active_tracking', this.activeTrackingId);

      this.currentUser = {
        ...this.currentUser,
        name: studentName,
        regNo,
        department,
      };
      this.save('cantenex_user', this.currentUser);

      this.clearCart();
      this.notify('orders');
      this.notify('order_placed', newOrder);
      return newOrder;
    }

    updateOrderStatus(orderId, nextStatus) {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = nextStatus;
        if (nextStatus === 'PLACED') order.prepProgress = 15;
        if (nextStatus === 'ACCEPTED') order.prepProgress = 35;
        if (nextStatus === 'PREPARING') order.prepProgress = 65;
        if (nextStatus === 'READY') {
          order.prepProgress = 95;
          sounds.speakAnnouncement(`Order token ${order.id} is ready for pickup at ${order.counter}`);
        }
        if (nextStatus === 'COMPLETED') order.prepProgress = 100;
        
        this.save('cantenex_orders', this.orders);
        this.notify('orders');
        this.notify('order_updated', order);
      }
    }

    toggleItemStock(itemId) {
      const item = this.menu.find((i) => i.id === itemId);
      if (item) {
        item.inStock = !item.inStock;
        this.save('cantenex_menu', this.menu);
        this.notify('menu');
      }
    }

    updateItemPrice(itemId, newPrice) {
      const item = this.menu.find((i) => i.id === itemId);
      if (item && newPrice > 0) {
        item.price = Number(newPrice);
        this.save('cantenex_menu', this.menu);
        this.notify('menu');
      }
    }

    resetDemoData() {
      this.menu = [...INITIAL_MENU_ITEMS];
      this.orders = [...INITIAL_ORDERS];
      this.reviews = [...INITIAL_REVIEWS];
      this.cart = [];
      this.save('cantenex_menu', this.menu);
      this.save('cantenex_orders', this.orders);
      this.save('cantenex_reviews', this.reviews);
      this.save('cantenex_cart', this.cart);
      this.activeTrackingId = 'CX-1021';
      this.save('cantenex_active_tracking', this.activeTrackingId);
      this.notify('menu');
      this.notify('orders');
      this.notify('reviews');
      this.notify('cart');
    }

    getRealMetrics() {
      const todayTotal = this.orders.length;
      const activeTokens = this.orders.filter((o) => o.status !== 'COMPLETED').length;
      const inPrep = this.orders.filter((o) => o.status === 'PREPARING' || o.status === 'ACCEPTED').length;
      const readyCount = this.orders.filter((o) => o.status === 'READY').length;
      const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      
      return {
        todayTotal,
        activeTokens,
        inPrep,
        readyCount,
        totalRevenue,
      };
    }

    executeSQL(rawSql) {
      const sql = rawSql.trim().replace(/;$/, '');
      const lower = sql.toLowerCase();
      
      if (lower.startsWith('select')) {
        if (lower.includes('from orders')) {
          if (lower.includes('group by')) {
            const groups = {};
            this.orders.forEach((o) => {
              const key = o.regNo;
              if (!groups[key]) {
                groups[key] = { student_name: o.studentName, reg_no: o.regNo, total_orders: 0, total_spent: 0 };
              }
              groups[key].total_orders += 1;
              groups[key].total_spent += o.totalAmount;
            });
            const rows = Object.values(groups);
            return { columns: ['student_name', 'reg_no', 'total_orders', 'total_spent (₹)'], rows: rows.map(r => Object.values(r)), count: rows.length };
          }
          const rows = this.orders.map(o => [o.id, o.studentName, o.regNo, o.department, `₹${o.totalAmount}`, o.pickupSlot, o.status, o.counter, o.placedAt]);
          return {
            columns: ['id', 'student_name', 'reg_no', 'department', 'total_amount', 'pickup_slot', 'status', 'counter', 'placed_at'],
            rows,
            count: rows.length
          };
        }

        if (lower.includes('from menu_items')) {
          if (lower.includes('group by category')) {
            const groups = {};
            this.menu.forEach((m) => {
              if (!groups[m.category]) {
                groups[m.category] = { category: m.category, count: 0, sum: 0 };
              }
              groups[m.category].count += 1;
              groups[m.category].sum += m.price;
            });
            const rows = Object.values(groups).map(g => [g.category, g.count, `₹${(g.sum / g.count).toFixed(2)}`]);
            return { columns: ['category', 'item_count', 'avg_price'], rows, count: rows.length };
          }

          let items = this.menu;
          if (lower.includes('where in_stock = 1')) {
            items = items.filter(m => m.inStock);
          }
          const rows = items.map(m => [m.id, m.code, m.name, m.category, `₹${m.price}`, m.prepTime, m.diet, m.inStock ? '1 (In Stock)' : '0 (Sold Out)', m.rating]);
          return {
            columns: ['id', 'code', 'name', 'category', 'price', 'prep_time', 'diet', 'in_stock', 'rating'],
            rows,
            count: rows.length
          };
        }

        if (lower.includes('from order_items')) {
          const rows = [];
          this.orders.forEach(o => {
            o.items.forEach(i => {
              rows.push([o.id, i.id, i.name, `₹${i.price}`, i.quantity, `₹${i.price * i.quantity}`]);
            });
          });
          return {
            columns: ['order_id', 'menu_id', 'item_name', 'unit_price', 'quantity', 'line_total'],
            rows,
            count: rows.length
          };
        }

        if (lower.includes('from dish_reviews')) {
          const rows = this.reviews.map(r => [r.id, r.menuId, r.studentName, `${r.rating} ⭐`, r.comment, r.date]);
          return {
            columns: ['id', 'menu_id', 'student_name', 'rating', 'comment', 'created_at'],
            rows,
            count: rows.length
          };
        }

        if (lower.includes('from students')) {
          const rows = [
            ['22BCS142', 'Dinesh C', 'Computer Science & Engineering', '2026-09-01 08:30:00'],
            ['23BIT089', 'Sneha Rangarajan', 'Information Technology', '2026-09-01 08:45:00'],
            ['21BME205', 'Rohan Deshmukh', 'Mechanical Engineering', '2026-09-01 09:15:00'],
            ['24BAI017', 'Kavya Sree', 'Artificial Intelligence & DS', '2026-09-01 10:00:00'],
          ];
          return { columns: ['reg_no', 'name', 'department', 'created_at'], rows, count: rows.length };
        }
      }

      throw new Error(`Unsupported SQL syntax in parser. Try: SELECT * FROM orders; OR SELECT * FROM menu_items; OR SELECT * FROM dish_reviews;`);
    }
  }
  const store = new Store();

  function generateQRCodeSVG(text, size = 160) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    
    const matrixSize = 21;
    const cellSize = size / matrixSize;
    let rects = '';

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        const isTopLeftCorner = (r < 7 && c < 7) && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        const isTopRightCorner = (r < 7 && c >= 14) && (r === 0 || r === 6 || c === 14 || c === 20 || (r >= 2 && r <= 4 && c >= 16 && c <= 18));
        const isBottomLeftCorner = (r >= 14 && c < 7) && (r === 14 || r === 20 || c === 0 || c === 6 || (r >= 16 && r <= 18 && c >= 2 && c <= 4));
        
        const isMarkerSpace = (r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8);
        
        let isFilled = false;
        if (isTopLeftCorner || isTopRightCorner || isBottomLeftCorner) {
          isFilled = true;
        } else if (!isMarkerSpace) {
          const seed = Math.sin(hash + r * 13 + c * 37) * 10000;
          isFilled = (seed - Math.floor(seed)) > 0.45;
        }

        if (isFilled) {
          rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#0F0F10" />`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="qr-svg-code">${rects}</svg>`;
  }

  /* ==========================================================================
     4. 3D DEPTH ENGINE
     ========================================================================== */
  function init3DDepth() {
    const container = document.getElementById('hero-3d-stage');
    const foodCard = document.getElementById('hero-food-plate');
    const lightGlow = document.getElementById('hero-light-glow');
    const badges = document.querySelectorAll('.hero-depth-layer');

    if (!container || !foodCard) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isHovered = false;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;
      
      targetRotateY = normX * 12;
      targetRotateX = -normY * 12;
      
      mouseX = normX;
      mouseY = normY;
    };

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotateX = 0;
      targetRotateY = 0;
      mouseX = 0;
      mouseY = 0;
    });

    function animate() {
      const ease = 0.08;
      currentRotateX += (targetRotateX - currentRotateX) * ease;
      currentRotateY += (targetRotateY - currentRotateY) * ease;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      foodCard.style.transform = `perspective(1200px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(20px) scale(${isHovered ? 1.03 : 1})`;
      
      if (lightGlow) {
        const glowX = 50 + currentX * 30;
        const glowY = 50 + currentY * 30;
        lightGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 170, 100, 0.28) 0%, rgba(224, 83, 50, 0.08) 45%, transparent 70%)`;
      }

      badges.forEach((badge) => {
        const depth = parseFloat(badge.getAttribute('data-depth') || '0.5');
        const offsetX = currentX * 30 * depth;
        const offsetY = currentY * 25 * depth;
        const zDepth = depth * 40;
        badge.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${zDepth}px)`;
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* ==========================================================================
     5. MAIN CONTROLLER & ALL BUTTON EVENT BINDINGS
     ========================================================================== */
  let activeCategory = 'ALL';
  let activeDiet = 'ALL';
  let activeSort = 'popular';
  let searchQuery = '';
  let pendingCheckoutData = null;

  function initApp() {
    init3DDepth();
    initHeader();
    renderMenu();
    renderCartDrawer();
    renderTrackingView();
    renderAdminView();
    bindFiltersAndSearch();
    bindQuickChips();
    bindCartEvents();
    bindCheckoutModal();
    bindAdminEvents();
    bindLegalModals();
    bindSQLiteStudio();
    bindTrackingLookup();
    bindDishSpotlightModal();
    bindUPISimulator();
    bindReceiptPrint();
    bindKioskModal();
    initKioskClock();

    store.subscribe((event) => {
      updateCartBadge();
      if (event === 'cart' || event === 'slot') {
        renderCartDrawer();
      }
      if (event === 'menu' || event === 'reviews') {
        renderMenu();
        if (document.getElementById('admin-view').classList.contains('active')) {
          renderAdminMenuTable();
        }
      }
      if (event === 'orders' || event === 'order_updated' || event === 'order_placed') {
        renderTrackingView();
        renderAdminView();
        renderKioskBoard();
        updateHeroLiveStatus();
      }
    });

    updateCartBadge();
    updateHeroLiveStatus();
  }

  function initHeader() {
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    const logo = document.getElementById('nav-brand-logo');
    if (logo) {
      logo.addEventListener('click', () => {
        const adminView = document.getElementById('admin-view');
        if (adminView && adminView.classList.contains('active')) {
          toggleAdminView();
        }
      });
    }

    const soundBtn = document.getElementById('btn-toggle-sound');
    const soundLabel = document.getElementById('sound-toggle-label');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = sounds.toggle();
        if (soundLabel) {
          soundLabel.innerText = isEnabled ? 'Audio: ON' : 'Audio: MUTED';
        }
        soundBtn.style.color = isEnabled ? '#4ADE80' : '#8E8E98';
        soundBtn.style.borderColor = isEnabled ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255,255,255,0.1)';
      });
    }

    const adminBtn = document.getElementById('btn-toggle-admin');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        sounds.playClick();
        toggleAdminView();
      });
    }
  }

  function updateHeroLiveStatus() {
    const metrics = store.getRealMetrics();
    const queueEl = document.getElementById('live-queue-count');
    if (queueEl) {
      queueEl.innerText = `${metrics.activeTokens} Active Orders`;
    }
  }

  function bindFiltersAndSearch() {
    const tabs = document.querySelectorAll('.tab-pill');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        sounds.playClick();
        tabs.forEach((t) => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeCategory = e.currentTarget.getAttribute('data-category');
        renderMenu();
      });
    });

    const searchInput = document.getElementById('menu-search-input') || document.getElementById('menu-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderMenu();
      });
    }

    const dietPills = document.querySelectorAll('.diet-pill');
    dietPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        sounds.playClick();
        dietPills.forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeDiet = e.currentTarget.getAttribute('data-diet');
        renderMenu();
      });
    });

    const sortSelect = document.getElementById('menu-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sounds.playClick();
        activeSort = e.target.value;
        renderMenu();
      });
    }
  }

  function bindQuickChips() {
    const chips = document.querySelectorAll('.quick-chip');
    const searchInput = document.getElementById('menu-search-input') || document.getElementById('menu-search');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        sounds.playClick();
        const query = chip.getAttribute('data-query');
        if (searchInput && query) {
          searchInput.value = query;
          searchQuery = query.toLowerCase();
          renderMenu();
          showToast('Trending Filter', `Showing campus results for "${query}"`, 'info');
        }
      });
    });
  }

  function renderMenu() {
    const container = document.getElementById('menu-catalogue-container') || document.getElementById('menu-items-grid');
    if (!container) return;

    // Update dynamic category tab counts
    const countAll = document.getElementById('count-all');
    const countBreakfast = document.getElementById('count-breakfast');
    const countMeals = document.getElementById('count-meals');
    const countSnacks = document.getElementById('count-snacks');
    const countDrinks = document.getElementById('count-drinks');
    const countDesserts = document.getElementById('count-desserts');

    if (countAll) countAll.innerText = store.menu.length;
    if (countBreakfast) countBreakfast.innerText = store.menu.filter(i => i.category === 'BREAKFAST').length;
    if (countMeals) countMeals.innerText = store.menu.filter(i => i.category === 'MEALS').length;
    if (countSnacks) countSnacks.innerText = store.menu.filter(i => i.category === 'SNACKS').length;
    if (countDrinks) countDrinks.innerText = store.menu.filter(i => i.category === 'DRINKS').length;
    if (countDesserts) countDesserts.innerText = store.menu.filter(i => i.category === 'DESSERTS').length;

    let items = [...store.menu];

    // Category filter
    if (activeCategory !== 'ALL') {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Dietary filter
    if (activeDiet !== 'ALL') {
      items = items.filter((item) => item.diet === activeDiet);
    }

    // Search query filter
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery) ||
          (item.tag && item.tag.toLowerCase().includes(searchQuery))
      );
    }

    // Sorting
    if (activeSort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeSort === 'prep') {
      items.sort((a, b) => parseInt(a.prepTime || '10') - parseInt(b.prepTime || '10'));
    } else {
      // Default / popular: highlights first, then highest rating
      items.sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
    }

    // Update results counter
    const resultsCountEl = document.getElementById('menu-results-count');
    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Showing <strong>${items.length}</strong> campus dishes`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dark-muted);">
          <p style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-dark-primary);">No Canteen Specialties Found</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try adjusting your search query, dietary filter, or break category.</p>
        </div>
      `;
      return;
    }

    let html = '';
    items.forEach((item) => {
      const spiceIndicator = item.spiceLevel > 0 ? `<span class="dish-spice-indicator" title="Spice level: ${item.spiceLevel}">${'🌶️'.repeat(item.spiceLevel)}</span>` : '';
      const tagBadge = item.tag ? `<span class="dish-tag-badge">${item.tag}</span>` : '';

      html += `
        <div class="menu-item-row" data-id="${item.id}">
          <div class="dish-thumb" data-action="open-spotlight" data-id="${item.id}" style="cursor: pointer;">
            <span class="dish-diet-indicator ${item.diet}"></span>
            <img src="${item.image}" alt="${item.name}" onerror="this.src='${item.fallbackImage}'" loading="lazy">
          </div>
          <div class="dish-details">
            <div>
              <div class="dish-top-meta">
                <span class="dish-code">#${item.code}</span>
                <span class="dish-prep-time">⏱️ ${item.prepTime} • ⭐ ${item.rating || 5.0}</span>
              </div>
              ${tagBadge}
              <h3 class="dish-title" data-action="open-spotlight" data-id="${item.id}" style="cursor: pointer;">${item.name}</h3>
              <p class="dish-desc-short">${item.description}</p>
              <div class="dish-card-quick-meta">
                <span class="dish-macro-pill">${item.calories || '300 kcal'}</span>
                <span class="dish-macro-pill">${item.protein || '8g'} Protein</span>
                ${spiceIndicator}
              </div>
            </div>
            <div class="dish-bottom-bar">
              <span class="dish-price-tag">₹${item.price}</span>
              <button class="btn-add-tray ${!item.inStock ? 'sold-out' : ''}" data-action="add-item" data-id="${item.id}" ${!item.inStock ? 'disabled' : ''}>
                ${item.inStock ? `+ Add To Tray` : `Sold Out`}
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-action="add-item"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        const item = store.menu.find((i) => i.id === id);
        if (item && item.inStock) {
          sounds.playAdd();
          store.addToCart(item);
          triggerAddAnimation(e.currentTarget);
          showToast('Added to Tray', `${item.name} (₹${item.price}) added`, 'success');
        }
      });
    });

    container.querySelectorAll('[data-action="open-spotlight"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = store.menu.find((i) => i.id === id);
        if (item) {
          sounds.playClick();
          openDishSpotlight(item);
        }
      });
    });
  }

  let selectedSpotlightRating = 5;

  function openDishSpotlight(item) {
    const modal = document.getElementById('dish-modal');
    const body = document.getElementById('dish-spotlight-body');
    if (!modal || !body) return;

    selectedSpotlightRating = 5;
    const reviews = store.getReviews(item.id);

    const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
      <div class="review-item-card">
        <div class="review-item-header">
          <span class="review-author">${r.studentName}</span>
          <span class="review-time">${r.date} • ${'⭐'.repeat(r.rating)}</span>
        </div>
        <div class="review-comment">${r.comment}</div>
      </div>
    `).join('') : `<p style="font-size: 0.8rem; color: var(--text-light-muted); margin-bottom: 0.75rem;">Be the first student to review this recipe!</p>`;

    body.innerHTML = `
      <div class="dish-spotlight-img">
        <img src="${item.image}" alt="${item.name}">
        <div style="position: absolute; top: 1rem; left: 1rem; background: ${item.diet === 'veg' ? '#22C55E' : '#EF4444'}; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 0.3rem 0.75rem; border-radius: 9999px; text-transform: uppercase;">
          ${item.diet === 'veg' ? '🟢 Pure Vegetarian' : '🔴 Non-Vegetarian'}
        </div>
      </div>
      <div class="dish-spotlight-content" style="max-height: 85vh; overflow-y: auto;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="editorial-tag" style="color: var(--color-ochre);">INDEX #${item.code} • ${item.category} • ⭐ ${item.rating || 5.0}</span>
            <button id="btn-close-spotlight" style="color: #A6A6B0; font-size: 1.25rem;">✕</button>
          </div>
          <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 0.75rem;">${item.name}</h2>
          <p style="font-size: 0.92rem; color: #C7BDB8; line-height: 1.6; margin-bottom: 1.25rem;">${item.description}</p>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin-bottom: 1.5rem;">
            <div class="nutrient-pill"><div class="val">${item.calories || '320 kcal'}</div><div class="lbl">Energy</div></div>
            <div class="nutrient-pill"><div class="val">${item.protein || '12g'}</div><div class="lbl">Protein</div></div>
            <div class="nutrient-pill"><div class="val">${item.carbs || '45g'}</div><div class="lbl">Carbs</div></div>
            <div class="nutrient-pill"><div class="val">${item.prepTime}</div><div class="lbl">Prep Time</div></div>
          </div>
        </div>

        <!-- Student Community Reviews Section -->
        <div class="dish-reviews-container">
          <div class="dish-reviews-header">
            <h4 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #fff; text-transform: uppercase;">Student Reviews (${reviews.length})</h4>
            <span style="font-size: 0.78rem; font-weight: 700; color: #FBBF24;">⭐ ${item.rating || 5.0} Average</span>
          </div>

          <div id="spotlight-reviews-list" style="max-height: 140px; overflow-y: auto; margin-bottom: 1rem;">
            ${reviewsHtml}
          </div>

          <!-- Interactive Rating & Review Form -->
          <div style="background: #14141B; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.85rem;">
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--color-ochre); text-transform: uppercase; margin-bottom: 0.4rem;">Leave a Student Rating</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <div class="rating-stars-input" id="star-picker-container">
                <button class="rating-star-btn active" data-star="1">★</button>
                <button class="rating-star-btn active" data-star="2">★</button>
                <button class="rating-star-btn active" data-star="3">★</button>
                <button class="rating-star-btn active" data-star="4">★</button>
                <button class="rating-star-btn active" data-star="5">★</button>
              </div>
              <span style="font-size: 0.75rem; color: var(--text-light-muted);" id="rating-star-label">5 Stars (Excellent)</span>
            </div>
            <input type="text" id="review-comment-input" placeholder="What did you think of this dish? (e.g. Perfectly spiced!)" style="width: 100%; padding: 0.5rem 0.75rem; background: #0A0A0E; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #fff; font-size: 0.82rem; margin-bottom: 0.5rem;">
            <button id="btn-submit-review" style="padding: 0.45rem 0.9rem; font-size: 0.75rem; font-weight: 700; background: var(--color-terracotta); color: #fff; border-radius: 6px; width: 100%;">Submit Feedback</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 1rem;">
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #fff;">₹${item.price}</div>
          <button id="btn-spotlight-add" class="btn-primary-editorial" ${!item.inStock ? 'disabled' : ''}>
            <span>${item.inStock ? 'Add To My Tray' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    // Star Picker click events
    const starBtns = body.querySelectorAll('.rating-star-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rating = Number(e.currentTarget.getAttribute('data-star'));
        selectedSpotlightRating = rating;
        starBtns.forEach((b, idx) => {
          if (idx < rating) b.classList.add('active');
          else b.classList.remove('active');
        });
        const starLabels = ['', '1 Star (Needs Improvement)', '2 Stars (Fair)', '3 Stars (Good)', '4 Stars (Very Good)', '5 Stars (Excellent)'];
        const labelEl = document.getElementById('rating-star-label');
        if (labelEl) labelEl.innerText = starLabels[rating];
      });
    });

    // Review Submit handler
    const submitReviewBtn = document.getElementById('btn-submit-review');
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', () => {
        const commentInput = document.getElementById('review-comment-input');
        const comment = commentInput?.value.trim() || 'Delicious and freshly made!';
        sounds.playChime();
        store.addReview({
          menuId: item.id,
          studentName: `${store.currentUser.name} (${store.currentUser.department.split(' ')[0]})`,
          rating: selectedSpotlightRating,
          comment,
        });
        showToast('Review Submitted', `Thank you for reviewing ${item.name}!`, 'success');
        openDishSpotlight(item); // Re-render spotlight with new review
      });
    }

    document.getElementById('btn-close-spotlight')?.addEventListener('click', () => {
      sounds.playClick();
      modal.classList.remove('active');
    });

    document.getElementById('btn-spotlight-add')?.addEventListener('click', (e) => {
      if (item.inStock) {
        sounds.playAdd();
        store.addToCart(item);
        triggerAddAnimation(e.currentTarget);
        showToast('Added to Tray', `${item.name} (₹${item.price}) added`, 'success');
        setTimeout(() => modal.classList.remove('active'), 500);
      }
    });
  }

  function bindDishSpotlightModal() {
    const modal = document.getElementById('dish-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  }

  function triggerAddAnimation(btn) {
    const originalText = btn.innerText;
    btn.innerText = 'Added ✓';
    btn.style.background = 'var(--color-green-veg)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 900);
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge-count');
    const count = store.getCartCount();
    if (badge) {
      badge.innerText = count;
      badge.style.transform = 'scale(1.35)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 200);
    }
  }

  function showToast(title, msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: '✓',
      info: '💡',
      error: '✕',
      tray: '🍱'
    };

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '✨'}</div>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${msg}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">✕</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 3500);
  }

  function bindCartEvents() {
    const trigger = document.getElementById('btn-open-cart');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('btn-close-cart');
    const proceedBtn = document.getElementById('btn-cart-checkout');

    if (trigger && overlay) {
      trigger.addEventListener('click', () => {
        sounds.playClick();
        overlay.classList.add('open');
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => {
        sounds.playClick();
        overlay.classList.remove('open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    }

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (store.cart.length === 0) return;
        sounds.playClick();
        overlay.classList.remove('open');
        openCheckoutModal();
      });
    }

    const clearBtn = document.getElementById('btn-clear-tray-action');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (store.cart.length === 0) return;
        sounds.playClick();
        store.clearCart();
        showToast('Tray Cleared', 'All items removed from your tray', 'info');
      });
    }
  }

  function renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    const checkoutBtn = document.getElementById('btn-cart-checkout');
    const slotSelect = document.getElementById('cart-slot-select');

    if (!itemsContainer) return;

    if (slotSelect) {
      slotSelect.innerHTML = PICKUP_SLOTS.map(
        (slot) => `<option value="${slot.id}" ${store.selectedSlot.id === slot.id ? 'selected' : ''}>${slot.label}</option>`
      ).join('');

      slotSelect.onchange = (e) => {
        const selected = PICKUP_SLOTS.find((s) => s.id === e.target.value);
        if (selected) store.setPickupSlot(selected);
      };
    }

    const estimateBanner = document.getElementById('cart-prep-estimate-banner');
    const estimateText = document.getElementById('cart-prep-time-text');

    if (store.cart.length === 0) {
      if (estimateBanner) estimateBanner.style.display = 'none';
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-light-muted);">
          <p style="font-family: var(--font-display); font-size: 1.1rem; text-transform: uppercase; color: var(--text-light-secondary); margin-bottom: 0.5rem;">Your Tray Is Empty</p>
          <p style="font-size: 0.85rem;">Select your break refreshments from the menu to pre-order with zero wait time.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.innerText = '₹0';
      if (totalEl) totalEl.innerText = '₹0';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
      }
      return;
    }

    if (estimateBanner && estimateText) {
      estimateBanner.style.display = 'flex';
      const prepMinutes = store.cart.map((i) => parseInt(i.prepTime || '8', 10));
      const maxPrep = Math.max(...prepMinutes, 5);
      const totalQty = store.cart.reduce((s, i) => s + i.quantity, 0);
      estimateText.innerText = `Estimated Kitchen Express Prep: ~${maxPrep} Mins (${totalQty} Items)`;
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
    }

    let html = '';
    store.cart.forEach((item) => {
      html += `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4 class="title">${item.name}</h4>
            <span class="price">₹${item.price * item.quantity}</span>
          </div>
          <div class="quantity-stepper">
            <button data-action="dec-qty" data-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button data-action="inc-qty" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
    });

    itemsContainer.innerHTML = html;

    const subtotal = store.getCartSubtotal();
    if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
    if (totalEl) totalEl.innerText = `₹${subtotal}`;

    itemsContainer.querySelectorAll('[data-action="dec-qty"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const id = e.currentTarget.getAttribute('data-id');
        const item = store.cart.find((i) => i.id === id);
        if (item) store.updateCartQuantity(id, item.quantity - 1);
      });
    });

    itemsContainer.querySelectorAll('[data-action="inc-qty"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const id = e.currentTarget.getAttribute('data-id');
        const item = store.cart.find((i) => i.id === id);
        if (item) store.updateCartQuantity(id, item.quantity + 1);
      });
    });
  }

  function bindCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.getElementById('btn-close-checkout');
    const confirmBtn = document.getElementById('btn-confirm-order');
    const deptSelect = document.getElementById('checkout-dept');

    if (deptSelect) {
      deptSelect.innerHTML = DEPARTMENTS.map((d) => `<option value="${d}">${d}</option>`).join('');
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        sounds.playClick();
        modal.classList.remove('active');
      });
    }

    const presetBtns = document.querySelectorAll('.student-quick-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        presetBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const nameInput = document.getElementById('checkout-name');
        const regInput = document.getElementById('checkout-regno');
        const deptSelect = document.getElementById('checkout-dept');

        if (nameInput) nameInput.value = e.currentTarget.getAttribute('data-name');
        if (regInput) regInput.value = e.currentTarget.getAttribute('data-reg');
        if (deptSelect) deptSelect.value = e.currentTarget.getAttribute('data-dept');
      });
    });

    const payCards = document.querySelectorAll('.payment-card-select');
    payCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        sounds.playClick();
        payCards.forEach((c) => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
      });
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        handleOrderSubmission();
      });
    }

    const trackBtn = document.getElementById('btn-confirm-to-tracking');
    const confirmModal = document.getElementById('order-confirmed-modal');
    if (trackBtn && confirmModal) {
      trackBtn.addEventListener('click', () => {
        sounds.playClick();
        confirmModal.classList.remove('active');
        const trackSection = document.getElementById('tracking');
        if (trackSection) {
          trackSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const nameInput = document.getElementById('checkout-name');
    const regInput = document.getElementById('checkout-regno');
    const deptSelect = document.getElementById('checkout-dept');
    const slotDisplay = document.getElementById('checkout-slot-display');
    const summaryList = document.getElementById('checkout-summary-items');
    const totalDisplay = document.getElementById('checkout-total-display');

    if (nameInput) nameInput.value = store.currentUser.name;
    if (regInput) regInput.value = store.currentUser.regNo;
    if (deptSelect) deptSelect.value = store.currentUser.department;
    if (slotDisplay) slotDisplay.innerText = store.selectedSlot.label;

    if (summaryList) {
      summaryList.innerHTML = store.cart.map((item) => `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-light-secondary);">
          <span>${item.quantity}x ${item.name}</span>
          <span style="color: #fff; font-weight: 700;">₹${item.price * item.quantity}</span>
        </div>
      `).join('');
    }

    if (totalDisplay) {
      totalDisplay.innerText = `₹${store.getCartSubtotal()}`;
    }

    modal.classList.add('active');
  }

  function handleOrderSubmission() {
    const nameInput = document.getElementById('checkout-name');
    const regInput = document.getElementById('checkout-regno');
    const deptSelect = document.getElementById('checkout-dept');
    const selectedPay = document.querySelector('.payment-card-select.selected');

    const studentName = nameInput?.value.trim() || 'Campus Student';
    const regNo = regInput?.value.trim() || '23BCS100';
    const department = deptSelect?.value || 'Computer Science & Engineering';
    const isUPI = selectedPay?.getAttribute('data-method') === 'upi';

    pendingCheckoutData = {
      studentName,
      regNo,
      department,
      paymentMethod: isUPI ? 'UPI Demo (Verified)' : 'Cash at Counter',
    };

    if (isUPI) {
      sounds.playClick();
      const checkoutModal = document.getElementById('checkout-modal');
      if (checkoutModal) checkoutModal.classList.remove('active');
      openUPISimulator();
    } else {
      finalizeOrderPlacement();
    }
  }

  function openUPISimulator() {
    const upiModal = document.getElementById('upi-modal');
    const amtEl = document.getElementById('upi-modal-amount');
    const qrBox = document.getElementById('upi-qr-box');
    const total = store.getCartSubtotal();

    if (amtEl) amtEl.innerText = `₹${total}`;
    if (qrBox) qrBox.innerHTML = generateQRCodeSVG(`upi://pay?pa=cantenex@campusbank&pn=CantenexCentralCanteen&am=${total}&cu=INR`, 160);
    if (upiModal) upiModal.classList.add('active');
  }

  function bindUPISimulator() {
    const upiModal = document.getElementById('upi-modal');
    const closeBtn = document.getElementById('btn-close-upi');
    const approveBtn = document.getElementById('btn-simulate-upi-success');

    if (closeBtn && upiModal) {
      closeBtn.addEventListener('click', () => {
        sounds.playClick();
        upiModal.classList.remove('active');
      });
    }

    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        sounds.playSuccess();
        approveBtn.innerHTML = '<span>Verifying Transaction... ✓</span>';
        setTimeout(() => {
          if (upiModal) upiModal.classList.remove('active');
          approveBtn.innerHTML = '<span>Approve Simulated Payment (₹)</span>';
          finalizeOrderPlacement();
        }, 700);
      });
    }
  }

  function finalizeOrderPlacement() {
    if (!pendingCheckoutData) return;
    const order = store.placeOrder(pendingCheckoutData);
    if (!order) return;

    sounds.playSuccess();
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.classList.remove('active');

    showConfirmationScreen(order);
    showToast('Order Transmitted!', `Token #${order.id} generated for ${order.pickupSlot}`, 'success');
  }

  function showConfirmationScreen(order) {
    const modal = document.getElementById('order-confirmed-modal');
    const tokenEl = document.getElementById('confirm-token-id');
    const slotEl = document.getElementById('confirm-slot-time');
    const counterEl = document.getElementById('confirm-counter-no');
    const qrEl = document.getElementById('confirm-qr-container');

    if (tokenEl) tokenEl.innerText = order.id;
    if (slotEl) slotEl.innerText = order.pickupSlot;
    if (counterEl) counterEl.innerText = order.counter;
    if (qrEl) qrEl.innerHTML = generateQRCodeSVG(order.id, 150);

    if (modal) modal.classList.add('active');
  }

  function bindReceiptPrint() {
    const printBtn = document.getElementById('btn-print-token');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        sounds.playClick();
        const activeOrder = store.orders.find((o) => o.id === store.activeTrackingId) || store.orders[0];
        if (!activeOrder) return;

        const receiptEl = document.getElementById('printable-receipt');
        if (receiptEl) {
          receiptEl.innerHTML = `
            <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <h2 style="margin: 0; font-size: 1.4rem;">CANTENEX</h2>
              <p style="margin: 0; font-size: 0.75rem;">Central Campus Dining • University Food Court</p>
              <h1 style="margin: 0.4rem 0; font-size: 1.8rem;">TOKEN: ${activeOrder.id}</h1>
              <p style="margin: 0; font-weight: bold;">${activeOrder.counter}</p>
            </div>
            <div style="font-size: 0.8rem; line-height: 1.4; border-bottom: 1px dashed #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <div>Student: <strong>${activeOrder.studentName}</strong> (${activeOrder.regNo})</div>
              <div>Dept: ${activeOrder.department}</div>
              <div>Slot: <strong>${activeOrder.pickupSlot}</strong></div>
              <div>Placed: ${activeOrder.placedAt} | ${activeOrder.paymentMethod}</div>
            </div>
            <div style="font-size: 0.8rem; border-bottom: 1px dashed #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              ${activeOrder.items.map(i => `<div style="display: flex; justify-content: space-between;"><span>${i.quantity}x ${i.name}</span><span>₹${i.price * i.quantity}</span></div>`).join('')}
              <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 0.3rem;"><span>TOTAL PAID</span><span>₹${activeOrder.totalAmount}</span></div>
            </div>
            <div style="text-align: center; padding-top: 0.5rem;">
              ${generateQRCodeSVG(activeOrder.id, 120)}
              <p style="font-size: 0.7rem; margin-top: 0.3rem;">Scan this QR at counter for instant tray collection.</p>
            </div>
          `;
          window.print();
        }
      });
    }
  }

  function bindTrackingLookup() {
    const searchBtn = document.getElementById('btn-search-token');
    const searchInput = document.getElementById('tracking-search-input');

    const handleSearch = () => {
      const q = searchInput?.value.trim().toUpperCase();
      if (!q) return;
      const found = store.orders.find((o) => o.id.toUpperCase() === q || o.id.replace('CX-', '').toUpperCase() === q);
      if (found) {
        sounds.playClick();
        store.setActiveTrackingId(found.id);
        if (searchInput) searchInput.value = '';
      } else {
        alert(`Token "${q}" not found in current canteen queue.`);
      }
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
  }

  function renderTrackingView() {
    const activeOrder = store.orders.find((o) => o.id === store.activeTrackingId) || store.orders[0];
    const container = document.getElementById('tracking-card-body');

    if (!container || !activeOrder) return;

    const statuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
    const currentIndex = statuses.indexOf(activeOrder.status);

    let stepperHtml = statuses.map((st, idx) => {
      let stateClass = '';
      if (idx < currentIndex) stateClass = 'completed';
      else if (idx === currentIndex) stateClass = 'active';

      return `
        <div class="tracking-step-item ${stateClass}">
          <div class="step-circle">${idx < currentIndex ? '✓' : idx + 1}</div>
          <span class="step-label">${st}</span>
        </div>
      `;
    }).join('');

    let itemsHtml = activeOrder.items.map((i) => `
      <div class="tracking-item-row">
        <span>${i.quantity}x ${i.name}</span>
        <strong>₹${i.price * i.quantity}</strong>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="tracking-header-meta">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-ochre); margin-bottom: 0.25rem;">Live Campus Token</div>
          <div class="tracking-token-id">${activeOrder.id}</div>
        </div>
        <div style="text-align: right;">
          <span class="tracking-counter-badge">📍 ${activeOrder.counter}</span>
          <div style="font-size: 0.8rem; color: var(--text-light-secondary); margin-top: 0.4rem;">Slot: <strong>${activeOrder.pickupSlot}</strong></div>
        </div>
      </div>

      <div class="tracking-stepper">
        ${stepperHtml}
      </div>

      <div class="tracking-info-grid">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-light-muted); margin-bottom: 0.85rem;">Tray Summary (${activeOrder.studentName} — ${activeOrder.regNo})</div>
          <div class="tracking-order-items-list">
            ${itemsHtml}
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; margin-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 1.05rem; font-weight: 800; color: #fff;">
              <span>Total Paid</span>
              <span>₹${activeOrder.totalAmount} (${activeOrder.paymentMethod})</span>
            </div>
          </div>
        </div>
        <div class="tracking-qr-box">
          ${generateQRCodeSVG(activeOrder.id, 140)}
          <p style="margin-top: 0.6rem; color: #0F0F10;">Show at ${activeOrder.counter}</p>
        </div>
      </div>
    `;
  }

  function toggleAdminView() {
    const mainLandings = document.querySelectorAll('.student-view');
    const adminView = document.getElementById('admin-view');
    const adminBtn = document.getElementById('btn-toggle-admin');

    const isEnteringAdmin = !adminView.classList.contains('active');

    if (isEnteringAdmin) {
      mainLandings.forEach((el) => (el.style.display = 'none'));
      adminView.classList.add('active');
      adminBtn.innerHTML = `<span>Exit Admin</span>`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderAdminView();
    } else {
      mainLandings.forEach((el) => (el.style.display = ''));
      adminView.classList.remove('active');
      adminBtn.innerHTML = `<span>Kitchen Staff</span>`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function bindAdminEvents() {
    const backBtn = document.getElementById('btn-admin-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        sounds.playClick();
        toggleAdminView();
      });
    }

    const searchInput = document.getElementById('admin-inventory-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderAdminMenuTable();
      });
    }

    const catSelect = document.getElementById('admin-inventory-cat');
    if (catSelect) {
      catSelect.addEventListener('change', () => {
        sounds.playClick();
        renderAdminMenuTable();
      });
    }
  }

  function renderAdminView() {
    renderAdminMetrics();
    renderAdminOrdersTable();
    renderAdminMenuTable();
  }

  function renderAdminMetrics() {
    const metrics = store.getRealMetrics();
    const revEl = document.getElementById('admin-metric-rev');
    const totalEl = document.getElementById('admin-metric-total');
    const prepEl = document.getElementById('admin-metric-prep');
    const readyEl = document.getElementById('admin-metric-ready');

    if (revEl) revEl.innerText = `₹${metrics.totalRevenue}`;
    if (totalEl) totalEl.innerText = metrics.todayTotal;
    if (prepEl) prepEl.innerText = metrics.inPrep;
    if (readyEl) readyEl.innerText = metrics.readyCount;
  }

  function renderAdminOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    if (store.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No orders in queue today.</td></tr>`;
      return;
    }

    tbody.innerHTML = store.orders.map((o) => {
      let nextStatus = '';
      let btnLabel = '';

      if (o.status === 'PLACED') {
        nextStatus = 'ACCEPTED';
        btnLabel = 'Accept';
      } else if (o.status === 'ACCEPTED') {
        nextStatus = 'PREPARING';
        btnLabel = 'Start Cooking';
      } else if (o.status === 'PREPARING') {
        nextStatus = 'READY';
        btnLabel = 'Mark Ready';
      } else if (o.status === 'READY') {
        nextStatus = 'COMPLETED';
        btnLabel = 'Complete';
      }

      const itemsSummary = o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

      return `
        <tr>
          <td style="font-family: var(--font-display); font-weight: 800; color: #fff;">${o.id}</td>
          <td>
            <div style="font-weight: 700; color: #fff;">${o.studentName}</div>
            <div style="font-size: 0.72rem; color: var(--text-light-muted);">${o.regNo} • ${o.department}</div>
          </td>
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${itemsSummary}</td>
          <td>${o.pickupSlot}</td>
          <td style="font-weight: 700; color: #fff;">₹${o.totalAmount}</td>
          <td><span class="status-badge ${o.status.toLowerCase()}">${o.status}</span></td>
          <td>
            ${nextStatus ? `
              <button class="btn-status-action" data-action="update-order-status" data-id="${o.id}" data-next="${nextStatus}">
                ${btnLabel} →
              </button>
            ` : `<span style="font-size: 0.75rem; color: var(--color-green-veg);">Done ✓</span>`}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="update-order-status"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const orderId = e.currentTarget.getAttribute('data-id');
        const nextStatus = e.currentTarget.getAttribute('data-next');
        store.updateOrderStatus(orderId, nextStatus);
        showToast('Order Status Updated', `Token ${orderId} moved to ${nextStatus}`, 'info');
      });
    });
  }

  function renderAdminMenuTable() {
    const tbody = document.getElementById('admin-menu-tbody');
    if (!tbody) return;

    const searchInput = document.getElementById('admin-inventory-search');
    const catSelect = document.getElementById('admin-inventory-cat');

    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = catSelect?.value || 'ALL';

    let filtered = [...store.menu];
    if (cat !== 'ALL') {
      filtered = filtered.filter((i) => i.category === cat);
    }
    if (q) {
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-light-muted);">No inventory items match your filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((item) => `
      <tr>
        <td style="font-family: var(--font-display); font-weight: 700; color: #fff;">#${item.code}</td>
        <td style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image}" alt="" style="width: 38px; height: 38px; border-radius: 4px; object-fit: cover;">
          <div>
            <strong style="color: #fff;">${item.name}</strong>
            <div style="font-size: 0.72rem; color: var(--text-light-muted);">${item.category} • ${item.prepTime} • ⭐ ${item.rating || 5.0}</div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <span>₹</span>
            <input type="number" class="admin-price-input" data-id="${item.id}" value="${item.price}" style="width: 60px; padding: 0.2rem 0.4rem; background: #202027; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; color: #fff; font-weight: 700;">
          </div>
        </td>
        <td>
          <button class="btn-status-action" data-action="toggle-stock" data-id="${item.id}" style="background: ${item.inStock ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${item.inStock ? '#4ADE80' : '#F87171'}; border-color: transparent;">
            ${item.inStock ? 'In Stock ✓' : 'Sold Out ✕'}
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action="toggle-stock"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleItemStock(id);
        const item = store.menu.find((i) => i.id === id);
        if (item) {
          showToast(
            item.inStock ? 'Stock Restored' : 'Item Sold Out',
            `${item.name} is now ${item.inStock ? 'available in canteen' : 'marked sold out'}`,
            item.inStock ? 'success' : 'info'
          );
        }
      });
    });

    tbody.querySelectorAll('.admin-price-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        sounds.playClick();
        const id = e.target.getAttribute('data-id');
        const val = Number(e.target.value);
        if (val > 0) {
          store.updateItemPrice(id, val);
          const item = store.menu.find((i) => i.id === id);
          showToast('Price Updated', `${item?.name || 'Item'} price set to ₹${val}`, 'info');
        }
      });
    });
  }

  function bindKioskModal() {
    const kioskBtn = document.getElementById('btn-open-kiosk');
    const kioskModal = document.getElementById('kiosk-modal');
    const closeKioskBtn = document.getElementById('btn-close-kiosk');

    if (kioskBtn && kioskModal) {
      kioskBtn.addEventListener('click', () => {
        sounds.playClick();
        kioskModal.classList.add('active');
        renderKioskBoard();
      });
    }

    if (closeKioskBtn && kioskModal) {
      closeKioskBtn.addEventListener('click', () => {
        sounds.playClick();
        kioskModal.classList.remove('active');
      });
    }
  }

  function initKioskClock() {
    const clockEl = document.getElementById('kiosk-clock');
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    update();
    setInterval(update, 1000);
  }

  function renderKioskBoard() {
    const cookingGrid = document.getElementById('kiosk-cooking-grid');
    const readyGrid = document.getElementById('kiosk-ready-grid');
    if (!cookingGrid || !readyGrid) return;

    const cookingOrders = store.orders.filter(o => o.status === 'PREPARING' || o.status === 'ACCEPTED' || o.status === 'PLACED');
    const readyOrders = store.orders.filter(o => o.status === 'READY');

    cookingGrid.innerHTML = cookingOrders.length > 0 ? cookingOrders.map(o => `
      <div class="kiosk-token-card">
        <div class="kiosk-token-id">${o.id}</div>
        <div class="kiosk-token-counter">${o.counter}</div>
        <div style="font-size: 0.72rem; color: #9E9EA8; margin-top: 0.35rem;">${o.studentName}</div>
      </div>
    `).join('') : `<p style="color: #666; font-size: 0.9rem;">No active kitchen orders cooking.</p>`;

    readyGrid.innerHTML = readyOrders.length > 0 ? readyOrders.map(o => `
      <div class="kiosk-token-card ready">
        <div class="kiosk-token-id" style="color: #4ADE80;">${o.id}</div>
        <div class="kiosk-token-counter" style="color: #fff;">${o.counter}</div>
        <div style="font-size: 0.75rem; color: #4ADE80; font-weight: 700; margin-top: 0.35rem;">Ready for Pickup ✓</div>
      </div>
    `).join('') : `<p style="color: #666; font-size: 0.9rem;">All ready orders collected.</p>`;
  }

  let lastQueryResults = null;

  function bindSQLiteStudio() {
    const openBtn = document.getElementById('btn-open-sqlite');
    const modal = document.getElementById('sqlite-modal');
    const closeBtn = document.getElementById('btn-close-sqlite');
    const runBtn = document.getElementById('btn-execute-sql');
    const resetBtn = document.getElementById('btn-reset-db');
    const exportCsvBtn = document.getElementById('btn-export-sql-csv');
    const exportJsonBtn = document.getElementById('btn-export-sql-json');
    const queryInput = document.getElementById('sql-query-input');
    const resultsContainer = document.getElementById('sql-results-container');
    const metaEl = document.getElementById('sql-exec-meta');
    const presets = document.querySelectorAll('.btn-sql-preset');

    const executeCurrentSQL = () => {
      const sql = queryInput?.value.trim();
      if (!sql) return;
      sounds.playClick();
      const t0 = performance.now();
      try {
        const res = store.executeSQL(sql);
        lastQueryResults = res;
        const elapsed = (performance.now() - t0).toFixed(2);
        if (metaEl) metaEl.innerHTML = `<span style="color: #4ADE80;">✓ Query executed in ${elapsed}ms (${res.count} rows returned)</span>`;
        
        let tableHtml = `
          <table class="sql-table">
            <thead>
              <tr>${res.columns.map(c => `<th>${c}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${res.rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        `;
        if (resultsContainer) resultsContainer.innerHTML = tableHtml;
      } catch (err) {
        if (metaEl) metaEl.innerHTML = `<span style="color: #F87171;">✕ SQL Error: ${err.message}</span>`;
        if (resultsContainer) resultsContainer.innerHTML = `<div style="padding: 1rem; color: #F87171; font-family: monospace; font-size: 0.85rem;">${err.message}</div>`;
      }
    };

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        sounds.playClick();
        if (!lastQueryResults || !lastQueryResults.rows.length) {
          executeCurrentSQL();
        }
        if (lastQueryResults && lastQueryResults.rows.length) {
          const header = lastQueryResults.columns.join(',');
          const csvRows = lastQueryResults.rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
          const csvContent = "data:text/csv;charset=utf-8," + [header, ...csvRows].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `cantenex_export_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        sounds.playClick();
        if (!lastQueryResults || !lastQueryResults.rows.length) {
          executeCurrentSQL();
        }
        if (lastQueryResults && lastQueryResults.rows.length) {
          const jsonArray = lastQueryResults.rows.map(row => {
            const obj = {};
            lastQueryResults.columns.forEach((col, idx) => {
              obj[col] = row[idx];
            });
            return obj;
          });
          const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonArray, null, 2));
          const link = document.createElement("a");
          link.setAttribute("href", jsonContent);
          link.setAttribute("download", `cantenex_export_${Date.now()}.json`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        sounds.playClick();
        modal.classList.add('active');
        executeCurrentSQL();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        sounds.playClick();
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (runBtn) runBtn.addEventListener('click', executeCurrentSQL);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset demo orders, menu items and student reviews to initial factory state?')) {
          sounds.playClick();
          store.resetDemoData();
          executeCurrentSQL();
        }
      });
    }

    presets.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const q = e.currentTarget.getAttribute('data-query');
        if (queryInput && q) {
          queryInput.value = q;
          executeCurrentSQL();
        }
      });
    });
  }

  function bindLegalModals() {
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');

    document.getElementById('link-terms')?.addEventListener('click', (e) => {
      e.preventDefault();
      sounds.playClick();
      termsModal?.classList.add('active');
    });

    document.getElementById('link-privacy')?.addEventListener('click', (e) => {
      e.preventDefault();
      sounds.playClick();
      privacyModal?.classList.add('active');
    });

    document.getElementById('btn-close-terms')?.addEventListener('click', () => {
      sounds.playClick();
      termsModal?.classList.remove('active');
    });

    document.getElementById('btn-close-privacy')?.addEventListener('click', () => {
      sounds.playClick();
      privacyModal?.classList.remove('active');
    });

    [termsModal, privacyModal].forEach((m) => {
      m?.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });

    const heroSpecialAdd = document.getElementById('btn-special-add-tray');
    if (heroSpecialAdd) {
      heroSpecialAdd.addEventListener('click', () => {
        const specialItem = store.menu.find((i) => i.featuredSpecial) || store.menu.find((i) => i.id === 'cx-04') || store.menu[3];
        if (specialItem) {
          sounds.playAdd();
          store.addToCart(specialItem);
          triggerAddAnimation(heroSpecialAdd);
          showToast('Chef\'s Special Added', `${specialItem.name} added to your tray!`, 'success');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
