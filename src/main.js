import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* ==========================================
   1. THREE.JS 3D HERO ANIMATION SETUP
   ========================================== */
const canvas = document.getElementById('three-canvas');
const container = document.getElementById('canvas-container');

// Create Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00f29d, 2.5);
dirLight.position.set(5, 5, 2);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x4f46e5, 3, 15);
pointLight.position.set(-4, -2, 2);
scene.add(pointLight);

// Group to contain all 3D meshes (Pill and Cross)
const mainGroup = new THREE.Group();
scene.add(mainGroup);

// --- Capsule (Pill) Model Creation ---
const capsuleGroup = new THREE.Group();
mainGroup.add(capsuleGroup);

const pillRadius = 0.7;
const pillHeight = 0.8; // Half height of cylinder segment
const segments = 32;

// Materials
const shinyGreenMaterial = new THREE.MeshStandardMaterial({
  color: 0x00f29d,
  roughness: 0.15,
  metalness: 0.8,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const shinyWhiteMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 0.8
});

// Top Half (Green)
const topCylGeo = new THREE.CylinderGeometry(pillRadius, pillRadius, pillHeight, segments);
const topCylMesh = new THREE.Mesh(topCylGeo, shinyGreenMaterial);
topCylMesh.position.y = pillHeight / 2;
capsuleGroup.add(topCylMesh);

const topSphereGeo = new THREE.SphereGeometry(pillRadius, segments, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const topSphereMesh = new THREE.Mesh(topSphereGeo, shinyGreenMaterial);
topSphereMesh.position.y = pillHeight;
capsuleGroup.add(topSphereMesh);

// Bottom Half (White)
const bottomCylGeo = new THREE.CylinderGeometry(pillRadius, pillRadius, pillHeight, segments);
const bottomCylMesh = new THREE.Mesh(bottomCylGeo, shinyWhiteMaterial);
bottomCylMesh.position.y = -pillHeight / 2;
capsuleGroup.add(bottomCylMesh);

const bottomSphereGeo = new THREE.SphereGeometry(pillRadius, segments, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const bottomSphereMesh = new THREE.Mesh(bottomSphereGeo, shinyWhiteMaterial);
bottomSphereMesh.position.y = -pillHeight;
capsuleGroup.add(bottomSphereMesh);

// --- Floating 3D Medical Cross Model ---
const crossGroup = new THREE.Group();
mainGroup.add(crossGroup);

const shinyBlueMaterial = new THREE.MeshStandardMaterial({
  color: 0x0b6df6,
  emissive: 0x0b6df6,
  emissiveIntensity: 0.4,
  roughness: 0.1,
  metalness: 0.9
});

const barSize = 0.22;
const barLength = 0.8;
const horizBarGeo = new THREE.BoxGeometry(barLength, barSize, barSize);
const horizBar = new THREE.Mesh(horizBarGeo, shinyBlueMaterial);
crossGroup.add(horizBar);

const vertBarGeo = new THREE.BoxGeometry(barSize, barLength, barSize);
const vertBar = new THREE.Mesh(vertBarGeo, shinyBlueMaterial);
crossGroup.add(vertBar);

// Position cross relative to capsule
crossGroup.position.set(-1.8, 0.8, -0.5);
crossGroup.scale.set(0.7, 0.7, 0.7);

// Render loop variable for passive rotation
let clock = new THREE.Clock();

// --- Responsive Setup for 3D Positions ---
let isMobile = window.innerWidth < 768;

function update3DLayout() {
  isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Mobile layouts (centered, further back, acts as background)
    mainGroup.position.set(0, 0, -2);
    mainGroup.scale.set(0.85, 0.85, 0.85);
  } else {
    // Desktop layout
    mainGroup.position.set(2.5, 0, 0);
    mainGroup.scale.set(1.1, 1.1, 1.1);
  }
}
update3DLayout();

// Window Resize Listener
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  update3DLayout();
});

// Render Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsed = clock.getElapsedTime();
  
  // Continuous passive idle rotations
  capsuleGroup.rotation.y = elapsed * 0.4;
  capsuleGroup.rotation.x = elapsed * 0.15;
  
  crossGroup.rotation.y = -elapsed * 0.5;
  crossGroup.position.y = 0.8 + Math.sin(elapsed * 2) * 0.15;

  renderer.render(scene, camera);
}
animate();

/* ==========================================
   2. GSAP SCROLL-LINKED ANIMATIONS
   ========================================== */
// We animate the mainGroup relative to scroll trigger sections
const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2,
    invalidateOnRefresh: true
  }
});

// Define Scroll Path for Desktop vs Mobile
if (!isMobile) {
  scrollTimeline
    // Move 1: Hero to Store Category Section
    .to(mainGroup.position, { x: -2.8, y: -0.2, z: 0.5, duration: 1 })
    .to(mainGroup.rotation, { x: 0.4, y: 1.8, z: -0.8, duration: 1 }, 0)
    
    // Move 2: Store to Services Section
    .to(mainGroup.position, { x: 2.6, y: -0.5, z: -0.2, duration: 1 })
    .to(mainGroup.rotation, { x: -0.6, y: 0.2, z: 1.2, duration: 1 }, 1)
    
    // Move 3: Services to AI Prescription Scanner Section
    .to(mainGroup.position, { x: 0, y: -0.8, z: -4.0, duration: 1 })
    .to(mainGroup.rotation, { x: 2.2, y: 1.5, z: 0, duration: 1 }, 2)
    .to(mainGroup.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 1 }, 2);
} else {
  // Mobile Scroll Path (Maintains centered background layout, scales down slightly)
  scrollTimeline
    .to(mainGroup.position, { x: 0, y: 0.5, z: -3.0, duration: 1 })
    .to(mainGroup.rotation, { x: 1.2, y: 1.8, z: 0, duration: 1 }, 0)
    
    .to(mainGroup.position, { x: 0, y: -0.5, z: -2.5, duration: 1 })
    .to(mainGroup.rotation, { x: -0.5, y: 0.5, z: 0.5, duration: 1 }, 1)
    
    .to(mainGroup.position, { x: 0, y: 0, z: -4.5, duration: 1 })
    .to(mainGroup.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1 }, 2);
}


/* ==========================================
   3. MEDICINE STORE CATALOG & CART MANAGEMENT
   ========================================== */
const PRODUCTS = [
  // Prescriptions
  { id: 'amox500', name: 'Amoxicillin 500mg', category: 'prescriptions', price: 14.99, icon: '💊', desc: 'Broad-spectrum antibiotic used to treat bacterial infections.' },
  { id: 'met800', name: 'Metformin 800mg', category: 'prescriptions', price: 9.99, icon: '💊', desc: 'First-line medication for the treatment of type 2 diabetes.' },
  { id: 'ator20', name: 'Atorvastatin 20mg', category: 'prescriptions', price: 24.99, icon: '💊', desc: 'Statin medication used to prevent cardiovascular disease.' },
  { id: 'albut90', name: 'Albuterol Inhaler', category: 'prescriptions', price: 18.99, icon: '💨', desc: 'Bronchodilator that relaxes muscles in the airways for asthma relief.' },
  
  // Wellness
  { id: 'vitc1000', name: 'Vitamin C 1000mg', category: 'wellness', price: 8.99, icon: '🍊', desc: 'Essential vitamin promoting immune system and skin health.' },
  { id: 'omega3', name: 'Omega-3 Fish Oil', category: 'wellness', price: 15.49, icon: '🐟', desc: 'Supports cardiovascular, joint, and cognitive health.' },
  { id: 'vitd3', name: 'Vitamin D3 5000 IU', category: 'wellness', price: 12.99, icon: '☀️', desc: 'Supports bone density, immune response, and overall wellness.' },
  { id: 'ashwa', name: 'Organic Ashwagandha', category: 'wellness', price: 19.99, icon: '🌱', desc: 'Natural adaptogenic herb formulated to help reduce stress and anxiety.' },

  // Personal Care
  { id: 'sunspf50', name: 'Sunscreen SPF 50', category: 'personal-care', price: 16.99, icon: '🧴', desc: 'Broad-spectrum daily protection against UVA and UVB rays.' },
  { id: 'ceramide', name: 'Ceramide Face Cream', category: 'personal-care', price: 14.49, icon: '🧴', desc: 'Rich daily moisturizing formula restoring skin barrier defenses.' },
  { id: 'hyasex', name: 'Hyaluronic Acid Serum', category: 'personal-care', price: 22.99, icon: '💧', desc: 'Deep hydration serum targeting fine lines and dry areas.' },

  // Chronic & Home Care
  { id: 'bpmon', name: 'Blood Pressure Monitor', category: 'chronic-care', price: 45.00, icon: '❤️', desc: 'Fully automatic digital arm cuff monitor with high accuracy.' },
  { id: 'glucmeter', name: 'Glucose Meter kit', category: 'chronic-care', price: 29.99, icon: '🩸', desc: 'Blood sugar test kit includes monitor, lancets, and 50 strips.' },
  { id: 'pulseox', name: 'Fingertip Pulse Oximeter', category: 'chronic-care', price: 19.99, icon: '🩺', desc: 'Accurately displays pulse rate and oxygen saturation (SpO2).' }
];

