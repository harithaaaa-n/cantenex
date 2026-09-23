/**
 * CANTENEX — Main Application Controller & UI Logic (ES Module version)
 */

import { store, generateQRCodeSVG } from './store.js';
import { sounds } from './audio.js';
import { init3DDepth } from './depth3d.js';
import { PICKUP_SLOTS, DEPARTMENTS } from './data.js';

let activeCategory = 'ALL';
let activeDiet = 'ALL';
let activeSort = 'popular';
let searchQuery = '';
let pendingCheckoutData = null;
let selectedSpotlightRating = 5;
let lastQueryResults = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

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
  bindAdminAuthModal();
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
      openDishSpotlight(item);
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

let pendingAdminAction = null;

function openAdminAuthModal(action) {
  pendingAdminAction = action;
  const modal = document.getElementById('modal-admin-auth');
  const errorEl = document.getElementById('admin-auth-error');
  const inputEl = document.getElementById('admin-passcode-input');
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.innerText = '';
  }
  if (inputEl) {
    inputEl.value = '';
    setTimeout(() => inputEl.focus(), 100);
  }
  if (modal) modal.classList.add('active');
}

function bindAdminAuthModal() {
  const modal = document.getElementById('modal-admin-auth');
  const closeBtn = document.getElementById('btn-close-admin-auth');
  const form = document.getElementById('form-admin-auth');
  const errorEl = document.getElementById('admin-auth-error');
  const inputEl = document.getElementById('admin-passcode-input');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      sounds.playClick();
      modal.classList.remove('active');
      pendingAdminAction = null;
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredSecret = inputEl ? inputEl.value.trim() : '';
      if (!enteredSecret) return;

      try {
        const apiBase = window.CANTENEX_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin);
        const res = await fetch(`${apiBase}/api/admin/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: enteredSecret })
        });
        
        if (res.ok || enteredSecret === 'admin123') {
          store.setAdminKey(enteredSecret);
          if (modal) modal.classList.remove('active');
          showToast('Staff Access Granted', 'Kitchen staff controls unlocked', 'success');
          sounds.playSuccess();

          if (pendingAdminAction === 'admin_view') {
            toggleAdminView();
          } else if (pendingAdminAction === 'sqlite_studio') {
            const sqModal = document.getElementById('sqlite-modal');
            if (sqModal) sqModal.classList.add('active');
          }
          pendingAdminAction = null;
          return;
        }
      } catch (err) {
        if (enteredSecret === 'admin123') {
          store.setAdminKey(enteredSecret);
          if (modal) modal.classList.remove('active');
          showToast('Staff Access Granted', 'Offline staff controls unlocked', 'success');
          sounds.playSuccess();
          if (pendingAdminAction === 'admin_view') {
            toggleAdminView();
          } else if (pendingAdminAction === 'sqlite_studio') {
            const sqModal = document.getElementById('sqlite-modal');
            if (sqModal) sqModal.classList.add('active');
          }
          pendingAdminAction = null;
          return;
        }
      }

      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.innerText = '✕ Invalid staff passcode. Try "admin123".';
      }
    });
  }
}

function toggleAdminView() {
  const mainLandings = document.querySelectorAll('.student-view');
  const adminView = document.getElementById('admin-view');
  const adminBtn = document.getElementById('btn-toggle-admin');

  const isEnteringAdmin = !adminView.classList.contains('active');

  if (isEnteringAdmin) {
    if (!store.isAdminAuthenticated()) {
      openAdminAuthModal('admin_view');
      return;
    }
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

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      sounds.playClick();
      if (!store.isAdminAuthenticated()) {
        openAdminAuthModal('sqlite_studio');
        return;
      }
      if (modal) modal.classList.add('active');
    });
  }

  const executeCurrentSQL = async () => {
    const sql = queryInput?.value.trim();
    if (!sql) return;
    sounds.playClick();
    const t0 = performance.now();
    try {
      const res = await store.executeSQL(sql);
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
