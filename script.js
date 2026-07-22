// Swiggy Web Clone Application Logic (scrpit.js wrapper)
// Imports / mirror of script.js logic

// Mock Restaurant Dataset
const RESTAURANT_DATA = [
  {
    id: 1,
    name: "Meghana Foods",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
    offer: "50% OFF UPTO ₹100",
    rating: 4.5,
    deliveryTime: "25-30 mins",
    cuisines: "Biryani, Andhra, South Indian",
    location: "Koramangala, Bangalore",
    price: 350,
    category: "biryani",
    pureVeg: false
  },
  {
    id: 2,
    name: "Domino's Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    offer: "₹150 OFF ABOVE ₹399",
    rating: 4.3,
    deliveryTime: "20-25 mins",
    cuisines: "Pizzas, Italian, Pastas, Desserts",
    location: "Indiranagar",
    price: 299,
    category: "pizza",
    pureVeg: false
  },
  {
    id: 3,
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    offer: "60% OFF UPTO ₹120",
    rating: 4.2,
    deliveryTime: "30-35 mins",
    cuisines: "Burgers, American, Fast Food",
    location: "MG Road, Bangalore",
    price: 199,
    category: "burger",
    pureVeg: false
  },
  {
    id: 4,
    name: "Punjab Grill & Thali",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80",
    offer: "FLAT 20% OFF",
    rating: 4.6,
    deliveryTime: "35-40 mins",
    cuisines: "North Indian, Thali, Punjabi, Kebabs",
    location: "HSR Layout",
    price: 450,
    category: "north-indian",
    pureVeg: false
  },
  {
    id: 5,
    name: "A2B - Adyar Ananda Bhavan",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
    offer: "20% OFF UPTO ₹50",
    rating: 4.4,
    deliveryTime: "15-20 mins",
    cuisines: "South Indian, Dosa, Sweets, Pure Veg",
    location: "BTM Layout",
    price: 150,
    category: "dosa",
    pureVeg: true
  },
  {
    id: 6,
    name: "The Belgian Waffle Co.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80",
    offer: "20% OFF",
    rating: 4.7,
    deliveryTime: "20-25 mins",
    cuisines: "Waffles, Desserts, Ice Cream, Beverages",
    location: "Jayanagar",
    price: 220,
    category: "cakes",
    pureVeg: true
  },
  {
    id: 7,
    name: "Mainland China & Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80",
    offer: "ITEMS AT ₹179",
    rating: 4.1,
    deliveryTime: "30-35 mins",
    cuisines: "Chinese, Asian, Dimsum, Noodles",
    location: "Whitefield",
    price: 320,
    category: "chinese",
    pureVeg: false
  },
  {
    id: 8,
    name: "Subway Fresh Gourmet",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
    offer: "BUY 1 GET 1 FREE",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    cuisines: "Healthy Food, Salads, Sandwiches",
    location: "Bellandur",
    price: 250,
    category: "burger",
    pureVeg: false
  }
];

let cartState = {};
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderRestaurants(RESTAURANT_DATA);
  initEventListeners();
});