let cart = [];
let activeCategory = 'all';
let searchQuery = '';

const productsGrid = document.getElementById('products-grid');
const categoryTabs = document.getElementById('category-tabs');
const searchInput = document.getElementById('hero-search-input');
const searchBtn = document.getElementById('hero-search-btn');

// Render Catalog Products
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';

  const filtered = PRODUCTS.filter(product => {
    const matchesCat = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<div class="cart-empty-message w-full text-center" style="grid-column: 1/-1;">No products match your search.</div>`;
    return;
  }

  filtered.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-tag">${prod.category.replace('-', ' ')}</span>
      <div>
        <div class="product-icon">${prod.icon}</div>
        <div class="product-info">
          <h3>${prod.name}</h3>
          <p class="product-desc">${prod.desc}</p>
        </div>
      </div>
      <div class="product-actions">
        <span class="product-price">$${prod.price.toFixed(2)}</span>
        <button class="btn-add-cart" data-id="${prod.id}" aria-label="Add ${prod.name} to Cart">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Attach event listeners to Add to Cart buttons
  const addButtons = productsGrid.querySelectorAll('.btn-add-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      addToCart(id);
    });
  });
}

// Add Item to Cart
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showSystemAlert(`Added ${product.name} to cart.`);
}

// Remove or Decrement from Cart
function removeFromCart(productId, forceAll = false) {
  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex === -1) return;

  if (forceAll || cart[existingIndex].quantity <= 1) {
    cart.splice(existingIndex, 1);
  } else {
    cart[existingIndex].quantity -= 1;
  }

  updateCartUI();
}

// Update Cart Badge, Container & Total Details
const cartBadge = document.getElementById('cart-badge-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartShippingEl = document.getElementById('cart-shipping');
const cartTotalEl = document.getElementById('cart-total');
const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');

function updateCartUI() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItemsCount;

  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="cart-empty-message">Your cart is currently empty.</div>`;
    cartSubtotalEl.textContent = '$0.00';
    cartShippingEl.textContent = '$0.00';
    cartTotalEl.textContent = '$0.00';
    checkoutSubmitBtn.disabled = true;
    return;
  }

  checkoutSubmitBtn.disabled = false;
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div style="font-size: 24px;">${item.icon}</div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span>$${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-quantity">
        <button class="btn-qty-minus" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="btn-qty-plus" data-id="${item.id}">+</button>
      </div>
      <button class="btn-remove-item" data-id="${item.id}">&times;</button>
    `;
    cartItemsContainer.appendChild(itemRow);
  });

  // Calculate fees
  const shipping = subtotal > 35 ? 0.00 : 4.99;
  const total = subtotal + shipping;

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartShippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  // Attach quantity change listeners
  cartItemsContainer.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id')));
  });

  cartItemsContainer.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
  });

  cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id'), true));
  });
}

// Category tabs filters
if (categoryTabs) {
  categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      categoryTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category');
      renderProducts();
    }
  });
}

// Search Inputs
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value;
    renderProducts();
    // Scroll to store
    document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchQuery = searchInput.value;
      renderProducts();
      document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Chip click fills search
document.querySelectorAll('.search-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    searchInput.value = chip.textContent;
    searchQuery = chip.textContent;
    renderProducts();
    document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
  });
});


/* ==========================================
   4. NAVIGATION MENU & CART DRAWER TOGGLES
   ========================================== */
const cartDrawer = document.getElementById('cart-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');

function toggleCart(open) {
  if (open) {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
  } else {
    cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  }
}

cartToggleBtn.addEventListener('click', () => toggleCart(true));
cartCloseBtn.addEventListener('click', () => toggleCart(false));
drawerOverlay.addEventListener('click', () => toggleCart(false));

// Mobile Navigation Panel
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

mobileMenuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});


/* ==========================================
   5. THEME TOGGLER (DARK / LIGHT)
   ========================================== */
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const htmlEl = document.documentElement;

// Initialize theme from local storage or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  showSystemAlert(`Switched to ${newTheme} mode.`);
});


/* ==========================================
   6. AI PRESCRIPTION SCANNER (MOCK ACTION)
   ========================================== */
const dropzone = document.getElementById('scanner-dropzone');
const scannerFileInput = document.getElementById('scanner-file-input');
const scannerLoader = document.getElementById('scanning-loader');
const dropzoneText = document.getElementById('dropzone-text');
const scanningStatus = document.getElementById('scanning-status');

// Trigger file input dialog
dropzone.addEventListener('click', () => {
  if (!dropzone.classList.contains('scanning')) {
    scannerFileInput.click();
  }
});

// Drag and drop event listeners
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  }, false);
});

dropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    handlePrescriptionScan(files[0]);
  }
});

scannerFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handlePrescriptionScan(e.target.files[0]);
  }
});

// Simulate AI Scan processing
function handlePrescriptionScan(file) {
  dropzone.classList.add('scanning');
  dropzoneText.classList.add('hidden');
  scannerLoader.classList.remove('hidden');
  
  // Phase 1: Scan
  scanningStatus.textContent = 'Scanning document layers...';
  
  // Phase 2: Read handwriting (simulated)
  setTimeout(() => {
    scanningStatus.textContent = 'Transcribing physician handwriting...';
  }, 1200);

  // Phase 3: Match medicine registry
  setTimeout(() => {
    scanningStatus.textContent = 'Matching database item numbers...';
  }, 2400);

  // Phase 4: Match successful, add to cart
  setTimeout(() => {
    dropzone.classList.remove('scanning');
    dropzoneText.classList.remove('hidden');
    scannerLoader.classList.add('hidden');
    
    // Add scanned mock products
    addToCart('amox500');
    addToCart('vitc1000');
    
    showSystemAlert("Successfully scanned! Amoxicillin and Vitamin C added to cart.");
    toggleCart(true); // Open cart to show user
  }, 3800);
}


/* ==========================================
   7. SMART HEALTH HUB: BMI & WATER LOG
   ========================================== */
const bmiWeightInput = document.getElementById('bmi-weight');
const bmiHeightInput = document.getElementById('bmi-height');
const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
const bmiResultOutput = document.getElementById('bmi-result-output');
const bmiValueEl = document.getElementById('bmi-value');
const bmiCatEl = document.getElementById('bmi-cat');

calculateBmiBtn.addEventListener('click', () => {
  const w = parseFloat(bmiWeightInput.value);
  const h = parseFloat(bmiHeightInput.value) / 100; // to meters

  if (!w || !h || w <= 0 || h <= 0) {
    showSystemAlert("Please enter valid weight and height measurements.");
    return;
  }

  const bmi = w / (h * h);
  bmiValueEl.textContent = bmi.toFixed(1);
  
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  bmiCatEl.textContent = category;
  bmiResultOutput.classList.remove('hidden');
});

// Hydration wave tracker
let waterGoal = 2500;
let waterLogged = 0;
const waterWave = document.getElementById('water-wave');
const waterLoggedEl = document.getElementById('water-logged');

function updateWaterUI() {
  const percentage = Math.min((waterLogged / waterGoal) * 100, 100);
  waterWave.style.height = `${percentage}%`;
  waterLoggedEl.textContent = (waterLogged / 1000).toFixed(2);
}

document.getElementById('add-water-250').addEventListener('click', () => {
  waterLogged += 250;
  updateWaterUI();
});

document.getElementById('add-water-500').addEventListener('click', () => {
  waterLogged += 500;
  updateWaterUI();
});

document.getElementById('reset-water').addEventListener('click', () => {
  waterLogged = 0;
  updateWaterUI();
});


/* ==========================================
   8. INTAKE PILL REMINDER WIDGET
   ========================================== */
const reminderForm = document.getElementById('reminder-form');
const remindPillInput = document.getElementById('remind-pill-name');
const remindTimeInput = document.getElementById('remind-time');
const reminderList = document.getElementById('reminder-list');
let reminders = [];

reminderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const pillName = remindPillInput.value.trim();
  const alertTime = remindTimeInput.value;

  if (!pillName || !alertTime) return;

  const id = Date.now().toString();
  reminders.push({ id, pillName, alertTime });
  
  remindPillInput.value = '';
  remindTimeInput.value = '';
  
  updateRemindersUI();
  showSystemAlert(`Reminder set for ${pillName} at ${alertTime}.`);
});

function updateRemindersUI() {
  reminderList.innerHTML = '';
  
  if (reminders.length === 0) {
    reminderList.innerHTML = `<li class="empty-list-msg">No active reminders scheduled.</li>`;
    return;
  }

  reminders.forEach(rem => {
    const li = document.createElement('li');
    li.className = 'reminder-item';
    li.innerHTML = `
      <div>
        <span>${rem.pillName}</span>
        <small>${rem.alertTime}</small>
      </div>
      <button class="btn-delete-reminder" data-id="${rem.id}" aria-label="Delete reminder">&times;</button>
    `;
    reminderList.appendChild(li);
  });

  // Attach delete handlers
  reminderList.querySelectorAll('.btn-delete-reminder').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      reminders = reminders.filter(r => r.id !== id);
      updateRemindersUI();
    });
  });
}

// Alarm loop checking clock time every second
setInterval(() => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeString = `${hours}:${minutes}`;

  reminders.forEach((rem, idx) => {
    if (rem.alertTime === currentTimeString) {
      // Trigger notification alert
      showSystemAlert(`⏰ Pill Time: Take your ${rem.pillName}!`);
      
      // Basic browser notification if permitted
      if (Notification.permission === "granted") {
        new Notification("AuraRx Medicine Reminder", {
          body: `It is time to take your scheduled dose of ${rem.pillName}.`,
          icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22%2300F29D%22/></svg>'
        });
      }
      
      // Remove reminder to prevent loop triggers within the same minute
      reminders.splice(idx, 1);
      updateRemindersUI();
    }
  });
}, 1000);

// Request browser notifications access on load
if (window.Notification && Notification.permission !== "denied") {
  Notification.requestPermission();
}


/* ==========================================
   9. BLOOD TEST & DOCTOR CONSULTATION BOOKINGS
   ========================================== */
const bookingModal = document.getElementById('booking-modal');
const modalOverlay = document.getElementById('modal-overlay');
const openBookingBtn = document.getElementById('open-booking-modal-btn');
const closeBookingBtn = document.getElementById('booking-modal-close-btn');
const bloodForm = document.getElementById('blood-booking-form');

function toggleBookingModal(open) {
  if (open) {
    bookingModal.classList.add('open');
    modalOverlay.classList.add('open');
  } else {
    bookingModal.classList.remove('open');
    modalOverlay.classList.remove('open');
  }
}

openBookingBtn.addEventListener('click', () => toggleBookingModal(true));
closeBookingBtn.addEventListener('click', () => toggleBookingModal(false));
modalOverlay.addEventListener('click', () => toggleBookingModal(false));

// Phlebotomy test quick-pill clicks fill the form select dropdown
document.querySelectorAll('.popular-tests .test-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const testName = pill.getAttribute('data-test');
    const select = document.getElementById('book-test-type');
    
    // Select option by value match
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.includes(testName)) {
        select.selectedIndex = i;
        break;
      }
    }
    toggleBookingModal(true);
  });
});

bloodForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toggleBookingModal(false);
  const pName = document.getElementById('book-patient-name').value;
  const testName = document.getElementById('book-test-type').value;
  showSystemAlert(`Success! Diagnostic test "${testName}" scheduled for ${pName}.`);
  bloodForm.reset();
});

// Doctor Consultation Booking
const consultBtn = document.getElementById('consultation-book-btn');
const doctorCards = document.querySelectorAll('.doctors-list .doctor-card');
let selectedDoctor = "Dr. Sarah Lin (Cardiologist)";

doctorCards.forEach(card => {
  card.addEventListener('click', () => {
    doctorCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedDoctor = card.getAttribute('data-doc');
  });
});

consultBtn.addEventListener('click', () => {
  showSystemAlert(`Connecting call to ${selectedDoctor}... Room code: Aura-${Math.floor(Math.random()*90000+10000)}`);
});


/* ==========================================
   10. ORDER CHECKOUT & STATUS PROGRESS
   ========================================== */
const addressInput = document.getElementById('cart-address-input');
const trackOrderIdEl = document.getElementById('track-order-id');
const trackTimeEl = document.getElementById('track-time');
const trackStatusBadge = document.getElementById('track-status-badge');
const trackerFooter = document.getElementById('tracker-footer-actions');
const cancelOrderBtn = document.getElementById('cancel-order-btn');

let activeOrderTimer = null;
let currentOrderStep = 1;

// Checkout submit action
checkoutSubmitBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  if (!address) {
    showSystemAlert("Please provide a valid delivery address.");
    return;
  }

  // Create mock order reference
  const orderId = `ARX-${Math.floor(Math.random() * 899999 + 100000)}`;
  trackOrderIdEl.textContent = `#${orderId}`;
  
  const d = new Date();
  trackTimeEl.textContent = `Placed on ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  
  trackStatusBadge.className = 'track-badge active-delivery';
  trackStatusBadge.textContent = 'Processing';
  
  // Clear cart and close drawer
  cart = [];
  updateCartUI();
  toggleCart(false);
  addressInput.value = '';

  // Reset and start delivery timeline simulator
  currentOrderStep = 1;
  updateTimelineUI();
  trackerFooter.classList.remove('hidden');
  
  document.getElementById('order-tracker-section').scrollIntoView({ behavior: 'smooth' });
  showSystemAlert(`Order ${orderId} successfully placed! Track status below.`);
  
  // Simulate live status updates every 15 seconds
  if (activeOrderTimer) clearInterval(activeOrderTimer);
  activeOrderTimer = setInterval(() => {
    if (currentOrderStep < 4) {
      currentOrderStep++;
      updateTimelineUI();
      
      let statusText = 'Processing';
      if (currentOrderStep === 2) {
        statusText = 'Packed';
        showSystemAlert("Your AuraRx order has been packed and is ready for dispatch!");
      } else if (currentOrderStep === 3) {
        statusText = 'Out for Delivery';
        showSystemAlert("A courier has picked up your order and is heading to your address!");
      } else if (currentOrderStep === 4) {
        statusText = 'Delivered';
        trackStatusBadge.className = 'track-badge idle';
        trackerFooter.classList.add('hidden');
        showSystemAlert("Success! Your medicines have been delivered. Thank you for choosing AuraRx.");
        clearInterval(activeOrderTimer);
      }
      trackStatusBadge.textContent = statusText;
    }
  }, 15000);
});

// Update timeline graphics classes
function updateTimelineUI() {
  for (let step = 1; step <= 4; step++) {
    const el = document.getElementById(`step-${step}`);
    if (step <= currentOrderStep) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }
}

// Cancel Active Order
cancelOrderBtn.addEventListener('click', () => {
  if (activeOrderTimer) {
    clearInterval(activeOrderTimer);
    activeOrderTimer = null;
  }
  
  trackOrderIdEl.textContent = `#ARX-000000`;
  trackTimeEl.textContent = `Cancelled`;
  trackStatusBadge.className = 'track-badge idle';
  trackStatusBadge.textContent = 'Cancelled';
  
  currentOrderStep = 0;
  updateTimelineUI();
  trackerFooter.classList.add('hidden');
  showSystemAlert("Your active order has been cancelled.");
});


