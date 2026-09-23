/**
 * CANTENEX — Reactive State Store & Order Engine
 * Handles persistent menu state, cart calculations, orders, and real-time live sync
 */

import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, INITIAL_REVIEWS, PICKUP_SLOTS } from './data.js';

export function getApiBase() {
  if (typeof window !== 'undefined' && window.CANTENEX_API_URL && window.CANTENEX_API_URL.trim() !== '') {
    return window.CANTENEX_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.protocol === 'file:') return 'http://localhost:8000';
    if (window.location.port === '8000' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return window.location.origin;
  }
  return 'http://localhost:8000';
}

class Store {
  constructor() {
    this.listeners = new Set();
    this.isOnline = true;
    this.adminKey = this.loadSession('cantenex_admin_key', '');
    
    // Load persisted state or fallback with automatic migration
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
      role: 'student', // 'student' | 'admin'
    });
    if (this.currentUser && this.currentUser.name === 'Aravind Swaminathan') {
      this.currentUser.name = 'Dinesh C';
      this.save('cantenex_user', this.currentUser);
    }
    // Update any cached orders referencing old name
    this.orders.forEach(o => {
      if (o.studentName === 'Aravind Swaminathan') o.studentName = 'Dinesh C';
    });
    this.save('cantenex_orders', this.orders);

    // Cross-tab sync support
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

    // Auto-sync with production / local backend
    setTimeout(() => {
      this.syncWithServer();
      this.startLiveSync();
    }, 100);
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

  loadSession(key, fallback) {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  getAdminKey() {
    return this.adminKey;
  }

  setAdminKey(key) {
    this.adminKey = key;
    this.saveSession('cantenex_admin_key', key);
    this.notify('auth', { isAdmin: !!key });
  }

  clearAdminKey() {
    this.adminKey = '';
    this.saveSession('cantenex_admin_key', '');
    this.notify('auth', { isAdmin: false });
  }

  isAdminAuthenticated() {
    return !!this.adminKey;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    this.listeners.forEach((cb) => cb(event, payload));
  }

  // --- Live Server Sync & Polling Engine ---
  async syncWithServer() {
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/menu`, { cache: 'no-store' });
      if (res.ok) {
        const serverMenu = await res.json();
        if (Array.isArray(serverMenu) && serverMenu.length > 0) {
          this.menu = serverMenu;
          this.save('cantenex_menu', this.menu);
          this.notify('menu');
        }
      }

      const ordersRes = await fetch(`${apiBase}/api/orders`, { cache: 'no-store' });
      if (ordersRes.ok) {
        const serverOrders = await ordersRes.json();
        if (Array.isArray(serverOrders)) {
          this.orders = serverOrders;
          this.save('cantenex_orders', this.orders);
          this.notify('orders');
        }
      }
    } catch (err) {
      // Backend not reached, keep fallback
      this.isOnline = false;
    }
  }

  startLiveSync(intervalMs = 4000) {
    if (this._syncTimer) clearInterval(this._syncTimer);
    this._syncTimer = setInterval(async () => {
      try {
        const apiBase = getApiBase();
        const ordersRes = await fetch(`${apiBase}/api/orders`, { cache: 'no-store' });
        if (ordersRes.ok) {
          const serverOrders = await ordersRes.json();
          if (Array.isArray(serverOrders) && JSON.stringify(serverOrders) !== JSON.stringify(this.orders)) {
            this.orders = serverOrders;
            this.save('cantenex_orders', this.orders);
            this.notify('orders');
          }
        }
      } catch (e) {}
    }, intervalMs);
  }

  // --- Cart Actions ---
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

  removeFromCart(id) {
    this.cart = this.cart.filter((i) => i.id !== id);
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

  // --- Order Actions ---
  async placeOrder({ studentName, regNo, department, paymentMethod }) {
    if (this.cart.length === 0) return null;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CX-${randomNum}`;
    
    // Assign designated counter based on item categories
    const hasDosa = this.cart.some((i) => i.id === 'cx-01' || i.id === 'cx-02' || i.id === 'cx-17' || i.id === 'cx-19');
    const hasDrinkOnly = this.cart.every((i) => i.diet === 'veg' && (i.id.includes('11') || i.id.includes('12') || i.id.includes('13') || i.id.includes('14') || i.id.includes('31') || i.id.includes('32') || i.id.includes('33') || i.id.includes('34')));
    
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

    // Optimistically update local state
    this.orders.unshift(newOrder);
    this.save('cantenex_orders', this.orders);
    
    this.activeTrackingId = orderId;
    this.save('cantenex_active_tracking', this.activeTrackingId);

    // Update current user info
    this.currentUser = {
      ...this.currentUser,
      name: studentName || this.currentUser.name,
      regNo: regNo || this.currentUser.regNo,
      department: department || this.currentUser.department,
    };
    this.save('cantenex_user', this.currentUser);

    this.clearCart();
    this.notify('orders');
    this.notify('order_placed', newOrder);

    // Asynchronously dispatch to FastAPI Production Backend
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          studentName: newOrder.studentName,
          regNo: newOrder.regNo,
          department: newOrder.department,
          items: newOrder.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          pickupSlot: newOrder.pickupSlot,
          pickupType: newOrder.pickupType,
          paymentMethod: newOrder.paymentMethod,
          counter: newOrder.counter,
          placedAt: newOrder.placedAt,
          prepProgress: 15
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order && data.order.totalAmount) {
          newOrder.totalAmount = data.order.totalAmount;
          this.save('cantenex_orders', this.orders);
          this.notify('orders');
        }
      }
    } catch (e) {
      // Local fallback active
    }

    return newOrder;
  }

  async updateOrderStatus(orderId, nextStatus) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = nextStatus;
      if (nextStatus === 'PLACED') order.prepProgress = 15;
      if (nextStatus === 'ACCEPTED') order.prepProgress = 35;
      if (nextStatus === 'PREPARING') order.prepProgress = 65;
      if (nextStatus === 'READY') order.prepProgress = 95;
      if (nextStatus === 'COMPLETED') order.prepProgress = 100;
      
      this.save('cantenex_orders', this.orders);
      this.notify('orders');
      this.notify('order_updated', order);

      // Async backend update
      try {
        const apiBase = getApiBase();
        const headers = { 'Content-Type': 'application/json' };
        if (this.adminKey) headers['X-Admin-Key'] = this.adminKey;

        await fetch(`${apiBase}/api/orders/update-status`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ orderId, status: nextStatus })
        });
      } catch (e) {}
    }
  }

  // --- Admin Menu Controls ---
  async toggleItemStock(itemId) {
    const item = this.menu.find((i) => i.id === itemId);
    if (item) {
      item.inStock = !item.inStock;
      this.save('cantenex_menu', this.menu);
      this.notify('menu');

      try {
        const apiBase = getApiBase();
        const headers = { 'Content-Type': 'application/json' };
        if (this.adminKey) headers['X-Admin-Key'] = this.adminKey;

        await fetch(`${apiBase}/api/menu/toggle-stock`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId })
        });
      } catch (e) {}
    }
  }

  async updateItemPrice(itemId, newPrice) {
    const item = this.menu.find((i) => i.id === itemId);
    if (item && newPrice > 0) {
      item.price = Number(newPrice);
      this.save('cantenex_menu', this.menu);
      this.notify('menu');

      try {
        const apiBase = getApiBase();
        const headers = { 'Content-Type': 'application/json' };
        if (this.adminKey) headers['X-Admin-Key'] = this.adminKey;

        await fetch(`${apiBase}/api/menu/update-price`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, price: Number(newPrice) })
        });
      } catch (e) {}
    }
  }

  // --- Student Community Reviews & Ratings ---
  async addReview({ menuId, studentName, rating, comment }) {
    const newRev = {
      id: `rev-${Date.now()}`,
      menuId,
      studentName: studentName || this.currentUser.name,
      rating: Number(rating) || 5,
      comment: comment || 'Delicious and freshly prepared!',
      date: 'Just now',
      timestamp: Date.now(),
    };

    this.reviews.unshift(newRev);
    this.save('cantenex_reviews', this.reviews);

    // Update dish average rating in menu
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

    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId,
          studentName: newRev.studentName,
          rating: newRev.rating,
          comment: newRev.comment
        })
      });
    } catch (e) {}

    return newRev;
  }

  getReviews(menuId) {
    return this.reviews.filter((r) => r.menuId === menuId);
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

  // --- Database Studio Query Engine (API with safe fallback) ---
  async executeSQL(rawSql, presetKey = null) {
    const sql = (rawSql || '').trim().replace(/;$/, '');
    const apiBase = getApiBase();

    // Try backend API first if admin authenticated
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.adminKey) headers['X-Admin-Key'] = this.adminKey;

      const res = await fetch(`${apiBase}/api/sql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: sql, preset: presetKey })
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fall back to client parser
    }

    // Client-Side fallback
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

  // --- Metrics derived from local and server orders ---
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
}

export const store = new Store();

// Helper to generate dynamic SVG QR Code representation
export function generateQRCodeSVG(text, size = 160) {
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
