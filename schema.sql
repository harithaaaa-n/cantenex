-- ========================================================================
-- CANTENEX — College Canteen Pre-Order SQLite Database Schema
-- Web Essentials Mini Project Database Architecture
-- ========================================================================

PRAGMA foreign_keys = ON;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    reg_no TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('BREAKFAST', 'MEALS', 'SNACKS', 'DRINKS', 'DESSERTS')),
    price REAL NOT NULL CHECK (price >= 0),
    prep_time TEXT NOT NULL,
    diet TEXT NOT NULL CHECK (diet IN ('veg', 'non-veg')),
    tag TEXT,
    description TEXT,
    image TEXT NOT NULL,
    calories TEXT,
    in_stock INTEGER NOT NULL DEFAULT 1 CHECK (in_stock IN (0, 1)),
    spice_level INTEGER DEFAULT 0,
    rating REAL DEFAULT 5.0,
    highlight INTEGER DEFAULT 0,
    featured_special INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- Token e.g. 'CX-1021'
    student_name TEXT NOT NULL,
    reg_no TEXT NOT NULL,
    department TEXT NOT NULL,
    total_amount REAL NOT NULL CHECK (total_amount >= 0),
    pickup_slot TEXT NOT NULL,
    pickup_type TEXT NOT NULL, -- 'immediate' | 'scheduled'
    payment_method TEXT NOT NULL, -- 'UPI Demo (Verified)' | 'Cash at Counter'
    status TEXT NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED')),
    counter TEXT NOT NULL,
    placed_at TEXT NOT NULL,
    prep_progress INTEGER DEFAULT 15,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table (Many-to-Many junction with line item details)
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    menu_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu_items(id)
);

-- ========================================================================
-- INITIAL SEED DATA
-- ========================================================================

-- Seed Sample Students
INSERT OR IGNORE INTO students (reg_no, name, department) VALUES
('22BCS142', 'Aravind Swaminathan', 'Computer Science & Engineering'),
('23BIT089', 'Sneha Rangarajan', 'Information Technology'),
('21BME205', 'Rohan Deshmukh', 'Mechanical Engineering'),
('24BAI017', 'Kavya Sree', 'Artificial Intelligence & DS');

