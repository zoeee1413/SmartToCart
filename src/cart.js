import './market-home.css'
import './cart.css'
import { smartCartMarkup, initSmartCart, smartCartIcons } from './smart-cart.js'

import {
  createIcons,
  Search,
  UserRound,
  ShoppingCart,
  Star,
  MapPin,
  Grid2X2,
  Store,
  ChevronRight,
  Trash2,
  ArrowLeft,
  CreditCard,
  Banknote,
  Check,
  X,
  Lock,
  Truck
} from 'lucide'

const icons = {
  ...smartCartIcons,
  Search,
  UserRound,
  ShoppingCart,
  Star,
  MapPin,
  Grid2X2,
  Store,
  ChevronRight,
  Trash2,
  ArrowLeft,
  CreditCard,
  Banknote,
  Check,
  X,
  Lock,
  Truck
}

// ========================================
// 1. HELPERS
// ========================================

const logoFiles = import.meta.glob('./assets/images/sm_logo.*', {
  eager: true,
  query: '?url',
  import: 'default'
})

const logoImage = Object.values(logoFiles)[0] || ''

function formatPeso(value) {
  return '₱' + value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('smCart'))
    return Array.isArray(cart) ? cart : []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem('smCart', JSON.stringify(cart))
}

// "SM Bonus Liempo | 400g-500g" -> { title, size }
function splitName(name) {
  const [title, ...rest] = String(name).split(' | ')
  return { title, size: rest.join(' | ') }
}

// ========================================
// 2. PAGE SHELL (same navbar + footer as the homepage)
// ========================================

let selectedBranch = null

try {
  selectedBranch = JSON.parse(localStorage.getItem('selectedSMBranch'))
} catch (error) {
  console.error('Unable to load selected branch:', error)
}

const branchName = selectedBranch?.name || 'SM City Sta. Mesa'

const app = document.querySelector('#app')

app.innerHTML = `
  <!-- HEADER -->
  <header class="market-header">

    <div class="market-header-main">

      <a href="/market-home.html" class="market-logo">
        <img src="${logoImage}" alt="SM Markets" />
      </a>

      <div class="market-search">
        <input
          type="text"
          id="marketSearch"
          placeholder="Search for items here..."
        />

        <button id="searchButton" aria-label="Search">
          <i data-lucide="search"></i>
        </button>
      </div>

      <button class="smart-cart-button" id="smartCartButton">
        SMart-to-Cart
      </button>

      <div class="market-header-actions">

        <button class="header-icon" id="accountButton" aria-label="Account">
          <i data-lucide="user-round"></i>
        </button>

        <button class="header-icon" id="cartButton" aria-label="Cart">
          <i data-lucide="shopping-cart"></i>
          <span class="cart-badge" id="cartBadge" hidden></span>
        </button>

        <button class="header-icon" id="favoritesButton" aria-label="Favorites">
          <i data-lucide="star"></i>
        </button>

      </div>

    </div>

    <nav class="market-navigation cart-nav">

      <div class="market-branch">
        <i data-lucide="map-pin"></i>
        <span>
          You're currently shopping at:
          <strong id="branchName">${escapeHtml(branchName)}</strong>
        </span>
      </div>

    </nav>

  </header>

  <main class="cart-page">
    <h1 class="cart-title">
      <i data-lucide="shopping-cart"></i>
      My Cart
      <span id="cartCount"></span>
    </h1>

    <div class="cart-layout" id="cartLayout"></div>
  </main>

  <!-- FOOTER (newsletter + links) -->
  <footer class="shop-footer">

    <div class="footer-container">

      <div class="newsletter">

        <h3>Get awesome exclusives and more deals when you subscribe!</h3>

        <form id="newsletterForm">

          <input
            type="email"
            id="newsletterEmail"
            placeholder="Enter your email address"
            required
          />

          <button type="submit">Subscribe</button>

        </form>

        <p id="newsletterMessage"></p>

      </div>


      <div class="footer-columns">

        <div class="footer-column">
          <h4>Help & Information</h4>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
        </div>

        <div class="footer-column">
          <h4>About ShopSM</h4>
          <a href="/signin.html">My Account</a>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
        </div>

        <div class="footer-column app-download">
          <h4>Download our App</h4>

          <div class="app-badges">

            <span class="shopsm-app-icon">SM</span>

            <a href="#" class="store-badge">
              <span>Download on the</span>
              <strong>App Store</strong>
            </a>

            <a href="#" class="store-badge">
              <span>GET IT ON</span>
              <strong>Google Play</strong>
            </a>

          </div>

          <button type="button" class="bir-button">View BIR Seal</button>
        </div>

      </div>


      <div class="footer-bottom">
        <span>© 2026 ShopSM. All rights reserved.</span>
        <strong>SHOPSM</strong>
      </div>

    </div>

  </footer>

  <div class="cart-toast" id="cartToast" hidden></div>

  <div class="checkout-overlay" id="checkoutModal" hidden>
    <div class="checkout-box" id="checkoutBox" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle"></div>
  </div>

  <div class="cart-modal" id="cartModal" hidden>
    <div class="cart-modal-box" role="alertdialog" aria-modal="true" aria-labelledby="cartModalTitle">
      <h3 id="cartModalTitle"></h3>
      <p id="cartModalText"></p>
      <div class="cart-modal-actions">
        <button type="button" id="cartModalCancel">Cancel</button>
        <button type="button" id="cartModalOk" class="danger">Yes, remove</button>
      </div>
    </div>
  </div>
`

