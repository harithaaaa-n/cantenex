-- ========================================================================
-- CANTENEX — Production PostgreSQL Database Schema
-- Compatible with PostgreSQL 13+ (Supabase, Neon, Render, Railway, AWS RDS)
-- ========================================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    reg_no VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('BREAKFAST', 'MEALS', 'SNACKS', 'DRINKS', 'DESSERTS')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    prep_time VARCHAR(50) NOT NULL,
    diet VARCHAR(20) NOT NULL CHECK (diet IN ('veg', 'non-veg')),
    tag VARCHAR(100),
    description TEXT,
    image TEXT NOT NULL,
    calories VARCHAR(50),
    protein VARCHAR(50),
    carbs VARCHAR(50),
    fats VARCHAR(50),
    in_stock INTEGER NOT NULL DEFAULT 1 CHECK (in_stock IN (0, 1)),
    spice_level INTEGER DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    highlight INTEGER DEFAULT 0,
    featured_special INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- Token e.g. 'CX-1021'
    student_name VARCHAR(150) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    department VARCHAR(150) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    pickup_slot VARCHAR(150) NOT NULL,
    pickup_type VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'immediate' | 'scheduled'
    payment_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED')),
    counter VARCHAR(150) NOT NULL,
    placed_at VARCHAR(50) NOT NULL,
    prep_progress INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id VARCHAR(50) NOT NULL REFERENCES menu_items(id),
    item_name VARCHAR(200) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 5. Dish Reviews Table
