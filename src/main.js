/**
 * Sarawan Fast Food - Main Frontend Orchestrator
 * Pure Vanilla JavaScript implementation.
 * Handles menu rendering, category filtering, cart drawer, checkout modal,
 * demo order processing, toasts, and mobile responsiveness.
 */

import { MENU_ITEMS, CATEGORIES, RESTAURANT_INFO } from './menu-data.js';
import { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  getCartTotals,
  DELIVERY_FEE 
} from './cart.js';
import { validateCheckoutForm, processDemoOrder } from './checkout.js';

// State
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements cache
let dom = {};

function initDom() {
  dom = {
    // Nav & Counts
    cartCountBadges: document.querySelectorAll('.cart-count-badge'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileMenuDrawer: document.getElementById('mobile-menu-drawer'),
    closeMobileMenuBtn: document.getElementById('close-mobile-menu'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),

    // Cart Drawer
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    openCartBtns: document.querySelectorAll('.open-cart-btn'),
    floatingCartBtn: document.getElementById('floating-cart-btn'),
    floatingCartCount: document.getElementById('floating-cart-count'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartEmptyState: document.getElementById('cart-empty-state'),
    cartFooter: document.getElementById('cart-footer'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartDeliveryFee: document.getElementById('cart-delivery-fee'),
    cartGrandTotal: document.getElementById('cart-grand-total'),
    clearCartBtn: document.getElementById('clear-cart-btn'),
    proceedCheckoutBtn: document.getElementById('proceed-checkout-btn'),

    // Menu Sections
    popularGrid: document.getElementById('popular-dishes-grid'),
    menuGrid: document.getElementById('full-menu-grid'),
    categoryTabsContainer: document.getElementById('category-tabs'),
    menuSearchInput: document.getElementById('menu-search-input'),

    // Checkout Modal
    checkoutModal: document.getElementById('checkout-modal'),
    closeCheckoutBtn: document.getElementById('close-checkout-btn'),
    backToCartBtn: document.getElementById('back-to-cart-btn'),
    checkoutForm: document.getElementById('checkout-form'),
    checkoutItemsSummary: document.getElementById('checkout-items-summary'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutDeliveryFee: document.getElementById('checkout-delivery-fee'),
    checkoutTotal: document.getElementById('checkout-total'),
    checkoutPlaceOrderBtn: document.getElementById('place-order-btn'),

    // Order Success Modal
    orderSuccessModal: document.getElementById('order-success-modal'),
    closeSuccessBtn: document.getElementById('close-success-btn'),
    successNewOrderBtn: document.getElementById('success-new-order-btn'),
    successOrderId: document.getElementById('success-order-id'),
    successCustomerName: document.getElementById('success-customer-name'),
    successDeliveryAddress: document.getElementById('success-delivery-address'),
    successTotalAmount: document.getElementById('success-total-amount'),
    successItemsSummary: document.getElementById('success-items-summary'),
    copyOrderIdBtn: document.getElementById('copy-order-id-btn'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };
}

// Toast notification helper
export function showToast(message, type = 'success') {
  if (!dom.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
    type === 'error'
      ? 'bg-red-950/90 text-red-200 border-red-800/80 shadow-red-950/40'
      : 'bg-zinc-900/95 text-zinc-100 border-amber-500/40 shadow-black/80'
  }`;

  const iconSvg = type === 'error'
    ? `<svg class="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">${message}</div>
    <button type="button" class="text-zinc-400 hover:text-white ml-2 text-lg leading-none cursor-pointer">&times;</button>
  `;

  toast.querySelector('button').addEventListener('click', () => toast.remove());
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Render "Our Popular Dishes"
function renderPopularDishes() {
  if (!dom.popularGrid) return;
  const popularDishes = MENU_ITEMS.filter((item) => item.isPopular);

  dom.popularGrid.innerHTML = popularDishes.map((dish) => `
    <div class="food-card bg-[#151824] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group" id="dish-card-${dish.id}">
      <div class="relative overflow-hidden aspect-[4/3] bg-zinc-900">
        <img 
          src="${dish.image}" 
          alt="${dish.name}" 
          loading="lazy" 
          class="food-img w-full h-full object-cover"
          onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#151824] via-transparent to-transparent opacity-80"></div>
        <div class="absolute top-3 left-3">
          <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-amber-500 text-black shadow-md">
            ${dish.tag || dish.categoryLabel}
          </span>
        </div>
        <div class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-zinc-300">
          ${dish.portion || dish.categoryLabel}
        </div>
      </div>
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h4 class="text-sm sm:text-base font-semibold text-white group-hover:text-amber-400 transition-colors">${dish.name}</h4>
            <span class="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 font-normal shrink-0">
              ${dish.categoryLabel}
            </span>
          </div>
          <p class="text-xs text-zinc-400 font-normal line-clamp-2 mb-3 sm:mb-4 leading-relaxed">${dish.description}</p>
        </div>
        <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <span class="text-[10px] sm:text-[11px] text-zinc-400 block uppercase font-normal">Price</span>
            <span class="text-base sm:text-lg font-semibold text-amber-400 font-display">Rs. ${dish.price.toLocaleString()}</span>
          </div>
          <button 
            type="button"
            data-dish-id="${dish.id}"
            class="add-to-cart-btn inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer touch-manipulation min-h-[38px]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Category Filter Tabs
function renderCategoryTabs() {
  if (!dom.categoryTabsContainer) return;

  dom.categoryTabsContainer.innerHTML = CATEGORIES.map((cat) => {
    const count = cat.id === 'all' 
      ? MENU_ITEMS.length 
      : MENU_ITEMS.filter((item) => item.category === cat.id).length;
    const isActive = currentCategory === cat.id;

    return `
      <button 
        type="button"
        data-category="${cat.id}"
        class="category-tab-btn px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation min-h-[38px] ${
          isActive
            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
            : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-white/5'
        }"
      >
        <span>${cat.label}</span>
        <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
          isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
        }">${count}</span>
      </button>
    `;
  }).join('');
}

// Render Full Menu with Filtering
function renderFullMenu() {
  if (!dom.menuGrid) return;

  const filtered = MENU_ITEMS.filter((item) => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    dom.menuGrid.innerHTML = `
      <div class="col-span-full py-16 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl border border-white/5 p-8">
        <svg class="w-12 h-12 mx-auto text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <h4 class="text-lg font-bold text-zinc-200 mb-1">No dishes match your search</h4>
        <p class="text-sm text-zinc-400 mb-4">Try clearing your search query or selecting a different category.</p>
        <button 
          type="button" 
          id="reset-menu-filters-btn"
          class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-menu-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        searchQuery = '';
        if (dom.menuSearchInput) dom.menuSearchInput.value = '';
        renderCategoryTabs();
        renderFullMenu();
      });
    }
    return;
  }

  dom.menuGrid.innerHTML = filtered.map((dish) => `
    <div class="food-card bg-[#151824] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group" id="full-menu-card-${dish.id}">
      <div class="relative overflow-hidden aspect-[16/10] bg-zinc-900">
        <img 
          src="${dish.image}" 
          alt="${dish.name}" 
          loading="lazy" 
          class="food-img w-full h-full object-cover"
          onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#151824] via-transparent to-transparent opacity-80"></div>
        <div class="absolute top-3 left-3 flex items-center gap-1.5">
          <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider bg-zinc-900/90 text-amber-400 border border-amber-400/30 backdrop-blur-md">
            ${dish.categoryLabel}
          </span>
          ${dish.isPopular ? `<span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-red-600/90 text-white">Popular</span>` : ''}
        </div>
        <div class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] sm:text-xs font-normal text-zinc-300">
          ${dish.portion || dish.categoryLabel}
        </div>
      </div>
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 class="text-sm sm:text-base font-semibold text-white group-hover:text-amber-400 transition-colors mb-1.5">${dish.name}</h4>
          <p class="text-xs text-zinc-400 font-normal line-clamp-2 mb-3 sm:mb-4 leading-relaxed">${dish.description}</p>
        </div>
        <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <span class="text-[10px] sm:text-[11px] text-zinc-400 block uppercase font-normal">Price</span>
            <span class="text-base sm:text-lg font-semibold text-amber-400 font-display">Rs. ${dish.price.toLocaleString()}</span>
          </div>
          <button 
            type="button"
            data-dish-id="${dish.id}"
            class="add-to-cart-btn inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer touch-manipulation min-h-[38px]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Update Cart Badges across Navbar & Floating Button
function updateCartBadgeCounts() {
  const { count } = getCartTotals();
  
  dom.cartCountBadges.forEach((badge) => {
    badge.textContent = count;
    badge.classList.remove('badge-bounce');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('badge-bounce');
  });

  if (dom.floatingCartCount) {
    dom.floatingCartCount.textContent = count;
  }

  // Show/hide floating mobile cart button
  if (dom.floatingCartBtn) {
    if (count > 0) {
      dom.floatingCartBtn.classList.remove('translate-y-24', 'opacity-0');
      dom.floatingCartBtn.classList.add('translate-y-0', 'opacity-100');
    } else {
      dom.floatingCartBtn.classList.add('translate-y-24', 'opacity-0');
      dom.floatingCartBtn.classList.remove('translate-y-0', 'opacity-100');
    }
  }
}

// Render Cart Drawer Content
function renderCartDrawer() {
  const totals = getCartTotals();
  updateCartBadgeCounts();

  if (!dom.cartItemsContainer) return;

  if (totals.items.length === 0) {
    dom.cartItemsContainer.classList.add('hidden');
    dom.cartEmptyState.classList.remove('hidden');
    dom.cartFooter.classList.add('hidden');
    return;
  }

  dom.cartEmptyState.classList.add('hidden');
  dom.cartItemsContainer.classList.remove('hidden');
  dom.cartFooter.classList.remove('hidden');

  dom.cartItemsContainer.innerHTML = totals.items.map((item) => `
    <div class="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 group hover:border-white/10 transition-colors" data-cart-item-id="${item.id}">
      <img 
        src="${item.image}" 
        alt="${item.name}" 
        class="w-16 h-16 rounded-lg object-cover bg-zinc-800 shrink-0"
        onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-1">
          <h5 class="text-sm font-semibold text-zinc-100 truncate">${item.name}</h5>
          <button 
            type="button" 
            data-cart-remove="${item.id}"
            title="Remove item"
            class="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
        <p class="text-xs text-amber-400 font-medium mb-2">Rs. ${item.price.toLocaleString()} each</p>
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center bg-zinc-950 rounded-lg border border-white/10 p-0.5">
            <button 
              type="button" 
              data-cart-decrease="${item.id}" 
              class="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors text-xs font-semibold cursor-pointer"
            >-</button>
            <span class="w-8 text-center text-xs font-semibold text-white">${item.quantity}</span>
            <button 
              type="button" 
              data-cart-increase="${item.id}" 
              class="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors text-xs font-semibold cursor-pointer"
            >+</button>
          </div>
          <span class="text-sm font-semibold text-zinc-200">
            Rs. ${(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  if (dom.cartSubtotal) dom.cartSubtotal.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
  if (dom.cartDeliveryFee) dom.cartDeliveryFee.textContent = `Rs. ${totals.deliveryFee.toLocaleString()}`;
  if (dom.cartGrandTotal) dom.cartGrandTotal.textContent = `Rs. ${totals.total.toLocaleString()}`;
}

// Open / Close Cart Drawer
function openCartDrawer() {
  renderCartDrawer();
  if (dom.cartDrawer) {
    dom.cartDrawer.classList.add('open');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCartDrawer() {
  if (dom.cartDrawer) {
    dom.cartDrawer.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
  }
}

// Render Order Summary inside Checkout Modal
function renderCheckoutSummary() {
  const totals = getCartTotals();
  if (!dom.checkoutItemsSummary) return;

  dom.checkoutItemsSummary.innerHTML = totals.items.map((item) => `
    <div class="flex items-center justify-between text-xs py-2 border-b border-white/5 text-zinc-300">
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-zinc-800 text-amber-400 font-bold flex items-center justify-center text-[11px]">${item.quantity}x</span>
        <span class="font-medium text-white">${item.name}</span>
      </div>
      <span class="font-semibold text-zinc-200">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  if (dom.checkoutSubtotal) dom.checkoutSubtotal.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
  if (dom.checkoutDeliveryFee) dom.checkoutDeliveryFee.textContent = `Rs. ${totals.deliveryFee.toLocaleString()}`;
  if (dom.checkoutTotal) dom.checkoutTotal.textContent = `Rs. ${totals.total.toLocaleString()}`;
}

// Open Checkout Modal
function openCheckoutModal() {
  const totals = getCartTotals();
  if (totals.count === 0) {
    showToast('Your cart is empty. Please add items to proceed.', 'error');
    return;
  }
  closeCartDrawer();
  renderCheckoutSummary();
  if (dom.checkoutModal) {
    dom.checkoutModal.classList.add('open');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCheckoutModal() {
  if (dom.checkoutModal) {
    dom.checkoutModal.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
  }
}

// Show Order Success Screen
function showOrderSuccess(order) {
  closeCheckoutModal();

  if (dom.successOrderId) dom.successOrderId.textContent = order.orderId;
  if (dom.successCustomerName) dom.successCustomerName.textContent = order.customer.name;
  if (dom.successDeliveryAddress) dom.successDeliveryAddress.textContent = order.customer.address;
  if (dom.successTotalAmount) dom.successTotalAmount.textContent = `Rs. ${order.total.toLocaleString()}`;

  if (dom.successItemsSummary) {
    dom.successItemsSummary.innerHTML = order.items.map((item) => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-white/5 text-zinc-300">
        <span>${item.quantity}x ${item.name}</span>
        <span class="font-semibold text-zinc-200">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('') + `
      <div class="flex items-center justify-between text-xs pt-2 text-zinc-400">
        <span>Delivery to Aziz Nagar:</span>
        <span class="text-zinc-300 font-medium">Rs. ${order.deliveryFee}</span>
      </div>
      <div class="flex items-center justify-between text-sm pt-2 font-semibold text-amber-400">
        <span>Total Payable (Cash):</span>
        <span>Rs. ${order.total.toLocaleString()}</span>
      </div>
    `;
  }

  if (dom.orderSuccessModal) {
    dom.orderSuccessModal.classList.add('open');
    document.body.classList.add('overflow-hidden');
  }

  renderCartDrawer();
}

function closeSuccessModal() {
  if (dom.orderSuccessModal) {
    dom.orderSuccessModal.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Mobile Menu Toggle
  if (dom.mobileMenuToggle && dom.mobileMenuDrawer) {
    dom.mobileMenuToggle.addEventListener('click', () => {
      dom.mobileMenuDrawer.classList.toggle('hidden');
    });
  }
  if (dom.closeMobileMenuBtn && dom.mobileMenuDrawer) {
    dom.closeMobileMenuBtn.addEventListener('click', () => {
      dom.mobileMenuDrawer.classList.add('hidden');
    });
  }
  dom.mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (dom.mobileMenuDrawer) dom.mobileMenuDrawer.classList.add('hidden');
    });
  });

  // Open Cart
  dom.openCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
  if (dom.floatingCartBtn) {
    dom.floatingCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Close Cart
  if (dom.closeCartBtn) {
    dom.closeCartBtn.addEventListener('click', closeCartDrawer);
  }
  if (dom.cartBackdrop) {
    dom.cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  // Global Add to Cart & Cart Item Actions delegation
  document.addEventListener('click', (e) => {
    // Add to cart buttons
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      const dishId = addBtn.getAttribute('data-dish-id');
      const dish = MENU_ITEMS.find((d) => d.id === dishId);
      if (dish) {
        addToCart(dish, 1);
        showToast(`Added ${dish.name} to cart!`);
        renderCartDrawer();
      }
      return;
    }

    // Cart Increase quantity
    const increaseBtn = e.target.closest('[data-cart-increase]');
    if (increaseBtn) {
      const id = increaseBtn.getAttribute('data-cart-increase');
      updateQuantity(id, 1);
      renderCartDrawer();
      renderCheckoutSummary();
      return;
    }

    // Cart Decrease quantity
    const decreaseBtn = e.target.closest('[data-cart-decrease]');
    if (decreaseBtn) {
      const id = decreaseBtn.getAttribute('data-cart-decrease');
      updateQuantity(id, -1);
      renderCartDrawer();
      renderCheckoutSummary();
      return;
    }

    // Cart Remove item
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-cart-remove');
      removeFromCart(id);
      showToast('Item removed from cart');
      renderCartDrawer();
      renderCheckoutSummary();
      return;
    }

    // Category filter tabs
    const categoryBtn = e.target.closest('.category-tab-btn');
    if (categoryBtn) {
      const catId = categoryBtn.getAttribute('data-category');
      if (catId) {
        currentCategory = catId;
        renderCategoryTabs();
        renderFullMenu();
      }
      return;
    }
  });

  // Clear cart button
  if (dom.clearCartBtn) {
    dom.clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
        showToast('Cart cleared');
        renderCartDrawer();
      }
    });
  }

  // Search input
  if (dom.menuSearchInput) {
    dom.menuSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderFullMenu();
    });
  }

  // Proceed to Checkout button
  if (dom.proceedCheckoutBtn) {
    dom.proceedCheckoutBtn.addEventListener('click', () => {
      openCheckoutModal();
    });
  }

  // Checkout Back / Close buttons
  if (dom.closeCheckoutBtn) {
    dom.closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  }
  if (dom.backToCartBtn) {
    dom.backToCartBtn.addEventListener('click', () => {
      closeCheckoutModal();
      openCartDrawer();
    });
  }

  // Checkout Form Submission
  if (dom.checkoutForm) {
    dom.checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById('customer-name')?.value || '',
        phone: document.getElementById('customer-phone')?.value || '',
        address: document.getElementById('customer-address')?.value || '',
        notes: document.getElementById('order-notes')?.value || ''
      };

      const validation = validateCheckoutForm(formData);

      // Clear previous error messages
      document.querySelectorAll('.form-error').forEach((el) => {
        el.textContent = '';
        el.classList.add('hidden');
      });

      if (!validation.isValid) {
        for (const [field, msg] of Object.entries(validation.errors)) {
          const errEl = document.getElementById(`error-${field}`);
          if (errEl) {
            errEl.textContent = msg;
            errEl.classList.remove('hidden');
          } else {
            showToast(msg, 'error');
          }
        }
        return;
      }

      // Simulate placing demo order
      if (dom.checkoutPlaceOrderBtn) {
        dom.checkoutPlaceOrderBtn.disabled = true;
        dom.checkoutPlaceOrderBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Placing Demo Order...
        `;
      }

      setTimeout(() => {
        const order = processDemoOrder(formData);
        if (dom.checkoutPlaceOrderBtn) {
          dom.checkoutPlaceOrderBtn.disabled = false;
          dom.checkoutPlaceOrderBtn.innerHTML = `Place Demo Order (Cash on Delivery)`;
        }
        dom.checkoutForm.reset();
        showOrderSuccess(order);
      }, 700);
    });
  }

  // Order Success Modal Actions
  if (dom.closeSuccessBtn) {
    dom.closeSuccessBtn.addEventListener('click', closeSuccessModal);
  }
  if (dom.successNewOrderBtn) {
    dom.successNewOrderBtn.addEventListener('click', () => {
      closeSuccessModal();
      window.location.hash = '#menu';
    });
  }

  // Copy Order ID
  if (dom.copyOrderIdBtn && dom.successOrderId) {
    dom.copyOrderIdBtn.addEventListener('click', () => {
      const orderId = dom.successOrderId.textContent;
      navigator.clipboard.writeText(orderId).then(() => {
        showToast(`Copied ${orderId} to clipboard!`);
      }).catch(() => {
        showToast(`Order ID: ${orderId}`);
      });
    });
  }

  // Listen to cart-updated custom events
  window.addEventListener('cart-updated', () => {
    updateCartBadgeCounts();
  });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  initDom();
  renderPopularDishes();
  renderCategoryTabs();
  renderFullMenu();
  renderCartDrawer();
  setupEventListeners();
});

// Also run immediately if script executed after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initDom();
  renderPopularDishes();
  renderCategoryTabs();
  renderFullMenu();
  renderCartDrawer();
  setupEventListeners();
}