// ========================================
// 3. CONFIRM MODAL
// ========================================

const modal = document.querySelector('#cartModal')
let pendingAction = null

function askConfirm({ title, text, okLabel, onConfirm }) {
  document.querySelector('#cartModalTitle').textContent = title
  document.querySelector('#cartModalText').textContent = text
  document.querySelector('#cartModalOk').textContent = okLabel
  pendingAction = onConfirm
  modal.hidden = false
}

function closeModal() {
  modal.hidden = true
  pendingAction = null
}

document.querySelector('#cartModalCancel').addEventListener('click', closeModal)

document.querySelector('#cartModalOk').addEventListener('click', () => {
  const action = pendingAction
  closeModal()
  if (action) action()
})

// Account button: profile if signed in, otherwise sign in page
document.querySelector('#accountButton').addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  window.location.href = isLoggedIn ? '/profile.html' : '/signin.html'
})

modal.addEventListener('click', event => {
  if (event.target === modal) closeModal()
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.hidden) closeModal()
})

// ========================================
// 4. TOAST
// ========================================

const toast = document.querySelector('#cartToast')
let toastTimer

function showToast(message) {
  toast.textContent = message
  toast.hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.hidden = true }, 2200)
}

// ========================================
// 5. RENDER CART
// ========================================

function updateCartBadge() {
  const badge = document.querySelector('#cartBadge')
  if (!badge) return

  const count = readCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)

  badge.textContent = count > 99 ? '99+' : String(count)
  badge.hidden = count === 0
}

const PAGE_SIZE = 5
let cartPage = 1

// [1, 2, 3, '…', 9] style page list
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = [1, total, current - 1, current, current + 1]
    .filter(page => page >= 1 && page <= total)

  const sorted = [...new Set(wanted)].sort((a, b) => a - b)
  const result = []

  sorted.forEach((page, index) => {
    if (index && page - sorted[index - 1] > 1) result.push('…')
    result.push(page)
  })

  return result
}