CREATE TABLE IF NOT EXISTS dish_reviews (
    id SERIAL PRIMARY KEY,
    menu_id VARCHAR(50) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index optimization for production queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_dish_reviews_menu ON dish_reviews(menu_id);

-- ========================================================================
-- IDEMPOTENT SEED DATA (Safe for multiple runs)
-- ========================================================================

-- Seed Sample Students
INSERT INTO students (reg_no, name, department) VALUES
('22BCS142', 'Dinesh C', 'Computer Science & Engineering'),
('23BIT089', 'Sneha Rangarajan', 'Information Technology'),
('21BME205', 'Rohan Deshmukh', 'Mechanical Engineering'),
('24BAI017', 'Kavya Sree', 'Artificial Intelligence & DS'),
('22ECE114', 'Aditya Verma', 'Electronics & Communication')
ON CONFLICT (reg_no) DO NOTHING;

-- Seed Menu Items (Full 36-Dish Master Catalogue)
INSERT INTO menu_items 
(id, code, name, category, price, prep_time, diet, tag, description, image, calories, protein, carbs, fats, in_stock, spice_level, rating, highlight, featured_special) 
VALUES
-- BREAKFAST / MORNING TIFFIN
('cx-01', '01', 'Ghee Podi Masala Dosa', 'BREAKFAST', 65, '8 mins', 'veg', 'Campus Bestseller', 'Crisp golden fermented rice crepe roasted in pure A2 ghee, generously dusted with gun-powder podi spice, filled with spiced potato masala, served with 3 house chutneys and hot sambar.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85', '340 kcal', '9g', '48g', '12g', 1, 2, 4.9, 1, 0),
('cx-02', '02', 'Steamed Ghee Idli & Medu Vada Combo', 'BREAKFAST', 50, '5 mins', 'veg', 'Morning Ritual', 'Two cloud-soft button idlis dipped in clarified ghee paired with a crispy, freshly fried golden medu vada, served with traditional shallot drumstick sambar and fresh coconut dip.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85', '280 kcal', '8g', '42g', '8g', 1, 1, 4.8, 0, 0),
('cx-03', '03', 'Ven Pongal with Cashew Ghee Roast', 'BREAKFAST', 55, '6 mins', 'veg', 'Comfort Bowl', 'Silky melt-in-mouth rice and yellow moong dal cooked with whole crushed black peppercorns, fresh ginger, curry leaves, and crunchy roasted cashews tempered in pure country butter.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '310 kcal', '7g', '45g', '11g', 1, 1, 4.7, 0, 0),
('cx-17', '17', 'Mysore Masala Dosa with Red Garlic Chutney', 'BREAKFAST', 70, '8 mins', 'veg', 'Fiery Crisp', 'Golden butter roasted crepe smeared with pungent red chili garlic Mysore paste, filled with spiced mashed potato filling, served with coconut chutney and piping hot drumstick sambar.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85', '360 kcal', '9g', '50g', '14g', 1, 3, 4.9, 0, 0),
('cx-18', '18', 'Puri Bhaji with Spiced Potato Masala (3 Pcs)', 'BREAKFAST', 55, '6 mins', 'veg', 'Student Classic', 'Trio of puffed golden whole-wheat puris served with aromatic turmeric tempered cumin-potato bhaji, freshly sliced onions, green chilies, and tangy mango pickle.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85', '380 kcal', '8g', '52g', '16g', 1, 2, 4.8, 0, 0),
('cx-19', '19', 'Crispy Onion Rava Dosa with Ginger Dip', 'BREAKFAST', 65, '9 mins', 'veg', 'Golden Net', 'Delicate semolina lacy net crepe studded with crunchy chopped shallots, green chilies, crushed black peppercorns, and roasted cumin. Served crisp with allam ginger pachadi.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85', '320 kcal', '7g', '46g', '12g', 1, 2, 4.7, 0, 0),
('cx-20', '20', 'Lacy Kerala Appam with Vegetable Stew (2 Pcs)', 'BREAKFAST', 60, '7 mins', 'veg', 'Coastal Delight', 'Fermented rice and coconut milk hopper with a soft spongy center and crispy lacy edges, paired with mildly spiced coconut milk stew laden with carrots, beans, and potatoes.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '260 kcal', '6g', '44g', '7g', 1, 1, 4.8, 0, 0),

-- MEALS / LUNCH & BOWLS
('cx-04', '04', 'Malabar Chicken Dum Biryani', 'MEALS', 130, '7 mins', 'non-veg', 'Chef''s Signature', 'Fragrant short-grain Kaima rice layered with tender spiced chicken marinated in roasted Kerala spices, slow-cooked in dum style. Accompanied by mint onion raita, spicy pickle, and boiled farm egg.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85', '580 kcal', '32g', '65g', '22g', 1, 3, 5.0, 0, 1),
('cx-05', '05', 'Traditional South Indian Executive Meals', 'MEALS', 90, '5 mins', 'veg', 'Full Lunch Feast', 'Unlimited Ponni steamed rice served on eco-leaf with traditional Sambar, spicy Rasam, Kootu, Poriyal of the day, Appalam, curd, spicy pickle, and sweet Payasam.', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85', '520 kcal', '14g', '78g', '16g', 1, 2, 4.8, 0, 0),
('cx-06', '06', 'Wok-Tossed Schezwan Egg & Chicken Fried Rice', 'MEALS', 95, '10 mins', 'non-veg', 'Canteen Favorite', 'High-flame wok tossed basmati rice with shredded chicken, scrambled farm egg, crisp scallions, bell peppers, and fiery in-house Schezwan red pepper reduction.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85', '490 kcal', '26g', '62g', '15g', 1, 3, 4.9, 0, 0),
('cx-07', '07', 'Flaky Kerala Parotta with Chicken Salna (2 Pcs)', 'MEALS', 80, '6 mins', 'non-veg', 'Street Legend', 'Hand-beaten, multi-layered golden flaky Malabar parottas served steaming hot with rich, aromatic street-style chicken salna gravy and sliced red onions.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=1200&q=85', '460 kcal', '24g', '48g', '20g', 1, 3, 4.9, 0, 0),
('cx-21', '21', 'Hyderabadi Shahi Paneer Biryani Handi', 'MEALS', 115, '8 mins', 'veg', 'Royal Feast', 'Long-grain aged basmati rice cooked on slow dum with tandoor grilled cottage cheese cubes, caramelized fried onions (birista), saffron milk, mint leaves, and rich cucumber raita.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85', '510 kcal', '18g', '68g', '19g', 1, 2, 4.8, 1, 0),
('cx-22', '22', 'Paneer Butter Masala with 2 Butter Naan', 'MEALS', 110, '8 mins', 'veg', 'North Indian Star', 'Silky paneer cubes simmered in a luscious velvet tomato cashew gravy enriched with butter and dried fenugreek kasuri methi, served with 2 freshly charred butter garlic naans.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=85', '540 kcal', '19g', '58g', '26g', 1, 2, 4.9, 0, 0),
('cx-23', '23', 'Student Mini Thali (Dal Makhani & Jeera Rice)', 'MEALS', 85, '5 mins', 'veg', 'Everyday Saver', 'Slow-simmered black lentils in creamy butter gravy, fragrant cumin basmati rice, 2 hot phulkas, fresh pickled onions, and roasted papad for a wholesome lecture break lunch.', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85', '450 kcal', '15g', '65g', '14g', 1, 1, 4.7, 0, 0),
('cx-24', '24', 'Street-Style Chicken Hakka Noodles', 'MEALS', 95, '9 mins', 'non-veg', 'Wok Master', 'Springy egg noodles tossed in high-heat wok with tender chicken strips, crisp cabbage, julienned carrots, scallions, dark soy sauce, and crushed white peppercorns.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=85', '470 kcal', '25g', '59g', '16g', 1, 2, 4.8, 0, 0),
('cx-25', '25', 'Comfort Curd Rice with Tadka & Pomegranate', 'MEALS', 45, '3 mins', 'veg', 'Cooling Bowl', 'Creamy homemade curd mixed with soft mashed rice, tempered with mustard seeds, curry leaves, ginger, green chilies, roasted urad dal, and sweet ruby pomegranate pearls.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85', '260 kcal', '7g', '42g', '7g', 1, 1, 4.8, 0, 0),

-- SNACKS / QUICK BITES
('cx-08', '08', 'Charcoal Grilled Paneer Tikka Kathi Roll', 'SNACKS', 75, '8 mins', 'veg', 'Grab & Go', 'Succulent malai paneer cubes marinated in tandoori spices, rolled in a flaky butter parotta with pickled laccha onions, mint coriander chutney, and chatpata chaat masala.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '390 kcal', '16g', '44g', '17g', 1, 2, 4.7, 0, 0),
('cx-09', '09', 'Delhi Style Samosa Chaat Platter (2 Pcs)', 'SNACKS', 45, '5 mins', 'veg', 'Evening Craving', 'Crisp pastry triangles stuffed with spiced potatoes and green peas, crushed and drowned in hot ragda chole, whisked yogurt, sweet tamarind glaze, spicy mint chutney, and nylon sev.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85', '320 kcal', '8g', '46g', '12g', 1, 2, 4.8, 0, 0),
('cx-10', '10', 'Peri Peri Seasoned Crispy Golden Fries', 'SNACKS', 60, '7 mins', 'veg', 'Addictive Crunch', 'Double-fried hand-cut Idaho potato batons tossed immediately in spicy African bird’s eye peri-peri seasoning. Served with creamy garlic dip.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85', '350 kcal', '5g', '48g', '16g', 1, 2, 4.6, 0, 0),
('cx-26', '26', 'Kolkata Double Egg & Chicken Roll', 'SNACKS', 85, '8 mins', 'non-veg', 'Protein Loaded', 'Layered flaky parotta lined with two farm eggs, stuffed with spicy roasted shredded chicken, crunchy sliced red onions, green chilies, fresh lime juice, and Kasundi mustard mayo.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '440 kcal', '28g', '42g', '18g', 1, 3, 4.9, 0, 0),
('cx-27', '27', 'Crispy Onion & Palak Pakoda Basket', 'SNACKS', 40, '6 mins', 'veg', 'Rainy Day Crunch', 'Golden, extra-crisp fritters made from thinly sliced red onions and tender baby spinach coated in ajwain-spiced gram flour batter. Served with spicy pudina mint chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85', '290 kcal', '6g', '36g', '14g', 1, 2, 4.7, 0, 0),
('cx-28', '28', 'Mumbai Butter Pav Bhaji (2 Butter Pavs)', 'SNACKS', 70, '7 mins', 'veg', 'Campus Sensation', 'Spicy mashed vegetable curry enriched with pure Amul butter, special Pav Bhaji masala, served with 2 golden pan-toasted butter pavs, fresh lemon wedges, and chopped red onions.', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=85', '420 kcal', '10g', '56g', '18g', 1, 3, 4.9, 1, 0),
('cx-29', '29', 'Crispy Vegetable Spring Rolls with Sweet Chili (4 Pcs)', 'SNACKS', 55, '6 mins', 'veg', 'Golden Crispy', 'Crispy golden pastry rolls packed with wok-tossed shredded cabbage, bell peppers, carrots, and sweet corn. Served hot with homemade sweet garlic chili dip.', 'https://images.unsplash.com/photo-1548507297-c20ec26b52c0?auto=format&fit=crop&w=1200&q=85', '280 kcal', '6g', '38g', '12g', 1, 1, 4.7, 0, 0),
('cx-30', '30', 'Crunchy Southern Spiced Chicken Popcorn', 'SNACKS', 80, '6 mins', 'non-veg', 'Crunch Blast', 'Bite-sized boneless chicken morsels marinated in buttermilk and south-Indian curry leaf masala, breaded and fried to supreme crunch. Served with smoked garlic dip.', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=85', '370 kcal', '24g', '28g', '18g', 1, 3, 4.8, 0, 0),

-- DRINKS / BREWS & COOLERS
('cx-11', '11', 'Brass Tumbler Degree Filter Coffee', 'DRINKS', 25, '3 mins', 'veg', 'Soul Brew', 'Freshly decocted 80:20 Peaberry Chicory brew frothed with full-cream hot milk, poured from height to create a velvety foam crown. Served in traditional brass dabarah.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85', '110 kcal', '4g', '14g', '4g', 1, 0, 5.0, 0, 0),
('cx-12', '12', 'Kolkata Kulhad Masala Chai', 'DRINKS', 20, '3 mins', 'veg', 'Rainy Day Special', 'Assam CTC tea leaves slow-simmered with crushed green cardamom, dried ginger, cloves, and cinnamon bark, served in an earthy terracotta kulhad.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85', '90 kcal', '3g', '12g', '3g', 1, 1, 4.9, 0, 0),
('cx-13', '13', 'Belgian Dark Chocolate Frappé Cold Coffee', 'DRINKS', 65, '4 mins', 'veg', 'Chilled Fuel', 'Double espresso shot blended with rich Belgian chocolate ganache, chilled dairy, and crushed ice, topped with cocoa dusting and espresso foam.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85', '220 kcal', '6g', '28g', '9g', 1, 0, 4.9, 0, 0),
('cx-14', '14', 'Shikanji Fresh Mint Lime Crusher', 'DRINKS', 35, '3 mins', 'veg', 'Hydration Burst', 'Hand-squeezed Kagzi lime juice shaken with crushed garden spearmint, roasted cumin rock salt, cane sugar, and sparkling soda or chilled water.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85', '75 kcal', '1g', '18g', '0g', 1, 0, 4.7, 0, 0),
('cx-31', '31', 'Chilled Royal Rose Milk with Sabja Seeds', 'DRINKS', 40, '3 mins', 'veg', 'Summer Classic', 'Thick farm fresh chilled milk blended with aromatic rose petal syrup, floating soaked basil (sabja) seeds, and crushed ice for instant campus refreshment.', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=85', '160 kcal', '5g', '24g', '5g', 1, 0, 4.8, 0, 0),
('cx-32', '32', 'Alphonso Mango Lassi with Roasted Pistachios', 'DRINKS', 55, '3 mins', 'veg', 'Creamy Mango', 'Velvety sweet yogurt churned with real Ratnagiri Alphonso mango pulp, a hint of cardamom, topped with chopped Iranian pistachios and saffron threads.', 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=85', '210 kcal', '7g', '32g', '6g', 1, 0, 4.9, 0, 0),
('cx-33', '33', 'Iced Lemon Peach Hibiscus Brew', 'DRINKS', 40, '3 mins', 'veg', 'Zero Guilt Cooler', 'Cold-brewed organic crimson hibiscus flowers infused with white peach essence, squeezed lemon juice, and a splash of wild mountain honey over cracked ice.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85', '60 kcal', '0g', '14g', '0g', 1, 0, 4.7, 0, 0),
('cx-34', '34', 'Warm Kesariya Badam Milk with Crushed Cashews', 'DRINKS', 45, '4 mins', 'veg', 'Nutritious Warmth', 'Rich boiling milk infused with ground almond paste, Kashmiri saffron strands, cardamom powder, and garnished with roasted golden cashew bits.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85', '190 kcal', '8g', '22g', '8g', 1, 0, 4.9, 0, 0),

-- DESSERTS / SWEET FINISHES
('cx-15', '15', 'Sizzling Warm Belgian Walnut Brownie', 'DESSERTS', 80, '5 mins', 'veg', 'Decadent Melt', 'Dense, fudgy 70% dark chocolate brownie packed with roasted California walnuts, warmed through and served with rich chocolate hot fudge drizzle.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85', '410 kcal', '6g', '46g', '22g', 1, 0, 4.9, 0, 0),
('cx-16', '16', 'Royal Shahi Malai Kulfi on Bamboo Stick', 'DESSERTS', 50, '2 mins', 'veg', 'Traditional Chilled', 'Slow-reduced whole buffalo milk infused with Kashmiri saffron strands, green cardamom, chopped Iranian pistachios, and slivered almonds.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85', '240 kcal', '5g', '26g', '13g', 1, 0, 4.8, 0, 0),
('cx-35', '35', 'Hot Desi Ghee Gulab Jamun with Rabdi (2 Pcs)', 'DESSERTS', 55, '3 mins', 'veg', 'Pure Indulgence', 'Soft golden fried mawa dumplings soaked in rose cardamom sugar syrup, served warm alongside a generous ladle of chilled slow-simmered rabdi.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85', '310 kcal', '6g', '42g', '14g', 1, 0, 4.9, 0, 0),
('cx-36', '36', 'Rich Saffron Gajar Ka Halwa with Mawa & Nuts', 'DESSERTS', 65, '3 mins', 'veg', 'Winter Specialty', 'Slow-cooked grated Delhi carrots in pure country ghee and full-cream milk, sweetened with raw sugar, studded with roasted cashews, raisins, and crumbled mawa.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85', '290 kcal', '5g', '38g', '13g', 1, 0, 4.8, 0, 0)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    prep_time = EXCLUDED.prep_time,
    diet = EXCLUDED.diet,
    tag = EXCLUDED.tag,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fats = EXCLUDED.fats;

-- Seed Sample Orders
INSERT INTO orders (id, student_name, reg_no, department, total_amount, pickup_slot, pickup_type, payment_method, status, counter, placed_at, prep_progress) VALUES
('CX-1021', 'Dinesh C', '22BCS142', 'Computer Science & Engineering', 165, '01:15 PM — Lunch Break', 'scheduled', 'UPI Demo (Verified)', 'READY', 'Counter 2 (Hot Express)', '12:48 PM', 90),
('CX-1022', 'Sneha Rangarajan', '23BIT089', 'Information Technology', 180, '⚡ Ready in 10-12 Mins', 'immediate', 'Cash at Counter', 'PREPARING', 'Counter 1 (Tiffin & Dosa)', '01:02 PM', 55),
('CX-1023', 'Rohan Deshmukh', '21BME205', 'Mechanical Engineering', 145, '01:15 PM — Lunch Break', 'scheduled', 'UPI Demo (Verified)', 'ACCEPTED', 'Counter 3 (Special Gravy)', '01:08 PM', 25),
('CX-1024', 'Kavya Sree', '24BAI017', 'Artificial Intelligence & DS', 155, '03:45 PM — Evening Snack', 'scheduled', 'UPI Demo (Verified)', 'PLACED', 'Counter 2 (Hot Express)', '01:12 PM', 10),
('CX-1025', 'Aditya Verma', '22ECE114', 'Electronics & Communication', 125, '⚡ Ready in 10-12 Mins', 'immediate', 'UPI Demo (Verified)', 'ACCEPTED', 'Counter 2 (Hot Express)', '01:18 PM', 35)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Order Items
INSERT INTO order_items (order_id, menu_id, item_name, price, quantity) VALUES
('CX-1021', 'cx-04', 'Malabar Chicken Dum Biryani', 130, 1),
('CX-1021', 'cx-14', 'Shikanji Fresh Mint Lime Crusher', 35, 1),
('CX-1022', 'cx-01', 'Ghee Podi Masala Dosa', 65, 2),
('CX-1022', 'cx-11', 'Brass Tumbler Degree Filter Coffee', 25, 2),
('CX-1023', 'cx-07', 'Flaky Kerala Parotta with Salna', 80, 1),
('CX-1023', 'cx-13', 'Belgian Dark Chocolate Cold Coffee', 65, 1),
('CX-1024', 'cx-08', 'Paneer Tikka Kathi Roll', 75, 1),
('CX-1024', 'cx-15', 'Sizzling Warm Brownie', 80, 1),
('CX-1025', 'cx-28', 'Mumbai Butter Pav Bhaji', 70, 1),
('CX-1025', 'cx-32', 'Alphonso Mango Lassi', 55, 1)
ON CONFLICT DO NOTHING;

-- Seed Sample Dish Reviews
INSERT INTO dish_reviews (menu_id, student_name, rating, comment) VALUES
('cx-04', 'Dinesh C. (CSE)', 5, 'The chicken dum biryani is incredible! Dum aroma is authentic and chicken pieces are super tender.'),
('cx-01', 'Sneha R. (IT)', 5, 'Podi dosa is crisp to perfection. Love the fiery gunpowder spice and ginger chutney.'),
('cx-11', 'Rohan D. (Mech)', 5, 'Authentic degree filter coffee. Perfect frothy head in the brass dabarah!'),
('cx-15', 'Kavya S. (AI&DS)', 5, 'Warm walnut brownie with hot chocolate sauce is a lifesaver between continuous lectures.'),
('cx-28', 'Aditya V. (ECE)', 5, 'Pav Bhaji with extra butter is phenomenal! Genuine Mumbai street style flavor on campus.'),
('cx-17', 'Pooja K. (Biotech)', 5, 'The red garlic chutney spread inside Mysore masala dosa gives it the ultimate punch!')
ON CONFLICT DO NOTHING;