/* ==========================================
   11. SYSTEM NOTIFICATIONS CONTROLLER
   ========================================== */
const alertEl = document.getElementById('system-alert');
const alertMsgEl = document.getElementById('system-alert-msg');
let alertTimeout = null;

function showSystemAlert(message) {
  alertMsgEl.textContent = message;
  alertEl.classList.add('show');
  
  if (alertTimeout) clearTimeout(alertTimeout);
  
  alertTimeout = setTimeout(() => {
    alertEl.classList.remove('show');
  }, 3500);
}


/* ==========================================
   INITIALIZE PAGE APP STATE
   ========================================== */
renderProducts();
updateCartUI();
updateWaterUI();
updateRemindersUI();

// Force refresh ScrollTrigger to align positions correctly after elements load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});


/* ==========================================
   12. NEW 3D OBJECTS: EMERGENCY CROSS & STETHOSCOPE
   ========================================== */

// --- 3D Emergency Cross (Red) ---
const emCrossGroup = new THREE.Group();
scene.add(emCrossGroup);

const emCrossMaterial = new THREE.MeshStandardMaterial({
  color: 0xff2222,
  emissive: 0xff0000,
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.7
});

const emBarSize = 0.18;
const emBarLength = 0.7;
const emHoriz = new THREE.Mesh(new THREE.BoxGeometry(emBarLength, emBarSize, emBarSize), emCrossMaterial);
emCrossGroup.add(emHoriz);
const emVert = new THREE.Mesh(new THREE.BoxGeometry(emBarSize, emBarLength, emBarSize), emCrossMaterial);
emCrossGroup.add(emVert);