-- Seed Menu Items
INSERT OR REPLACE INTO menu_items (id, code, name, category, price, prep_time, diet, tag, description, image, calories, in_stock, spice_level, rating, highlight, featured_special) VALUES
('cx-01', '01', 'Ghee Podi Masala Dosa', 'BREAKFAST', 65, '8 mins', 'veg', 'Campus Bestseller', 'Crisp golden fermented rice crepe roasted in pure A2 ghee, generously dusted with gun-powder podi spice, filled with spiced potato masala, served with 3 house chutneys and hot sambar.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85', '340 kcal', 1, 2, 4.9, 1, 0),
('cx-02', '02', 'Steamed Ghee Idli & Medu Vada Combo', 'BREAKFAST', 50, '5 mins', 'veg', 'Morning Ritual', 'Two cloud-soft button idlis dipped in clarified ghee paired with a crispy, freshly fried golden medu vada, served with traditional shallot drumstick sambar and fresh coconut dip.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85', '280 kcal', 1, 1, 4.8, 0, 0),
('cx-03', '03', 'Ven Pongal with Cashew Ghee Roast', 'BREAKFAST', 55, '6 mins', 'veg', 'Comfort Bowl', 'Silky melt-in-mouth rice and yellow moong dal cooked with whole crushed black peppercorns, fresh ginger, curry leaves, and crunchy roasted cashews tempered in pure country butter.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '310 kcal', 1, 1, 4.7, 0, 0),
('cx-04', '04', 'Malabar Chicken Dum Biryani', 'MEALS', 130, '7 mins', 'non-veg', 'Chef''s Signature', 'Fragrant short-grain Kaima rice layered with tender spiced chicken marinated in roasted Kerala spices, slow-cooked in dum style. Accompanied by mint onion raita, spicy pickle, and boiled farm egg.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85', '580 kcal', 1, 3, 5.0, 0, 1),
('cx-05', '05', 'Traditional South Indian Executive Meals', 'MEALS', 90, '5 mins', 'veg', 'Full Lunch Feast', 'Unlimited Ponni steamed rice served on eco-leaf with traditional Sambar, spicy Rasam, Kootu, Poriyal of the day, Appalam, curd, spicy pickle, and sweet Payasam.', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=85', '520 kcal', 1, 2, 4.8, 0, 0),
('cx-06', '06', 'Wok-Tossed Schezwan Egg & Chicken Fried Rice', 'MEALS', 95, '10 mins', 'non-veg', 'Canteen Favorite', 'High-flame wok tossed basmati rice with shredded chicken, scrambled farm egg, crisp scallions, bell peppers, and fiery in-house Schezwan red pepper reduction.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85', '490 kcal', 1, 3, 4.9, 0, 0),
('cx-07', '07', 'Flaky Kerala Parotta with Chicken Salna (2 Pcs)', 'MEALS', 80, '6 mins', 'non-veg', 'Street Legend', 'Hand-beaten, multi-layered golden flaky Malabar parottas served steaming hot with rich, aromatic street-style chicken salna gravy and sliced red onions.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=1200&q=85', '460 kcal', 1, 3, 4.9, 0, 0),
('cx-08', '08', 'Charcoal Grilled Paneer Tikka Kathi Roll', 'SNACKS', 75, '8 mins', 'veg', 'Grab & Go', 'Succulent malai paneer cubes marinated in tandoori spices, rolled in a flaky butter parotta with pickled laccha onions, mint coriander chutney, and chatpata chaat masala.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85', '390 kcal', 1, 2, 4.7, 0, 0),
('cx-09', '09', 'Delhi Style Samosa Chaat Platter (2 Pcs)', 'SNACKS', 45, '5 mins', 'veg', 'Evening Craving', 'Crisp pastry triangles stuffed with spiced potatoes and green peas, crushed and drowned in hot ragda chole, whisked yogurt, sweet tamarind glaze, spicy mint chutney, and nylon sev.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85', '320 kcal', 1, 2, 4.8, 0, 0),
('cx-10', '10', 'Peri Peri Seasoned Crispy Golden Fries', 'SNACKS', 60, '7 mins', 'veg', 'Addictive Crunch', 'Double-fried hand-cut Idaho potato batons tossed immediately in spicy African bird’s eye peri-peri seasoning. Served with creamy garlic dip.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=85', '350 kcal', 1, 2, 4.6, 0, 0),
('cx-11', '11', 'Brass Tumbler Degree Filter Coffee', 'DRINKS', 25, '3 mins', 'veg', 'Soul Brew', 'Freshly decocted 80:20 Peaberry Chicory brew frothed with full-cream hot milk, poured from height to create a velvety foam crown. Served in traditional brass dabarah.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85', '110 kcal', 1, 0, 5.0, 0, 0),
('cx-12', '12', 'Kolkata Kulhad Masala Chai', 'DRINKS', 20, '3 mins', 'veg', 'Rainy Day Special', 'Assam CTC tea leaves slow-simmered with crushed green cardamom, dried ginger, cloves, and cinnamon bark, served in an earthy terracotta kulhad.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85', '90 kcal', 1, 1, 4.9, 0, 0),
('cx-13', '13', 'Belgian Dark Chocolate Frappé Cold Coffee', 'DRINKS', 65, '4 mins', 'veg', 'Chilled Fuel', 'Double espresso shot blended with rich Belgian chocolate ganache, chilled dairy, and crushed ice, topped with cocoa dusting and espresso foam.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85', '220 kcal', 1, 0, 4.9, 0, 0),
('cx-14', '14', 'Shikanji Fresh Mint Lime Crusher', 'DRINKS', 35, '3 mins', 'veg', 'Hydration Burst', 'Hand-squeezed Kagzi lime juice shaken with crushed garden spearmint, roasted cumin rock salt, cane sugar, and sparkling soda or chilled water.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85', '75 kcal', 1, 0, 4.7, 0, 0),
('cx-15', '15', 'Sizzling Warm Belgian Walnut Brownie', 'DESSERTS', 80, '5 mins', 'veg', 'Decadent Melt', 'Dense, fudgy 70% dark chocolate brownie packed with roasted California walnuts, warmed through and served with rich chocolate hot fudge drizzle.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85', '410 kcal', 1, 0, 4.9, 0, 0),
('cx-16', '16', 'Royal Shahi Malai Kulfi on Bamboo Stick', 'DESSERTS', 50, '2 mins', 'veg', 'Traditional Chilled', 'Slow-reduced whole buffalo milk infused with Kashmiri saffron strands, green cardamom, chopped Iranian pistachios, and slivered almonds.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=85', '240 kcal', 1, 0, 4.8, 0, 0);

-- 5. Dish Reviews Table (Student Community Feedback)
CREATE TABLE IF NOT EXISTS dish_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Seed Sample Orders
INSERT OR REPLACE INTO orders (id, student_name, reg_no, department, total_amount, pickup_slot, pickup_type, payment_method, status, counter, placed_at, prep_progress) VALUES
('CX-1021', 'Aravind Swaminathan', '22BCS142', 'Computer Science & Engineering', 165, '01:15 PM — Lunch Break', 'scheduled', 'UPI Demo (Verified)', 'READY', 'Counter 2 (Hot Express)', '12:48 PM', 90),
('CX-1022', 'Sneha Rangarajan', '23BIT089', 'Information Technology', 180, '⚡ Ready in 10-12 Mins', 'immediate', 'Cash at Counter', 'PREPARING', 'Counter 1 (Tiffin & Dosa)', '01:02 PM', 55),
('CX-1023', 'Rohan Deshmukh', '21BME205', 'Mechanical Engineering', 145, '01:15 PM — Lunch Break', 'scheduled', 'UPI Demo (Verified)', 'ACCEPTED', 'Counter 3 (Special Gravy)', '01:08 PM', 25),
('CX-1024', 'Kavya Sree', '24BAI017', 'Artificial Intelligence & DS', 155, '03:45 PM — Evening Snack', 'scheduled', 'UPI Demo (Verified)', 'PLACED', 'Counter 2 (Hot Express)', '01:12 PM', 10);

-- Seed Order Items
INSERT INTO order_items (order_id, menu_id, item_name, price, quantity) VALUES
('CX-1021', 'cx-04', 'Malabar Chicken Dum Biryani', 130, 1),
('CX-1021', 'cx-14', 'Shikanji Fresh Mint Lime Crusher', 35, 1),
('CX-1022', 'cx-01', 'Ghee Podi Masala Dosa', 65, 2),
('CX-1022', 'cx-11', 'Brass Tumbler Degree Filter Coffee', 25, 2),
('CX-1023', 'cx-07', 'Flaky Kerala Parotta with Salna', 80, 1),
('CX-1023', 'cx-13', 'Belgian Dark Chocolate Cold Coffee', 65, 1),
('CX-1024', 'cx-08', 'Paneer Tikka Kathi Roll', 75, 1),
('CX-1024', 'cx-15', 'Sizzling Warm Brownie', 80, 1);

-- Seed Sample Dish Reviews
INSERT INTO dish_reviews (menu_id, student_name, rating, comment) VALUES
('cx-04', 'Aravind S. (CSE)', 5, 'The chicken dum biryani is incredible! Dum aroma is authentic and chicken pieces are super tender.'),
('cx-01', 'Sneha R. (IT)', 5, 'Podi dosa is crisp to perfection. Love the fiery gunpowder spice and ginger chutney.'),
('cx-11', 'Rohan D. (Mech)', 5, 'Authentic degree filter coffee. Perfect frothy head in the brass dabarah!'),
('cx-15', 'Kavya S. (AI&DS)', 5, 'Warm walnut brownie with hot chocolate sauce is a lifesaver between continuous lectures.');