function renderRestaurants(restaurants) {
  const grid = document.getElementById('restaurant-grid');
  if (!grid) return;

  if (restaurants.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: var(--muted);">
        <i class="fa-solid fa-utensils" style="font-size: 48px; margin-bottom: 12px; color: #ccc;"></i>
        <h3>No restaurants found matching your selection</h3>
        <p>Try searching for a different dish or clearing your filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = restaurants.map(res => {
    const inCart = cartState[res.id];
    const count = inCart ? inCart.count : 0;
    const vegBadge = res.pureVeg
      ? `<div class="veg-badge"><span class="veg-dot veg"></span>VEG</div>`
      : '';

    return `
      <div class="restaurant-card" data-id="${res.id}">
        <div class="card-banner">
          <img src="${res.image}" alt="${res.name}" loading="lazy" />
          <div class="card-banner-overlay"></div>
          ${vegBadge}
          <div class="card-offer-badge">${res.offer}</div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${res.name}</h3>
          <div class="card-meta">
            <span class="rating-pill"><i class="fa-solid fa-star"></i> ${res.rating}</span>
            <span class="dot-sep">•</span>
            <span class="delivery-time">${res.deliveryTime}</span>
          </div>
          <p class="card-cuisines">${res.cuisines}</p>
          <p class="card-location">${res.location}</p>

          <div class="card-action-bar">
            <span class="item-price">₹${res.price} for two</span>
            <div id="btn-container-${res.id}">
              ${count > 0 ? `
                <div class="qty-control">
                  <button class="qty-btn" onclick="updateItemCount(${res.id}, -1)">−</button>
                  <span class="qty-num">${count}</span>
                  <button class="qty-btn" onclick="updateItemCount(${res.id}, 1)">+</button>
                </div>
              ` : `
                <button class="add-btn" onclick="addToCart(${res.id})">ADD +</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.addToCart = function (resId) {
  const item = RESTAURANT_DATA.find(r => r.id === resId);
  if (!item) return;

  if (!cartState[resId]) {
    cartState[resId] = { item: item, count: 1 };
  } else {
    cartState[resId].count += 1;
  }

  updateCartUI();
  renderRestaurants(getFilteredRestaurants());
  showToast(`Added ${item.name} item to cart`);
};

window.updateItemCount = function (resId, change) {
  if (!cartState[resId]) return;

  cartState[resId].count += change;

  if (cartState[resId].count <= 0) {
    delete cartState[resId];
    showToast(`Removed from cart`);
  }

  updateCartUI();
  renderRestaurants(getFilteredRestaurants());
};

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartItemCountNav = document.getElementById('cart-count-nav');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');

  let totalCount = 0;
  let subtotal = 0;
  let itemsHtml = '';

  Object.keys(cartState).forEach(id => {
    const entry = cartState[id];
    totalCount += entry.count;
    subtotal += entry.item.price * entry.count;

    itemsHtml += `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${entry.item.name}</div>
          <div class="cart-item-price">₹${entry.item.price} × ${entry.count}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateItemCount(${entry.item.id}, -1)">−</button>
          <span class="qty-num">${entry.count}</span>
          <button class="qty-btn" onclick="updateItemCount(${entry.item.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  if (cartBadge) cartBadge.innerText = totalCount;
  if (cartItemCountNav) cartItemCountNav.innerText = totalCount;

  if (cartItemsContainer) {
    if (totalCount === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-view">
          <i class="fa-solid fa-basket-shopping"></i>
          <h3>Your cart is empty</h3>
          <p style="color:var(--muted);font-size:13px">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = itemsHtml;
    }
  }

  const deliveryFee = totalCount > 0 ? 35 : 0;
  const taxes = totalCount > 0 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + deliveryFee + taxes;

  if (cartSubtotalEl) cartSubtotalEl.innerText = `₹${subtotal}`;
  if (cartTotalEl) cartTotalEl.innerText = `₹${grandTotal}`;
}

function getFilteredRestaurants() {
  let list = [...RESTAURANT_DATA];

  const searchInput = document.getElementById('search-input');
  if (searchInput && searchInput.value.trim() !== '') {
    const query = searchInput.value.toLowerCase().trim();
    list = list.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.cuisines.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    );
  }

  if (activeFilter === 'rating') {
    list = list.filter(r => r.rating >= 4.4);
  } else if (activeFilter === 'fast') {
    list = list.filter(r => parseInt(r.deliveryTime) <= 25);
  } else if (activeFilter === 'veg') {
    list = list.filter(r => r.pureVeg === true);
  } else if (activeFilter === 'budget') {
    list = list.filter(r => r.price <= 250);
  }

  return list;
}

function initEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderRestaurants(getFilteredRestaurants());
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      activeFilter = target.getAttribute('data-filter') || 'all';
      renderRestaurants(getFilteredRestaurants());
    });
  });

  const cartTrigger = document.getElementById('cart-nav-trigger');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart-btn');

  if (cartTrigger) {
    cartTrigger.addEventListener('click', () => {
      cartDrawerOverlay.classList.add('active');
      cartDrawer.classList.add('active');
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartDrawerOverlay.classList.remove('active');
      cartDrawer.classList.remove('active');
    });
  }

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) {
        cartDrawerOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
      }
    });
  }

  const locationPicker = document.getElementById('location-picker-btn');
  const locationModal = document.getElementById('location-modal');
  const closeLocationModal = document.getElementById('close-location-modal');

  if (locationPicker && locationModal) {
    locationPicker.addEventListener('click', () => {
      locationModal.classList.add('active');
    });
  }
  if (closeLocationModal && locationModal) {
    closeLocationModal.addEventListener('click', () => {
      locationModal.classList.remove('active');
    });
  }

  const signinTrigger = document.getElementById('signin-trigger');
  const signinModal = document.getElementById('signin-modal');
  const closeSigninModal = document.getElementById('close-signin-modal');

  if (signinTrigger && signinModal) {
    signinTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      signinModal.classList.add('active');
    });
  }
  if (closeSigninModal && signinModal) {
    closeSigninModal.addEventListener('click', () => {
      signinModal.classList.remove('active');
    });
  }

  const categoryPills = document.querySelectorAll('.category-item');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-cat');
      if (cat) {
        const filtered = RESTAURANT_DATA.filter(r => r.category === cat || r.cuisines.toLowerCase().includes(cat));
        renderRestaurants(filtered.length > 0 ? filtered : RESTAURANT_DATA);
        showToast(`Filtered by ${cat.toUpperCase()}`);
      }
    });
  });
}

window.selectCity = function (cityName) {
  const selectedLocation = document.getElementById('current-location-text');
  if (selectedLocation) {
    selectedLocation.value = `${cityName}, India`;
  }
  const locationModal = document.getElementById('location-modal');
  if (locationModal) {
    locationModal.classList.remove('active');
  }
  showToast(`Location updated to ${cityName}`);
};

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}