// Glow ring around cross
const glowRingGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
const glowRingMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.3
});
const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
glowRing.rotation.x = Math.PI / 4;
emCrossGroup.add(glowRing);

// Position: off to the left side
emCrossGroup.position.set(-3.5, 1.5, -1);
emCrossGroup.scale.set(0.8, 0.8, 0.8);

// --- 3D Stethoscope Ring for OPD Section ---
const stethGroup = new THREE.Group();
scene.add(stethGroup);

const stethMaterial = new THREE.MeshStandardMaterial({
  color: 0x4f46e5,
  roughness: 0.2,
  metalness: 0.9,
  emissive: 0x4f46e5,
  emissiveIntensity: 0.2
});

const stethRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.08, 16, 48),
  stethMaterial
);
stethGroup.add(stethRing);

// Small inner circle
const innerCircle = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x00f29d, emissive: 0x00f29d, emissiveIntensity: 0.3 })
);
innerCircle.position.set(0, 0.6, 0);
stethGroup.add(innerCircle);

// Connecting tube piece
const tubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), tubeMat);
tube.position.set(-0.5, -0.3, 0);
tube.rotation.z = -0.3;
stethGroup.add(tube);

// Position: off to the right side
stethGroup.position.set(4, 2, -2);
stethGroup.scale.set(0.9, 0.9, 0.9);


/* ==========================================
   13. GSAP SCROLL ANIMATIONS FOR NEW SECTIONS
   ========================================== */

// Emergency section scroll trigger (red cross flies in from left)
gsap.fromTo(emCrossGroup.position,
  { x: -6, y: 1.5, z: -1 },
  {
    scrollTrigger: {
      trigger: "#emergency",
      start: "top bottom",
      end: "top center",
      scrub: 1.5,
      invalidateOnRefresh: true
    },
    x: -3.5,
    ease: "power2.out"
  }
);

// Emergency cross rotation animation on scroll
gsap.to(emCrossGroup.rotation, {
  scrollTrigger: {
    trigger: "#emergency",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    invalidateOnRefresh: true
  },
  y: Math.PI * 2,
  z: 0.5,
  ease: "none"
});

// OPD section scroll trigger (stethoscope slides in from right)
gsap.fromTo(stethGroup.position,
  { x: 6, y: 2, z: -2 },
  {
    scrollTrigger: {
      trigger: "#opd-search",
      start: "top bottom",
      end: "top center",
      scrub: 1.5,
      invalidateOnRefresh: true
    },
    x: 4,
    ease: "power2.out"
  }
);

// Stethoscope spin on scroll
gsap.to(stethGroup.rotation, {
  scrollTrigger: {
    trigger: "#opd-search",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    invalidateOnRefresh: true
  },
  y: -Math.PI * 2,
  x: 0.3,
  ease: "none"
});

// Animate glow ring opacity
gsap.to(glowRing.material, {
  scrollTrigger: {
    trigger: "#emergency",
    start: "top bottom",
    end: "bottom top",
    scrub: 1
  },
  opacity: 0.6,
  ease: "none"
});