function renderCart() {
  updateCartBadge()

  const cart = readCart().filter(item => item && item.quantity > 0)
  const layout = document.querySelector('#cartLayout')

  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  document.querySelector('#cartCount').textContent =
    cart.length ? `(${totalPieces} item${totalPieces === 1 ? '' : 's'})` : ''

  if (!cart.length) {
    layout.className = 'cart-layout empty'
    layout.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-cart"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/market-home.html" class="cart-primary">Start Shopping</a>
      </div>
    `
    createIcons({ icons })
    return
  }

  layout.className = 'cart-layout'

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(cart.length / PAGE_SIZE))
  cartPage = Math.min(Math.max(1, cartPage), totalPages)

  const startIndex = (cartPage - 1) * PAGE_SIZE
  const pageItems = cart.slice(startIndex, startIndex + PAGE_SIZE)

  const paginationHtml = totalPages > 1 ? `
    <nav class="cart-pagination" aria-label="Cart pages">

      <span class="cart-page-info">
        Showing ${startIndex + 1}–${startIndex + pageItems.length} of ${cart.length} products
      </span>

      <div class="cart-page-buttons">

        <button type="button" data-page="${cartPage - 1}" aria-label="Previous page"
          ${cartPage === 1 ? 'disabled' : ''}>‹</button>

        ${pageList(cartPage, totalPages).map(page => page === '…'
          ? '<span class="cart-page-gap">…</span>'
          : `<button type="button" data-page="${page}"
              class="${page === cartPage ? 'active' : ''}"
              aria-label="Page ${page}"
              ${page === cartPage ? 'aria-current="page"' : ''}>${page}</button>`
        ).join('')}

        <button type="button" data-page="${cartPage + 1}" aria-label="Next page"
          ${cartPage === totalPages ? 'disabled' : ''}>›</button>

      </div>

    </nav>
  ` : ''

  layout.innerHTML = `
    <section class="cart-items">

      <div class="cart-items-head">
        <span>Product</span>
        <button type="button" class="cart-clear" id="cartClear">Clear cart</button>
      </div>

      ${pageItems.map(item => {
        const { title, size } = splitName(item.name)

        return `
          <article class="cart-item">

            <div class="cart-item-info">
              <strong>${escapeHtml(title)}</strong>
              ${size ? `<span>${escapeHtml(size)}</span>` : ''}
              <small>${formatPeso(item.price)} each</small>
            </div>

            <div class="cart-qty">
              <button type="button" data-action="dec" data-id="${escapeHtml(item.id)}"
                aria-label="Decrease quantity" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="inc" data-id="${escapeHtml(item.id)}"
                aria-label="Increase quantity">+</button>
            </div>

            <div class="cart-item-total">${formatPeso(item.price * item.quantity)}</div>

            <button type="button" class="cart-remove" data-action="remove" data-id="${escapeHtml(item.id)}"
              aria-label="Remove ${escapeHtml(title)}">
              <i data-lucide="trash-2"></i>
            </button>

          </article>
        `
      }).join('')}

      ${paginationHtml}

    </section>

    <aside class="cart-summary">
      <h2>Order Summary</h2>

      <div class="cart-summary-row">
        <span>Items (${totalPieces})</span>
        <strong>${formatPeso(subtotal)}</strong>
      </div>

      <div class="cart-summary-row muted">
        <span>Delivery fee</span>
        <span>Calculated at checkout</span>
      </div>

      <div class="cart-summary-total">
        <span>Estimated total</span>
        <strong>${formatPeso(subtotal)}</strong>
      </div>

      <button type="button" class="cart-primary" id="cartCheckout">
        Proceed to Checkout
      </button>

      <a href="/market-home.html" class="cart-secondary">Continue Shopping</a>

      <p class="cart-fineprint">Prices are estimates and may vary per branch.</p>
    </aside>
  `

  createIcons({ icons })
}

// ========================================
// 6. EVENTS (event delegation)
// ========================================

document.querySelector('#cartLayout').addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]')

  if (pageButton) {
    if (pageButton.disabled) return

    cartPage = Number(pageButton.dataset.page)
    renderCart()

    document.querySelector('.cart-items')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const clear = event.target.closest('#cartClear')

  if (clear) {
    askConfirm({
      title: 'Clear your cart?',
      text: 'All items will be removed from your cart.',
      okLabel: 'Yes, clear',
      onConfirm: () => {
        saveCart([])
        renderCart()
        showToast('Cart cleared')
      }
    })
    return
  }

  if (event.target.closest('#cartCheckout')) {
    openCheckout()
    return
  }

  const button = event.target.closest('[data-action]')
  if (!button) return

  const cart = readCart()
  const item = cart.find(entry => String(entry.id) === button.dataset.id)
  if (!item) return

  const action = button.dataset.action

  if (action === 'inc') {
    item.quantity = Math.min(99, item.quantity + 1)
    saveCart(cart)
    renderCart()
  }

  if (action === 'dec') {
    item.quantity = Math.max(1, item.quantity - 1)
    saveCart(cart)
    renderCart()
  }

  if (action === 'remove') {
    askConfirm({
      title: 'Remove this item?',
      text: `Are you sure you want to remove "${splitName(item.name).title}" from your cart?`,
      okLabel: 'Yes, remove',
      onConfirm: () => {
        saveCart(readCart().filter(entry => String(entry.id) !== button.dataset.id))
        renderCart()
        showToast('Item removed')
      }
    })
  }
})

// ========================================
// 6B. CHECKOUT (demo payment, no real charge)
// ========================================

const PAYMENT_METHODS = [
  { id: 'gcash', label: 'GCash', desc: 'E-wallet', letter: 'G', color: '#007dfe' },
  { id: 'maya', label: 'Maya', desc: 'E-wallet', letter: 'M', color: '#00a651' },
  { id: 'card', label: 'Card', desc: 'Credit / Debit', icon: 'credit-card' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay on arrival', icon: 'banknote' }
]

// How the customer gets the order
const DELIVERY_OPTIONS = [
  { id: 'delivery', label: 'Home Delivery', desc: 'Delivered to you', icon: 'truck' },
  { id: 'pickup', label: 'Store Pickup', desc: 'Pick up in store', icon: 'store' }
]

// Store pickup settings (demo values, edit freely)
const PICKUP_OPEN_HOUR = 9     // first pickup slot starts at 9 AM
const PICKUP_CLOSE_HOUR = 20   // store closes at 8 PM (last slot is 7-8 PM)
const PICKUP_LEAD_HOURS = 2    // time needed to prepare the order
const PICKUP_SLOT_COUNT = 6    // how many time slots to show

// Small layout rules for the delivery / pickup section + landscape checkout
const pickupStyles = document.createElement('style')

pickupStyles.textContent = `
  .delivery-section { margin-bottom: 26px; }

  .delivery-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }

  .delivery-options .pay-option { margin: 0; }

  .payment-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }

  .payment-options .pay-option { margin: 0; }

  .pickup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin-top: 14px;
  }

  .pickup-grid .checkout-field { margin: 0; }

  .pickup-box,
  .pickup-select {
    box-sizing: border-box;
    width: 100%;
    min-height: 46px;
    padding: 10px 14px;
    border: 1px solid #dbe2f0;
    border-radius: 10px;
    font: inherit;
    font-size: 15px;
  }

  .pickup-box {
    display: flex;
    align-items: center;
    background: #f5f7ff;
    font-weight: 600;
  }

  .pickup-select { background: #fff; color: inherit; }

  .pickup-select:focus {
    outline: none;
    border-color: #0b3cff;
    box-shadow: 0 0 0 3px rgba(11, 60, 255, 0.15);
  }

  .pickup-note { margin: 10px 0 0; }

  /* ---- Landscape checkout ---- */
  .checkout-box {
    width: min(980px, 95vw);
    max-width: none;
  }

  .checkout-body.checkout-landscape {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  .checkout-col { min-width: 0; }

  .checkout-col-right {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .checkout-col-right section,
  .checkout-col-right .checkout-error,
  .checkout-col-right .checkout-hint { margin: 0; }

  .delivery-options,
  .payment-options {
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  }

  @media (max-width: 760px) {
    .checkout-body.checkout-landscape { grid-template-columns: 1fr; }
  }

  /* ---- Saved delivery address ---- */
  .address-box {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid #dbe2f0;
    border-radius: 10px;
    background: #f5f7ff;
    font-size: 14px;
  }

  .address-box svg { flex: none; width: 18px; height: 18px; margin-top: 2px; color: #0b3cff; }
  .address-box p { margin: 0; line-height: 1.5; }

  /* ---- "Add address first" popup ---- */
  .address-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(15, 23, 42, 0.55);
  }

  .address-modal[hidden] { display: none; }

  .address-modal-box {
    box-sizing: border-box;
    width: min(400px, 100%);
    padding: 26px 24px 22px;
    border-radius: 16px;
    background: #fff;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }

  .address-modal-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
    border-radius: 50%;
    background: #eef2ff;
    color: #0b3cff;
  }

  .address-modal-icon svg { width: 26px; height: 26px; }
  .address-modal-box h3 { margin: 0 0 8px; font-size: 20px; }
  .address-modal-box p { margin: 0 0 20px; color: #5b6478; font-size: 14px; line-height: 1.5; }

  .address-modal-actions { display: flex; gap: 10px; }

  .address-modal-actions > * {
    box-sizing: border-box;
    flex: 1;
    padding: 12px 14px;
    border: 1px solid #dbe2f0;
    border-radius: 10px;
    background: #fff;
    color: #1b2235;
    font: inherit;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
  }

  .address-modal-actions .primary {
    border-color: #0b3cff;
    background: #0b3cff;
    color: #fff;
  }
`

document.head.appendChild(pickupStyles)

const checkoutModal = document.querySelector('#checkoutModal')
const checkoutBox = document.querySelector('#checkoutBox')

const checkout = {
  step: 'form',
  method: 'gcash',
  delivery: 'delivery',   // 'delivery' | 'pickup'
  slots: [],
  pickupTime: '',
  order: null
}

// ---- Saved delivery address (saved from the profile page) ----
const USER_KEYS = ['currentUser', 'loggedInUser', 'authUser', 'user']
const EMAIL_KEYS = ['loggedInEmail', 'currentUserEmail', 'userEmail']

function currentEmail() {
  for (const key of USER_KEYS) {
    try {
      const user = JSON.parse(localStorage.getItem(key))
      const email = user && typeof user === 'object' ? (user.email || user.Email) : ''
      if (email) return String(email).toLowerCase()
    } catch {
      // ignore bad data
    }
  }

  const email = EMAIL_KEYS.map(key => localStorage.getItem(key)).find(Boolean)
  return email ? email.toLowerCase() : ''
}

// Returns the address saved in profile.html, or null if there is none yet
function savedAddress() {
  const email = currentEmail()
  if (!email) return null

  try {
    const address = JSON.parse(localStorage.getItem(`smAddress:${email}`))

    if (address && address.street && address.barangay && address.city && address.province && address.zip) {
      return address
    }
  } catch {
    // ignore bad data
  }

  return null
}

// Popup: "add an address first"
const addressModal = document.createElement('div')
addressModal.className = 'address-modal'
addressModal.hidden = true

addressModal.innerHTML = `
  <div class="address-modal-box" role="alertdialog" aria-modal="true" aria-labelledby="addressModalTitle">
    <span class="address-modal-icon"><i data-lucide="map-pin"></i></span>
    <h3 id="addressModalTitle">Add your address first</h3>
    <p>You need a delivery address before choosing Home Delivery. Add one in your profile, then come back to checkout.</p>
    <div class="address-modal-actions">
      <button type="button" id="addressModalCancel">Not now</button>
      <a href="/profile.html" class="primary">Add address</a>
    </div>
  </div>
`

document.body.appendChild(addressModal)

function openAddressModal() {
  addressModal.hidden = false
  createIcons({ icons })
}

function closeAddressModal() {
  addressModal.hidden = true
}

document.querySelector('#addressModalCancel').addEventListener('click', closeAddressModal)

addressModal.addEventListener('click', event => {
  if (event.target === addressModal) closeAddressModal()
})

// Builds the next available 1-hour pickup windows
function pickupSlots() {
  const dayLabel = date =>
    date.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })

  const timeLabel = date =>
    date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })

  const slots = []
  const t = new Date(Date.now() + PICKUP_LEAD_HOURS * 60 * 60 * 1000)

  t.setMinutes(0, 0, 0)
  t.setHours(t.getHours() + 1)   // round up to the next full hour

  while (slots.length < PICKUP_SLOT_COUNT) {
    if (t.getHours() < PICKUP_OPEN_HOUR) t.setHours(PICKUP_OPEN_HOUR)

    if (t.getHours() >= PICKUP_CLOSE_HOUR) {
      t.setDate(t.getDate() + 1)
      t.setHours(PICKUP_OPEN_HOUR)
    }

    const end = new Date(t)
    end.setHours(end.getHours() + 1)

    slots.push(`${dayLabel(t)}, ${timeLabel(t)} – ${timeLabel(end)}`)

    t.setHours(t.getHours() + 1)
  }

  return slots
}

function cartTotals() {
  const items = readCart().filter(item => item && item.quantity > 0)

  return {
    items,
    pieces: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}

// "Cash on Delivery" becomes "Pay at Store" when picking up
function methodById(id) {
  const method = PAYMENT_METHODS.find(entry => entry.id === id)

  if (id === 'cod' && checkout.delivery === 'pickup') {
    return { ...method, label: 'Pay at Store', desc: 'Pay at counter' }
  }

  return method
}

function feeLabel() {
  return checkout.delivery === 'pickup' ? 'Pickup fee' : 'Delivery fee'
}

function feeValue() {
  return checkout.delivery === 'pickup' ? 'Free' : 'Free (demo)'
}

function deliveryDetailsHtml() {
  if (checkout.delivery === 'pickup') {
    return `
      <div class="pickup-grid">

        <div class="checkout-field">
          <span>Pickup branch</span>
          <div class="pickup-box">${escapeHtml(branchName)}</div>
        </div>

        <label class="checkout-field">
          <span>Pickup time</span>
          <select id="pickupTime" class="pickup-select">
            ${checkout.slots.map(slot => `
              <option value="${escapeHtml(slot)}" ${slot === checkout.pickupTime ? 'selected' : ''}>
                ${escapeHtml(slot)}
              </option>
            `).join('')}
          </select>
        </label>

      </div>

      <p class="checkout-hint pickup-note">
        Ready in about ${PICKUP_LEAD_HOURS} hours. Bring a valid ID and your order number.
      </p>
    `
  }

  const address = savedAddress()

  if (address) {
    return `
      <div class="address-box">
        <i data-lucide="map-pin"></i>
        <p>
          <strong>Deliver to</strong><br />
          ${escapeHtml(address.street)}, ${escapeHtml(address.barangay)}<br />
          ${escapeHtml(address.city)}, ${escapeHtml(address.province)} ${escapeHtml(address.zip)}
        </p>
      </div>
    `
  }

  return `
    <p class="checkout-hint pickup-note">
      No delivery address yet. <a href="/profile.html">Add one in your profile</a>.
    </p>
  `
}

function paymentDetailsHtml(method) {
  if (method === 'gcash' || method === 'maya') {
    const name = methodById(method).label

    return `
      <label class="checkout-field">
        <span>${name} mobile number</span>
        <input type="tel" id="payMobile" inputmode="numeric" maxlength="11"
          placeholder="09XXXXXXXXX" autocomplete="off" />
      </label>
      <p class="checkout-hint">Demo only: any 11-digit number starting with 09 works. No real ${name} account is used.</p>
    `
  }

  if (method === 'card') {
    return `
      <label class="checkout-field">
        <span>Name on card</span>
        <input type="text" id="cardName" placeholder="Juan Dela Cruz" autocomplete="off" />
      </label>

      <label class="checkout-field">
        <span>Card number</span>
        <input type="text" id="cardNumber" inputmode="numeric" maxlength="19"
          placeholder="1234 5678 9012 3456" autocomplete="off" />
      </label>

      <div class="checkout-row">
        <label class="checkout-field">
          <span>Expiry (MM/YY)</span>
          <input type="text" id="cardExpiry" inputmode="numeric" maxlength="5"
            placeholder="MM/YY" autocomplete="off" />
        </label>

        <label class="checkout-field">
          <span>CVV</span>
          <input type="password" id="cardCvv" inputmode="numeric" maxlength="4"
            placeholder="•••" autocomplete="off" />
        </label>
      </div>

      <p class="checkout-hint">Demo only: card details are not stored or sent anywhere.</p>
    `
  }

  if (checkout.delivery === 'pickup') {
    return `
      <p class="checkout-hint">
        Please prepare the exact amount if possible. You will pay at the counter when you pick up your order.
      </p>
    `
  }

  return `
    <p class="checkout-hint">
      Please prepare the exact amount. You will pay the rider when your order arrives.
    </p>
  `
}

function renderPaymentDetails() {
  const { total } = cartTotals()
  const details = document.querySelector('#payDetails')
  const payButton = document.querySelector('#checkoutPay')
  const error = document.querySelector('#checkoutError')

  if (details) details.innerHTML = paymentDetailsHtml(checkout.method)
  if (error) error.textContent = ''

  if (payButton) {
    payButton.innerHTML = checkout.method === 'cod'
      ? 'Place Order'
      : `<i data-lucide="lock"></i> Pay ${formatPeso(total)}`
  }

  document.querySelectorAll('.pay-option[data-method]').forEach(option => {
    option.classList.toggle('selected', option.dataset.method === checkout.method)
  })

  createIcons({ icons })
}

// Updates the delivery / pickup section without wiping what was typed in payment
function renderDeliveryDetails() {
  const details = document.querySelector('#deliveryDetails')
  if (details) details.innerHTML = deliveryDetailsHtml()

  document.querySelectorAll('.pay-option[data-delivery]').forEach(option => {
    option.classList.toggle('selected', option.dataset.delivery === checkout.delivery)
  })

  // the "Cash on Delivery" option is worded differently for pickup
  const cod = methodById('cod')
  const codOption = document.querySelector('.pay-option[data-method="cod"]')

  if (codOption) {
    codOption.querySelector('strong').textContent = cod.label
    codOption.querySelector('small').textContent = cod.desc
  }

  if (checkout.method === 'cod') renderPaymentDetails()

  const label = document.querySelector('#checkoutFeeLabel')
  const value = document.querySelector('#checkoutFeeValue')

  if (label) label.textContent = feeLabel()
  if (value) value.textContent = feeValue()

  createIcons({ icons })
}

function renderCheckout() {
  const { items, pieces, total } = cartTotals()

  if (checkout.step === 'processing') {
    checkoutBox.innerHTML = `
      <div class="checkout-state">
        <div class="checkout-spinner"></div>
        <h3 id="checkoutTitle">Processing your payment...</h3>
        <p>Please don't close or refresh this page.</p>
      </div>
    `
    return
  }

  if (checkout.step === 'success' && checkout.order) {
    const order = checkout.order
    const isCod = order.methodId === 'cod'
    const isPickup = order.fulfillment === 'pickup'

    checkoutBox.innerHTML = `
      <div class="checkout-state success">
        <span class="checkout-success-icon"><i data-lucide="check"></i></span>
        <h3 id="checkoutTitle">${isCod ? 'Order placed successfully!' : 'Payment successful!'}</h3>
        <p>
          ${isPickup
            ? `Thank you for shopping at SM Markets. Your order will be ready for pickup at ${escapeHtml(order.branch)}.`
            : 'Thank you for shopping at SM Markets. Your order is being prepared.'}
        </p>

        <div class="checkout-receipt">
          <div><span>Order number</span><strong>${escapeHtml(order.ref)}</strong></div>
          <div><span>Date</span><strong>${escapeHtml(order.dateLabel)}</strong></div>
          <div><span>Payment method</span><strong>${escapeHtml(order.methodLabel)}</strong></div>
          <div><span>${isCod ? 'Amount to pay' : 'Amount paid'}</span><strong>${formatPeso(order.total)}</strong></div>
          ${isPickup ? `
            <div><span>Pickup branch</span><strong>${escapeHtml(order.branch)}</strong></div>
            <div><span>Pickup time</span><strong>${escapeHtml(order.pickupTime)}</strong></div>
          ` : `
            <div><span>Delivery</span><strong>Home Delivery</strong></div>
          `}
        </div>

        <div class="checkout-receipt-items">
          ${order.items.map(item => `
            <div>
              <span>${escapeHtml(splitName(item.name).title)} × ${item.quantity}</span>
              <span>${formatPeso(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>

        <p class="checkout-hint">This is a demo payment. No real charge was made.</p>

        <a href="/market-home.html" class="cart-primary">Continue Shopping</a>
        <button type="button" class="cart-secondary checkout-done" data-checkout="close">Close</button>
      </div>
    `

    createIcons({ icons })
    return
  }

  // ---- form step ----
  checkoutBox.innerHTML = `
    <div class="checkout-header">
      <h3 id="checkoutTitle">Checkout</h3>
      <button type="button" class="checkout-close" data-checkout="close" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
    </div>

    <div class="checkout-body checkout-landscape">

      <!-- LEFT: delivery + payment method -->
      <div class="checkout-col">

        <section class="delivery-section">
          <h4>Delivery method</h4>

          <div class="pay-options delivery-options">
            ${DELIVERY_OPTIONS.map(option => `
              <label class="pay-option ${option.id === checkout.delivery ? 'selected' : ''}" data-delivery="${option.id}">
                <input type="radio" name="deliveryMethod" value="${option.id}"
                  ${option.id === checkout.delivery ? 'checked' : ''} />

                <span class="pay-option-icon">
                  <i data-lucide="${option.icon}"></i>
                </span>

                <span class="pay-option-text">
                  <strong>${option.label}</strong>
                  <small>${option.desc}</small>
                </span>

                <span class="pay-option-radio"></span>
              </label>
            `).join('')}
          </div>

          <div class="pay-details" id="deliveryDetails">${deliveryDetailsHtml()}</div>
        </section>

        <section>
          <h4>Select payment method</h4>

          <div class="pay-options payment-options">
            ${PAYMENT_METHODS.map(entry => {
              const method = methodById(entry.id)

              return `
                <label class="pay-option ${method.id === checkout.method ? 'selected' : ''}" data-method="${method.id}">
                  <input type="radio" name="payMethod" value="${method.id}"
                    ${method.id === checkout.method ? 'checked' : ''} />

                  <span class="pay-option-icon" ${method.color ? `style="background:${method.color}"` : ''}>
                    ${method.letter ? method.letter : `<i data-lucide="${method.icon}"></i>`}
                  </span>

                  <span class="pay-option-text">
                    <strong>${method.label}</strong>
                    <small>${method.desc}</small>
                  </span>

                  <span class="pay-option-radio"></span>
                </label>
              `
            }).join('')}
          </div>
        </section>

      </div>

      <!-- RIGHT: payment details + summary + pay -->
      <div class="checkout-col checkout-col-right">

        <section>
          <h4>Payment details</h4>
          <div class="pay-details" id="payDetails">${paymentDetailsHtml(checkout.method)}</div>
        </section>

        <section class="checkout-summary">
          <h4>Order summary</h4>
          <div><span>Items (${pieces})</span><strong>${formatPeso(total)}</strong></div>
          <div class="muted"><span id="checkoutFeeLabel">${feeLabel()}</span><span id="checkoutFeeValue">${feeValue()}</span></div>
          <div class="checkout-total"><span>Total</span><strong>${formatPeso(total)}</strong></div>
        </section>

        <p class="checkout-error" id="checkoutError"></p>

        <button type="button" class="cart-primary checkout-pay" id="checkoutPay" data-checkout="pay">
          ${checkout.method === 'cod' ? 'Place Order' : `<i data-lucide="lock"></i> Pay ${formatPeso(total)}`}
        </button>

        <p class="checkout-hint center">Demo checkout: no real payment is processed.</p>

      </div>

    </div>
  `

  createIcons({ icons })
}

function openCheckout() {
  if (!cartTotals().items.length) return

  checkout.step = 'form'
  checkout.method = 'gcash'
  checkout.delivery = 'delivery'
  checkout.slots = pickupSlots()
  checkout.pickupTime = checkout.slots[0]
  checkout.order = null

  renderCheckout()
  checkoutModal.hidden = false
  document.body.style.overflow = 'hidden'

  // Home Delivery is the default, so ask for an address right away
  if (!savedAddress()) openAddressModal()
}

function closeCheckout() {
  checkoutModal.hidden = true
  document.body.style.overflow = ''
}

function validatePayment() {
  const method = checkout.method

  if (checkout.delivery === 'pickup' && !checkout.pickupTime) {
    return 'Please choose a pickup time.'
  }

  if (method === 'gcash' || method === 'maya') {
    const mobile = document.querySelector('#payMobile').value.replace(/\D/g, '')

    if (!/^09\d{9}$/.test(mobile)) {
      return 'Enter a valid 11-digit mobile number (e.g. 09171234567).'
    }
  }

  if (method === 'card') {
    const name = document.querySelector('#cardName').value.trim()
    const number = document.querySelector('#cardNumber').value.replace(/\D/g, '')
    const expiry = document.querySelector('#cardExpiry').value
    const cvv = document.querySelector('#cardCvv').value.replace(/\D/g, '')

    if (!name) return 'Enter the name on your card.'
    if (number.length !== 16) return 'Card number must be 16 digits.'

    const match = expiry.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return 'Enter the expiry date as MM/YY.'

    const month = Number(match[1])
    const year = 2000 + Number(match[2])

    if (month < 1 || month > 12) return 'Expiry month must be between 01 and 12.'

    // a card is valid until the end of its expiry month
    if (new Date(year, month, 1) <= new Date()) return 'This card has expired.'

    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits.'
  }

  return ''
}

function paymentLabel() {
  const method = methodById(checkout.method)

  if (checkout.method === 'gcash' || checkout.method === 'maya') {
    const mobile = document.querySelector('#payMobile').value.replace(/\D/g, '')
    return `${method.label} (•••• ${mobile.slice(-4)})`
  }

  if (checkout.method === 'card') {
    const number = document.querySelector('#cardNumber').value.replace(/\D/g, '')
    return `Card (•••• ${number.slice(-4)})`
  }

  return method.label
}

function completePayment(methodLabel) {
  const { items, total } = cartTotals()
  const now = new Date()
  const isPickup = checkout.delivery === 'pickup'

  const order = {
    ref: 'SM-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' +
      Math.random().toString(36).slice(2, 8).toUpperCase(),
    date: now.toISOString(),
    dateLabel: now.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }),
    methodId: checkout.method,
    methodLabel,
    total,
    items,
    branch: branchName,
    fulfillment: checkout.delivery,
    pickupTime: isPickup ? checkout.pickupTime : null
  }

  // save the order and empty the cart
  try {
    const orders = JSON.parse(localStorage.getItem('smOrders')) || []
    orders.unshift(order)
    localStorage.setItem('smOrders', JSON.stringify(orders))
  } catch (error) {
    console.error('Unable to save order:', error)
  }

  saveCart([])
  renderCart()

  checkout.order = order
  checkout.step = 'success'
  renderCheckout()
}

checkoutBox.addEventListener('click', event => {
  const action = event.target.closest('[data-checkout]')?.dataset.checkout

  if (action === 'close') {
    closeCheckout()
    return
  }

  if (action === 'pay') {
    if (checkout.delivery === 'delivery' && !savedAddress()) {
      openAddressModal()
      return
    }

    const error = validatePayment()

    if (error) {
      document.querySelector('#checkoutError').textContent = error
      return
    }

    const label = paymentLabel()

    checkout.step = 'processing'
    renderCheckout()

    setTimeout(() => completePayment(label), 1800)
  }
})

checkoutBox.addEventListener('change', event => {
  const target = event.target

  if (target.name === 'payMethod') {
    checkout.method = target.value
    renderPaymentDetails()
    return
  }

  if (target.name === 'deliveryMethod') {
    checkout.delivery = target.value

    // refresh the time slots each time pickup is chosen
    if (checkout.delivery === 'pickup') {
      checkout.slots = pickupSlots()
      checkout.pickupTime = checkout.slots[0]
    }

    renderDeliveryDetails()

    if (checkout.delivery === 'delivery' && !savedAddress()) openAddressModal()
    return
  }

  if (target.id === 'pickupTime') {
    checkout.pickupTime = target.value
  }
})

// Digits-only + auto formatting for payment inputs
checkoutBox.addEventListener('input', event => {
  const input = event.target

  if (input.id === 'payMobile') {
    input.value = input.value.replace(/\D/g, '').slice(0, 11)
  }

  if (input.id === 'cardNumber') {
    input.value = input.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  if (input.id === 'cardExpiry') {
    const digits = input.value.replace(/\D/g, '').slice(0, 4)
    input.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  if (input.id === 'cardCvv') {
    input.value = input.value.replace(/\D/g, '').slice(0, 4)
  }

  const error = document.querySelector('#checkoutError')
  if (error) error.textContent = ''
})

checkoutModal.addEventListener('click', event => {
  // clicking the dark backdrop closes the form (not while processing)
  if (event.target === checkoutModal && checkout.step !== 'processing') closeCheckout()
})

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return

  // close the address popup first, keep the checkout open
  if (!addressModal.hidden) {
    closeAddressModal()
    return
  }

  if (!checkoutModal.hidden && checkout.step !== 'processing') {
    closeCheckout()
  }
})

// ========================================
// 6C. SMART-TO-CART (same modal as the homepage)
// ========================================

app.insertAdjacentHTML('beforeend', smartCartMarkup())

const smartCart = initSmartCart({
  branchName,
  onCartChange: () => renderCart(),
  onShowCart: () => {
    smartCart.close()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// ========================================
// 7. HEADER + FOOTER BEHAVIOUR
// ========================================

const marketSearch = document.querySelector('#marketSearch')

function performSearch() {
  const value = marketSearch.value.trim()

  if (!value) {
    marketSearch.focus()
    return
  }

  localStorage.setItem('marketSearchQuery', value)
  alert(`Searching for: ${value}`)
}

document.querySelector('#searchButton').addEventListener('click', performSearch)

marketSearch.addEventListener('keydown', event => {
  if (event.key === 'Enter') performSearch()
})

document.querySelector('#cartButton').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

document.querySelector('#favoritesButton').addEventListener('click', () => {
  alert('Your favorites will be available soon.')
})

document.querySelector('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault()

  const input = document.querySelector('#newsletterEmail')

  if (!input.value.trim()) return

  document.querySelector('#newsletterMessage').textContent = 'Thank you for subscribing!'
  input.value = ''
})

// Keep the page in sync if the cart changes in another tab
window.addEventListener('storage', event => {
  if (event.key === 'smCart') renderCart()
})

renderCart()