// Emergency Contacts stagger entrance
gsap.from(".em-contact-card", {
  scrollTrigger: {
    trigger: "#emergency-contacts",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 0.8,
  ease: "power3.out"
});

// SOS button entrance
gsap.from("#sos-container", {
  scrollTrigger: {
    trigger: "#emergency",
    start: "top 80%",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  scale: 0.5,
  duration: 1,
  ease: "back.out(1.7)"
});

// Ambulance tracker entrance
gsap.from("#ambulance-tracker", {
  scrollTrigger: {
    trigger: "#ambulance-tracker",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power3.out"
});

// OPD filters entrance
gsap.from(".opd-filters", {
  scrollTrigger: {
    trigger: ".opd-filters",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power3.out"
});

// OPD results cards stagger entrance (handled dynamically, but initial empty state)
gsap.from(".opd-empty", {
  scrollTrigger: {
    trigger: ".opd-results",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  y: 30,
  duration: 0.6,
  ease: "power3.out"
});


/* ==========================================
   14. EMERGENCY SECTION LOGIC
   ========================================== */

// SOS Button Handler
const sosBtn = document.getElementById('sos-btn');
const ambulanceStatus = document.getElementById('ambulance-status');
const ambTimeline = document.getElementById('ambulance-timeline');
const ambMarker = document.getElementById('ambulance-marker');
const ambEta = document.getElementById('amb-eta');
const simulateAmbBtn = document.getElementById('simulate-ambulance-btn');
const cancelAmbBtn = document.getElementById('cancel-ambulance-btn');

let ambTimer = null;
let ambStep = 0;

function resetAmbulanceTracker() {
  if (ambTimer) {
    clearInterval(ambTimer);
    ambTimer = null;
  }
  ambStep = 0;
  document.querySelectorAll('.amb-step').forEach(s => {
    s.classList.remove('active', 'done');
  });
  document.querySelector('.amb-step[data-step="1"]').classList.add('active');
  ambulanceStatus.textContent = 'Standby';
  ambulanceStatus.className = 'tracker-status';
  ambMarker.className = 'ambulance-marker';
  ambEta.textContent = '--';
  ambMarker.style.left = '10%';
  ambMarker.style.top = '20%';
}

sosBtn.addEventListener('click', () => {
  showSystemAlert("🚨 SOS Activated! Emergency services have been notified. Stay calm, help is on the way.");
  startAmbulanceSimulation();
});

simulateAmbBtn.addEventListener('click', () => {
  startAmbulanceSimulation();
});

cancelAmbBtn.addEventListener('click', () => {
  resetAmbulanceTracker();
  showSystemAlert("Ambulance dispatch cancelled.");
});

function startAmbulanceSimulation() {
  resetAmbulanceTracker();
  
  ambStep = 1;
  ambulanceStatus.textContent = 'SOS Received';
  ambulanceStatus.className = 'tracker-status active';
  document.querySelector('.amb-step[data-step="1"]').classList.add('done');
  document.querySelector('.amb-step[data-step="2"]').classList.add('active');
  
  // Simulate step progression
  const steps = [
    { status: 'Ambulance Dispatched', eta: 8, markerLeft: '25%', markerTop: '25%' },
    { status: 'En Route', eta: 5, markerLeft: '50%', markerTop: '35%' },
    { status: 'Arriving', eta: 2, markerLeft: '75%', markerTop: '30%' },
    { status: 'Arrived', eta: 0, markerLeft: '85%', markerTop: '30%' }
  ];

  let stepIndex = 0;
  ambTimer = setInterval(() => {
    if (stepIndex < steps.length) {
      const step = steps[stepIndex];
      const ambStepEl = document.querySelector(`.amb-step[data-step="${stepIndex + 2}"]`);
      
      // Mark current as done, next as active
      if (stepIndex + 1 < 4) {
        document.querySelector(`.amb-step[data-step="${stepIndex + 2}"]`).classList.remove('active');
        document.querySelector(`.amb-step[data-step="${stepIndex + 2}"]`).classList.add('done');
        if (stepIndex + 2 < 4) {
          document.querySelector(`.amb-step[data-step="${stepIndex + 3}"]`).classList.add('active');
        }
      }

      ambulanceStatus.textContent = step.status;
      ambEta.textContent = step.eta;
      
      if (step.markerLeft) {
        ambMarker.style.left = step.markerLeft;
        ambMarker.style.top = step.markerTop;
      }
      
      if (stepIndex === 0) ambMarker.classList.add('moving');
      if (stepIndex === 3) {
        ambMarker.classList.remove('moving');
        ambMarker.classList.add('arrived');
        ambulanceStatus.className = 'tracker-status arrived';
        ambulanceStatus.textContent = 'Arrived ✓';
        showSystemAlert("🚑 Ambulance has arrived at your location! Emergency team is ready.");
        clearInterval(ambTimer);
        ambTimer = null;
      }
      
      stepIndex++;
    } else {
      clearInterval(ambTimer);
      ambTimer = null;
    }
  }, 4000);
}

// Emergency Call Buttons
document.querySelectorAll('.em-call-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const phone = btn.getAttribute('data-phone');
    showSystemAlert(`📞 Dialing emergency number: ${phone}... (Demo simulation)`);
  });
});


/* ==========================================
   15. OPD DOCTOR SEARCH & BOOKING LOGIC
   ========================================== */

// Doctor Database
const DOCTORS = [
  { id: 'd1', name: 'Dr. Priya Sharma', specialty: 'Cardiologist', hospital: 'Aura Heart Institute', bodypart: 'heart', symptoms: ['chest-pain', 'dizziness'], experience: 15, fee: 75, ageGroup: ['31-55', '55+'], gender: 'female', timings: 'Mon-Sat 9AM-2PM', available: true },
  { id: 'd2', name: 'Dr. Rajesh Kumar', specialty: 'Neurologist', hospital: 'Aura Brain & Spine Center', bodypart: 'brain', symptoms: ['headache', 'dizziness'], experience: 18, fee: 90, ageGroup: ['13-30', '31-55', '55+'], gender: 'male', timings: 'Mon-Fri 10AM-4PM', available: true },
  { id: 'd3', name: 'Dr. Meera Patel', specialty: 'Pulmonologist', hospital: 'City General Hospital', bodypart: 'lungs', symptoms: ['fever'], experience: 12, fee: 65, ageGroup: ['0-12', '13-30', '31-55', '55+'], gender: 'female', timings: 'Tue-Sat 8AM-1PM', available: true },
  { id: 'd4', name: 'Dr. Ankit Verma', specialty: 'Ophthalmologist', hospital: 'Vision Eye Clinic', bodypart: 'eyes', symptoms: ['vision-blur'], experience: 10, fee: 55, ageGroup: ['13-30', '31-55', '55+'], gender: 'male', timings: 'Mon-Sat 10AM-6PM', available: false },
  { id: 'd5', name: 'Dr. Sneha Reddy', specialty: 'Orthopedic Surgeon', hospital: 'Bone & Joint Hospital', bodypart: 'bones', symptoms: ['joint-pain'], experience: 20, fee: 100, ageGroup: ['13-30', '31-55', '55+'], gender: 'female', timings: 'Mon-Fri 9AM-3PM', available: true },
  { id: 'd6', name: 'Dr. Vikram Joshi', specialty: 'Dermatologist', hospital: 'Skin Care Clinic', bodypart: 'skin', symptoms: ['skin-rash'], experience: 14, fee: 70, ageGroup: ['13-30', '31-55'], gender: 'male', timings: 'Wed-Mon 11AM-7PM', available: true },
  { id: 'd7', name: 'Dr. Kavita Nair', specialty: 'Nephrologist', hospital: 'Aura Kidney Institute', bodypart: 'kidney', symptoms: ['urinary'], experience: 16, fee: 85, ageGroup: ['31-55', '55+'], gender: 'female', timings: 'Mon-Fri 8AM-2PM', available: false },
  { id: 'd8', name: 'Dr. Arjun Singh', specialty: 'Gastroenterologist', hospital: 'Digestive Health Center', bodypart: 'digestive', symptoms: ['abdominal'], experience: 13, fee: 75, ageGroup: ['13-30', '31-55', '55+'], gender: 'male', timings: 'Tue-Sat 9AM-5PM', available: true },
  { id: 'd9', name: 'Dr. Lisa Mendes', specialty: 'ENT Specialist', hospital: 'ENT Care Hospital', bodypart: 'ent', symptoms: ['fever', 'headache'], experience: 11, fee: 60, ageGroup: ['0-12', '13-30', '31-55'], gender: 'female', timings: 'Mon-Sat 10AM-4PM', available: true },
  { id: 'd10', name: 'Dr. Sanjay Gupta', specialty: 'General Physician', hospital: 'Aura Medical Center', bodypart: 'heart', symptoms: ['chest-pain', 'fever', 'headache', 'dizziness'], experience: 22, fee: 50, ageGroup: ['0-12', '13-30', '31-55', '55+'], gender: 'male', timings: '24/7 Available', available: true },
  { id: 'd11', name: 'Dr. Nisha Kapoor', specialty: 'Pediatrician', hospital: 'Kids Care Hospital', bodypart: 'lungs', symptoms: ['fever', 'fever'], experience: 9, fee: 60, ageGroup: ['0-12'], gender: 'female', timings: 'Mon-Sat 8AM-8PM', available: true },
  { id: 'd12', name: 'Dr. Amit Rawat', specialty: 'Rheumatologist', hospital: 'Joint Wellness Clinic', bodypart: 'bones', symptoms: ['joint-pain'], experience: 14, fee: 80, ageGroup: ['31-55', '55+'], gender: 'male', timings: 'Mon-Fri 10AM-5PM', available: true }
];

const opdSearchBtn = document.getElementById('opd-search-btn');
const filterBodypart = document.getElementById('filter-bodypart');
const filterSymptoms = document.getElementById('filter-symptoms');
const filterAgegroup = document.getElementById('filter-agegroup');
const filterGender = document.getElementById('filter-gender');
const opdResults = document.getElementById('opd-results');

// Gender emoji helper
function getGenderEmoji(gender) {
  return gender === 'male' ? '👨‍⚕️' : '👩‍⚕️';
}

function renderDoctors(doctors) {
  opdResults.innerHTML = '';
  
  if (doctors.length === 0) {
    opdResults.innerHTML = `<div class="opd-empty">😔 No doctors match your search criteria. Try adjusting the filters.</div>`;
    return;
  }
  
  doctors.forEach((doc, index) => {
    const card = document.createElement('div');
    card.className = 'doc-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.innerHTML = `
      <div class="doc-card-header">
        <div class="doc-card-avatar">${getGenderEmoji(doc.gender)}</div>
        <div class="doc-card-info">
          <h4>${doc.name}</h4>
          <div class="doc-specialty">${doc.specialty}</div>
          <div class="doc-hospital">🏥 ${doc.hospital}</div>
          <div class="doc-experience">⭐ ${doc.experience} years experience</div>
        </div>
      </div>
      <div class="doc-card-details">
        <div class="doc-detail-item">
          <span class="label">OPD Timings</span>
          <span class="value">${doc.timings}</span>
        </div>
        <div class="doc-detail-item">
          <span class="label">Consultation Fee</span>
          <span class="value">$${doc.fee}</span>
        </div>
      </div>
      <div class="doc-card-footer">
        <span class="doc-avail-badge ${doc.available ? 'available' : 'busy'}">${doc.available ? '✅ Available Today' : '⏳ Fully Booked'}</span>
        <span class="doc-fee">$${doc.fee}</span>
        <button class="btn-book-opd" data-doc-id="${doc.id}" ${!doc.available ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>${doc.available ? '📅 Book Appointment' : '🔒 Unavailable'}</button>
      </div>
    `;
    opdResults.appendChild(card);
    
    // Stagger entrance animation
    setTimeout(() => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: index * 0.1
      });
    }, 100);
  });
  
  // Attach booking handlers
  opdResults.querySelectorAll('.btn-book-opd:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      const doc = DOCTORS.find(d => d.id === docId);
      if (doc) {
        showSystemAlert(`📅 Appointment booked with ${doc.name} (${doc.specialty}) at ${doc.hospital}. Confirmation SMS sent.`);
        // Disable button after booking
        btn.textContent = '✅ Booked';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      }
    });
  });
}

function filterDoctors() {
  const bodypart = filterBodypart.value;
  const symptom = filterSymptoms.value;
  const ageGroup = filterAgegroup.value;
  const gender = filterGender.value;
  
  const filtered = DOCTORS.filter(doc => {
    const matchBody = bodypart === 'all' || doc.bodypart === bodypart;
    const matchSymptom = symptom === 'all' || doc.symptoms.includes(symptom);
    const matchAge = ageGroup === 'all' || doc.ageGroup.includes(ageGroup);
    const matchGender = gender === 'all' || doc.gender === gender;
    return matchBody && matchSymptom && matchAge && matchGender;
  });
  
  renderDoctors(filtered);
  
  if (filtered.length > 0) {
    showSystemAlert(`🔍 Found ${filtered.length} doctor${filtered.length > 1 ? 's' : ''} matching your criteria.`);
  }
}

opdSearchBtn.addEventListener('click', filterDoctors);

// Initial render with all doctors on section visibility
const opdObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && opdResults.querySelector('.opd-empty')) {
      // Auto-show some doctors when user scrolls to section
      filterDoctors();
    }
  });
}, { threshold: 0.3 });

opdObserver.observe(document.getElementById('opd-search'));

// Also render on enter key press in filters
document.querySelectorAll('.filter-group select').forEach(sel => {
  sel.addEventListener('change', filterDoctors);
});


/* ============================================
   16. NEARBY MEDICINE FINDER & LIVE MAP
   ============================================ */

// === PLACEHOLDER DATA (Supabase-ready) ===
const NEARBY_STORES = [
  {
    id: 's1',
    name: '🌿 Green Cross Pharmacy',
    address: '12 Maple Ave, Downtown',
    lat: 40.7128,
    lng: -74.0060,
    distance: 1.2,
    inventory: ['Paracetamol', 'Aspirin', 'Amoxicillin', 'Vitamin C', 'Ibuprofen']
  },
  {
    id: 's2',
    name: '💊 CityMed Drugstore',
    address: '55 Broadway St, Midtown',
    lat: 40.7150,
    lng: -74.0120,
    distance: 2.5,
    inventory: ['Paracetamol', 'Metformin', 'Omeprazole', 'Aspirin']
  },
  {
    id: 's3',
    name: '🏥 AuraRx Downtown',
    address: '100 Health Blvd, Civic Center',
    lat: 40.7200,
    lng: -74.0000,
    distance: 3.8,
    inventory: ['Paracetamol', 'Aspirin', 'Amoxicillin', 'Metformin', 'Vitamin C', 'Ibuprofen', 'Omeprazole']
  },
  {
    id: 's4',
    name: '🧬 BioCare Pharmacy',
    address: '88 Wellness Rd, East Side',
    lat: 40.7080,
    lng: -73.9980,
    distance: 4.1,
    inventory: ['Vitamin C', 'Ibuprofen', 'Omeprazole']
  },
  {
    id: 's5',
    name: '⚕️ MedPlus Express',
    address: '27 Park Lane, Uptown',
    lat: 40.7250,
    lng: -74.0080,
    distance: 5.3,
    inventory: ['Amoxicillin', 'Metformin', 'Vitamin C', 'Aspirin']
  },
  {
    id: 's6',
    name: '🌿 GreenLife Pharmacy',
    address: '310 Oak Street, West End',
    lat: 40.7050,
    lng: -74.0180,
    distance: 6.7,
    inventory: ['Paracetamol', 'Ibuprofen']
  },
  {
    id: 's7',
    name: '🏪 QuickMeds 24/7',
    address: '500 Market St, Financial District',
    lat: 40.7100,
    lng: -74.0050,
    distance: 8.2,
    inventory: ['Paracetamol', 'Aspirin', 'Omeprazole', 'Vitamin C', 'Ibuprofen']
  },
  {
    id: 's8',
    name: '🩺 PrimeRx Pharmacy',
    address: '76 College Ave, University Area',
    lat: 40.7180,
    lng: -74.0150,
    distance: 10.0,
    inventory: ['Amoxicillin', 'Metformin', 'Paracetamol']
  },
  {
    id: 's9',
    name: '💙 HealthFirst Drugs',
    address: '234 Pine St, Suburb East',
    lat: 40.7300,
    lng: -73.9900,
    distance: 15.5,
    inventory: ['Vitamin C', 'Aspirin', 'Metformin', 'Omeprazole', 'Ibuprofen']
  },
  {
    id: 's10',
    name: '🏪 MedLife Superstore',
    address: '1 Grand Ave, Mall District',
    lat: 40.7000,
    lng: -74.0250,
    distance: 22.0,
    inventory: ['Paracetamol', 'Aspirin', 'Amoxicillin', 'Metformin', 'Vitamin C', 'Ibuprofen', 'Omeprazole']
  }
];

// === STATE ===
let medicineTags = [];
let selectedRadius = 10;
let medFinderMap = null;
let userMarker = null;
let userCircle = null;
let activeRouteLine = null;
let storeMarkers = [];
let watchId = null;
let userLat = 40.7128; // Default: NYC downtown
let userLng = -74.0060;

// DOM refs
const finderDrawer = document.getElementById('med-finder-drawer');
const finderOverlay = document.getElementById('finder-overlay');
const finderNavBtn = document.getElementById('med-finder-nav-btn');
const finderMobileBtn = document.getElementById('med-finder-mobile-btn');
const finderCloseBtn = document.getElementById('finder-close-btn');
const medicineInput = document.getElementById('medicine-input');
const chipsContainer = document.getElementById('medicine-chips-container');
const chipPlaceholder = document.getElementById('chip-placeholder');
const radiusBtns = document.querySelectorAll('.radius-btn');
const finderSearchBtn = document.getElementById('finder-search-btn');
const resultsList = document.getElementById('finder-results-list');
const resultsCount = document.getElementById('results-count');
const liveTrackBadge = document.getElementById('live-track-badge');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// AI Upload refs
const btnUploadPrescription = document.getElementById('btn-upload-prescription');
const prescriptionFileInput = document.getElementById('prescription-file-input');
const aiScannerOverlay = document.getElementById('ai-scanner-overlay');
const aiScannerTitle = document.getElementById('ai-scanner-title');
const aiScannerSub = document.getElementById('ai-scanner-sub');
const aiProgressBar = document.getElementById('ai-progress-bar');

// Map type toggle refs
const mapToggleSatellite = document.getElementById('map-toggle-satellite');
const mapToggleStreet = document.getElementById('map-toggle-street');
let currentMapType = 'satellite';
let satelliteLayer = null;
let streetLayer = null;

// === AI PRESCRIPTION UPLOAD ===
if (btnUploadPrescription) {
  btnUploadPrescription.addEventListener('click', () => {
    prescriptionFileInput.click();
  });
}
if (prescriptionFileInput) {
  prescriptionFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      simulateAIPrescriptionScan(e.target.files[0]);
      prescriptionFileInput.value = '';
    }
  });
}
function simulateAIPrescriptionScan(file) {
  aiScannerOverlay.classList.remove('hidden');
  btnUploadPrescription.classList.add('scanning');
  aiScannerTitle.textContent = 'AI Reading Prescription...';
  aiScannerSub.textContent = 'Analyzing document structure';
  aiProgressBar.style.width = '0%';
  setTimeout(() => { aiScannerSub.textContent = 'Detecting medicine names'; aiProgressBar.style.width = '25%'; }, 600);
  setTimeout(() => { aiScannerTitle.textContent = 'Extracting Medicine Names'; aiScannerSub.textContent = 'Matching pharmaceutical database'; aiProgressBar.style.width = '55%'; }, 1400);
  setTimeout(() => { aiScannerTitle.textContent = '✅ Extraction Complete'; aiScannerSub.textContent = 'Adding medicines to search...'; aiProgressBar.style.width = '100%'; }, 2200);
  setTimeout(() => {
    const extracted = ['Paracetamol', 'Amoxicillin', 'Vitamin C', 'Aspirin'];
    extracted.forEach((med, idx) => { setTimeout(() => { addMedicineTag(med); }, idx * 300); });
    aiScannerOverlay.classList.add('hidden');
    btnUploadPrescription.classList.remove('scanning');
    showSystemAlert('✅ AI extracted ' + extracted.length + ' medicines from your prescription.');
    setTimeout(() => { if (medicineTags.length > 0) searchNearbyMeds(); }, extracted.length * 300 + 200);
  }, 2800);
}
// === MAP TYPE TOGGLE ===
if (mapToggleSatellite) {
  mapToggleSatellite.addEventListener('click', () => {
    if (currentMapType === 'satellite') return;
    mapToggleSatellite.classList.add('active');
    mapToggleStreet.classList.remove('active');
    currentMapType = 'satellite';
    switchMapLayer('satellite');
  });
}
if (mapToggleStreet) {
  mapToggleStreet.addEventListener('click', () => {
    if (currentMapType === 'street') return;
    mapToggleStreet.classList.add('active');
    mapToggleSatellite.classList.remove('active');
    currentMapType = 'street';
    switchMapLayer('street');
  });
}
function switchMapLayer(type) {
  const L = window.L;
  if (!L || !medFinderMap) return;
  if (satelliteLayer) medFinderMap.removeLayer(satelliteLayer);
  if (streetLayer) medFinderMap.removeLayer(streetLayer);
  if (type === 'satellite') {
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }).addTo(medFinderMap);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Labels &copy; Esri' }).addTo(medFinderMap);
  } else {
    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(medFinderMap);
  }
}

// === DRAWER TOGGLE ===
function toggleFinder(open) {
  if (open) {
    finderDrawer.classList.add('open');
    finderOverlay.classList.add('open');
    // Animate in with GSAP
    gsap.fromTo(finderDrawer, 
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'x' }
    );
    // Init map if not already
    if (!medFinderMap) {
      setTimeout(() => initMedFinderMap(), 400);
    }
    // Start geolocation
    startLiveTracking();
  } else {
    finderDrawer.classList.remove('open');
    finderOverlay.classList.remove('open');
  }
}

// Nav button opens finder
if (finderNavBtn) {
  finderNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // close mobile nav if open
    if (mobileNav) mobileNav.classList.remove('open');
    toggleFinder(true);
  });
}

if (finderMobileBtn) {
  finderMobileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (mobileNav) mobileNav.classList.remove('open');
    toggleFinder(true);
  });
}

if (finderCloseBtn) {
  finderCloseBtn.addEventListener('click', () => toggleFinder(false));
}

if (finderOverlay) {
  finderOverlay.addEventListener('click', () => toggleFinder(false));
}

// === MEDICINE TAG INPUT ===
function addMedicineTag(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  // Normalize to title case
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  
  // Prevent duplicates
  if (medicineTags.some(t => t.toLowerCase() === normalized.toLowerCase())) {
    showSystemAlert(`"${normalized}" is already added.`);
    return;
  }
  
  medicineTags.push(normalized);
  renderChips();
}

function removeMedicineTag(name) {
  medicineTags = medicineTags.filter(t => t !== name);
  renderChips();
}

function renderChips() {
  // Clear all existing chips except placeholder
  chipsContainer.querySelectorAll('.chip-tag').forEach(el => el.remove());
  
  if (medicineTags.length === 0) {
    chipPlaceholder.style.display = 'inline';
  } else {
    chipPlaceholder.style.display = 'none';
    medicineTags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'chip-tag';
      chip.innerHTML = `${tag} <span class="chip-remove" data-medicine="${tag}">&times;</span>`;
      chipsContainer.appendChild(chip);
    });
    
    // Attach remove handlers
    chipsContainer.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeMedicineTag(btn.getAttribute('data-medicine'));
      });
    });
  }
}

// Input Enter handler
if (medicineInput) {
  medicineInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = medicineInput.value.trim();
      if (val) {
        addMedicineTag(val);
        medicineInput.value = '';
      }
    }
  });
}

// Suggestion chip clicks
suggestionChips.forEach(chip => {
  chip.addEventListener('click', () => {
    addMedicineTag(chip.getAttribute('data-medicine'));
  });
});

// === RADIUS SELECTOR ===
radiusBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    radiusBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRadius = parseInt(btn.getAttribute('data-radius'), 10);
  });
});

// === SEARCH NEARBY FUNCTION ===
function searchNearbyMeds() {
  if (medicineTags.length === 0) {
    showSystemAlert('Please add at least one medicine name to search.');
    return;
  }
  
  // Filter stores by:
  // 1. Has at least one requested medicine in stock
  // 2. Within selected radius
  // 3. Sort by distance
  const matchedStores = NEARBY_STORES
    .filter(store => {
      if (store.distance > selectedRadius) return false;
      // Check if store has ANY of the requested medicines
      return medicineTags.some(tag => 
        store.inventory.some(item => item.toLowerCase() === tag.toLowerCase())
      );
    })
    .map(store => {
      // Calculate stock status
      const matchedMeds = medicineTags.filter(tag =>
        store.inventory.some(item => item.toLowerCase() === tag.toLowerCase())
      );
      const totalRequested = medicineTags.length;
      return {
        ...store,
        matchedMeds,
        matchCount: matchedMeds.length,
        totalRequested
      };
    })
    .sort((a, b) => a.distance - b.distance);
  
  renderResults(matchedStores);
  updateMapMarkers(matchedStores);
  
  if (matchedStores.length === 0) {
    showSystemAlert(`No stores found within ${selectedRadius} km that stock your medicines.`);
  } else {
    showSystemAlert(`Found ${matchedStores.length} store${matchedStores.length > 1 ? 's' : ''} near you.`);
  }
  
  resultsCount.textContent = `${matchedStores.length} store${matchedStores.length !== 1 ? 's' : ''} found`;
}

// === RENDER RESULTS ===
function renderResults(stores) {
  resultsList.innerHTML = '';
  
  if (stores.length === 0) {
    resultsList.innerHTML = `<div class="finder-empty">😔 No stores found within ${selectedRadius} km. Try increasing the radius or adding different medicines.</div>`;
    return;
  }
  
  stores.forEach((store, index) => {
    const card = document.createElement('div');
    card.className = 'finder-result-card';
    card.setAttribute('data-store-id', store.id);
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Stock status
    let stockClass = 'unavailable';
    let stockText = `🔴 0/${store.totalRequested} Available`;
    if (store.matchCount === store.totalRequested) {
      stockClass = 'all-available';
      stockText = `🟢 All ${store.totalRequested} Available`;
    } else if (store.matchCount > 0) {
      stockClass = 'partial';
      stockText = `🟡 ${store.matchCount}/${store.totalRequested} Available`;
    }
    
    card.innerHTML = `
      <div class="result-store-name">${store.name}</div>
      <div class="result-store-address">📍 ${store.address}</div>
      <div class="result-meta">
        <span class="result-distance">📏 ${store.distance} km</span>
        <span class="stock-indicator ${stockClass}">${stockText}</span>
      </div>
    `;
    
    // Click to show on map & draw route
    card.addEventListener('click', () => {
      // Highlight selected
      document.querySelectorAll('.finder-result-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      // Draw route to store
      drawRouteToStore(store);
    });
    
    resultsList.appendChild(card);
    
    // GSAP entrance stagger
    gsap.from(card, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      delay: index * 0.06,
      ease: 'power2.out'
    });
  });
}

// === LEAFLET MAP INIT ===
function initMedFinderMap() {
  const mapContainer = document.getElementById('med-finder-map');
  if (!mapContainer) return;
  
  // Dynamic import of Leaflet
  const L = window.L;
  if (!L) {
    // Load Leaflet from CDN if not available
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      setTimeout(() => initMapWithLeaflet(), 200);
    };
    document.head.appendChild(script);
  } else {
    initMapWithLeaflet();
  }
}

function initMapWithLeaflet() {
  const L = window.L;
  if (!L || document.getElementById('med-finder-map')._leaflet_id) return;
  
  medFinderMap = L.map('med-finder-map', {
    center: [userLat, userLng],
    zoom: 13,
    zoomControl: false,
    attributionControl: false
  });
  
  // Default: ESRI World Imagery (high-res satellite) + Transportation labels
  satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri'
  }).addTo(medFinderMap);
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Labels &copy; Esri'
  }).addTo(medFinderMap);
  
  L.control.zoom({ position: 'bottomright' }).addTo(medFinderMap);
  
  // Add user location marker
  updateUserMarker(userLat, userLng);
}

// === USER GEOLOCATION ===
function startLiveTracking() {
  if (!navigator.geolocation) {
    liveTrackBadge.textContent = '📍 GPS Unavailable';
    liveTrackBadge.classList.add('error');
    return;
  }
  
  liveTrackBadge.textContent = '📍 Locating...';
  liveTrackBadge.classList.remove('error');
  
  // Initial position
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      liveTrackBadge.textContent = '📍 Live Tracking';
      liveTrackBadge.classList.add('tracking');
      
      if (medFinderMap) {
        medFinderMap.setView([userLat, userLng], 13);
        updateUserMarker(userLat, userLng);
      }
    },
    (err) => {
      console.warn('Geolocation error:', err.message);
      liveTrackBadge.textContent = '📍 Using Default Location';
      liveTrackBadge.classList.add('error');
      // Use default NYC coords for demo
      if (medFinderMap) {
        medFinderMap.setView([userLat, userLng], 13);
        updateUserMarker(userLat, userLng);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
  
  // Watch position for live movement
  if (watchId) navigator.geolocation.clearWatch(watchId);
  
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      
      if (medFinderMap) {
        updateUserMarker(userLat, userLng);
      }
      
      liveTrackBadge.textContent = `📍 Live • ${pos.coords.accuracy.toFixed(0)}m accuracy`;
      liveTrackBadge.classList.add('tracking');
    },
    (err) => {
      // Silent fail on watch errors
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
}

function updateUserMarker(lat, lng) {
  const L = window.L;
  if (!L || !medFinderMap) return;
  
  // Custom pulsing icon
  const userIcon = L.divIcon({
    className: 'user-location-wrapper',
    html: '<div class="user-location-marker"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
  
  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(medFinderMap);
    userMarker.bindPopup('<strong>📍 You are here</strong><br><small>Your live GPS location</small>');
    
    // Accuracy circle
    userCircle = L.circle([lat, lng], {
      radius: 50,
      color: '#0b6df6',
      fillColor: '#0b6df6',
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.3
    }).addTo(medFinderMap);
  }
  
  if (userCircle) {
    userCircle.setLatLng([lat, lng]);
  }
}

// === STORE MARKERS & ROUTE ===
function updateMapMarkers(stores) {
  const L = window.L;
  if (!L || !medFinderMap) return;
  
  // Clear old markers
  storeMarkers.forEach(m => medFinderMap.removeLayer(m));
  storeMarkers = [];
  
  // Clear old route
  if (activeRouteLine) {
    medFinderMap.removeLayer(activeRouteLine);
    activeRouteLine = null;
  }
  
  stores.forEach(store => {
    const storeIcon = L.divIcon({
      className: 'store-marker-wrapper',
      html: `<div class="store-marker-icon"><span class="marker-icon-inner">🏪</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    const marker = L.marker([store.lat, store.lng], { icon: storeIcon }).addTo(medFinderMap);
    
    // Build popup content
    let stockHtml = '';
    if (store.matchCount === store.totalRequested) {
      stockHtml = `<span style="color:#00f29d;">🟢 All ${store.totalRequested} medicines available</span>`;
    } else if (store.matchCount > 0) {
      stockHtml = `<span style="color:#ffc107;">🟡 ${store.matchCount}/${store.totalRequested} available</span>`;
    } else {
      stockHtml = `<span style="color:#ff4444;">🔴 Unavailable</span>`;
    }
    
    marker.bindPopup(`
      <div style="min-width:160px;">
        <strong>${store.name}</strong><br>
        <small>📍 ${store.address}</small><br>
        <small>📏 ${store.distance} km away</small><br>
        <div style="margin-top:6px;">${stockHtml}</div>
        <button onclick="document.getElementById('finder-search-btn').click()" style="margin-top:6px;background:#00f29d;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">📍 Show Route</button>
      </div>
    `);
    
    marker.on('click', () => {
      drawRouteToStore(store);
      // Highlight in results list
      document.querySelectorAll('.finder-result-card').forEach(c => c.classList.remove('active'));
      const resultCard = document.querySelector(`.finder-result-card[data-store-id="${store.id}"]`);
      if (resultCard) {
        resultCard.classList.add('active');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    
    storeMarkers.push(marker);
  });
  
  // Fit bounds if we have stores
  if (stores.length > 0 && userMarker) {
    const allLatLngs = stores.map(s => [s.lat, s.lng]);
    allLatLngs.push([userLat, userLng]);
    const bounds = L.latLngBounds(allLatLngs);
    medFinderMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }
}

// === DRAW ROUTE ===
function drawRouteToStore(store) {
  const L = window.L;
  if (!L || !medFinderMap) return;
  
  // Clear previous route
  if (activeRouteLine) {
    medFinderMap.removeLayer(activeRouteLine);
  }
  
  // Draw straight-line route (simulated navigation)
  const points = [
    [userLat, userLng],
    [store.lat, store.lng]
  ];
  
  activeRouteLine = L.polyline(points, {
    color: '#00f29d',
    weight: 3,
    opacity: 0.8,
    dashArray: '8, 6',
    className: 'route-line-animated'
  }).addTo(medFinderMap);
  
  // Add start/end markers
  const startIcon = L.divIcon({
    className: 'start-marker',
    html: '<div style="background:#0b6df6;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px rgba(11,109,246,0.5);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
  
  const endIcon = L.divIcon({
    className: 'end-marker',
    html: '<div style="background:#00f29d;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px rgba(0,242,157,0.5);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  
  L.marker([userLat, userLng], { icon: startIcon }).addTo(medFinderMap);
  L.marker([store.lat, store.lng], { icon: endIcon }).addTo(medFinderMap);
  
  // Popup on store
  medFinderMap.setView([store.lat, store.lng], 14);
  
  showSystemAlert(`📍 Route drawn to ${store.name} (${store.distance} km)`);
}

// === SEARCH BUTTON HANDLER ===
if (finderSearchBtn) {
  finderSearchBtn.addEventListener('click', searchNearbyMeds);
}

// Allow Enter key on medicine input to also trigger search
if (medicineInput) {
  medicineInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && medicineTags.length === 0) {
      e.preventDefault();
    }
  });
}

// === INITIALIZE (defer until DOM ready) ===
// Map will be initialized when drawer opens
