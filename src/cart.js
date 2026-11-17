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
  Lock
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
  Lock
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
  { id: 'gcash', label: 'GCash', desc: 'Pay with your GCash wallet', letter: 'G', color: '#007dfe' },
  { id: 'maya', label: 'Maya', desc: 'Pay with your Maya wallet', letter: 'M', color: '#00a651' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa or Mastercard', icon: 'credit-card' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: 'banknote' }
]

const checkoutModal = document.querySelector('#checkoutModal')
const checkoutBox = document.querySelector('#checkoutBox')
const checkout = { step: 'form', method: 'gcash', order: null }

function cartTotals() {
  const items = readCart().filter(item => item && item.quantity > 0)

  return {
    items,
    pieces: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}

function methodById(id) {
  return PAYMENT_METHODS.find(method => method.id === id)
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

  document.querySelectorAll('.pay-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.method === checkout.method)
  })

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

    checkoutBox.innerHTML = `
      <div class="checkout-state success">
        <span class="checkout-success-icon"><i data-lucide="check"></i></span>
        <h3 id="checkoutTitle">${isCod ? 'Order placed successfully!' : 'Payment successful!'}</h3>
        <p>Thank you for shopping at SM Markets. Your order is being prepared.</p>

        <div class="checkout-receipt">
          <div><span>Order number</span><strong>${escapeHtml(order.ref)}</strong></div>
          <div><span>Date</span><strong>${escapeHtml(order.dateLabel)}</strong></div>
          <div><span>Payment method</span><strong>${escapeHtml(order.methodLabel)}</strong></div>
          <div><span>${isCod ? 'Amount to pay' : 'Amount paid'}</span><strong>${formatPeso(order.total)}</strong></div>
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

    <div class="checkout-body">

      <section>
        <h4>Select payment method</h4>

        <div class="pay-options">
          ${PAYMENT_METHODS.map(method => `
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
          `).join('')}
        </div>

        <div class="pay-details" id="payDetails">${paymentDetailsHtml(checkout.method)}</div>
      </section>

      <section class="checkout-summary">
        <h4>Order summary</h4>
        <div><span>Items (${pieces})</span><strong>${formatPeso(total)}</strong></div>
        <div class="muted"><span>Delivery fee</span><span>Free (demo)</span></div>
        <div class="checkout-total"><span>Total</span><strong>${formatPeso(total)}</strong></div>
      </section>

      <p class="checkout-error" id="checkoutError"></p>

      <button type="button" class="cart-primary checkout-pay" id="checkoutPay" data-checkout="pay">
        ${checkout.method === 'cod' ? 'Place Order' : `<i data-lucide="lock"></i> Pay ${formatPeso(total)}`}
      </button>

      <p class="checkout-hint center">Demo checkout: no real payment is processed.</p>

    </div>
  `

  createIcons({ icons })
}

function openCheckout() {
  if (!cartTotals().items.length) return

  checkout.step = 'form'
  checkout.method = 'gcash'
  checkout.order = null

  renderCheckout()
  checkoutModal.hidden = false
  document.body.style.overflow = 'hidden'
}

function closeCheckout() {
  checkoutModal.hidden = true
  document.body.style.overflow = ''
}

function validatePayment() {
  const method = checkout.method

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

  const order = {
    ref: 'SM-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' +
      Math.random().toString(36).slice(2, 8).toUpperCase(),
    date: now.toISOString(),
    dateLabel: now.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }),
    methodId: checkout.method,
    methodLabel,
    total,
    items,
    branch: branchName
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
  if (event.target.name !== 'payMethod') return

  checkout.method = event.target.value
  renderPaymentDetails()
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
  if (event.key === 'Escape' && !checkoutModal.hidden && checkout.step !== 'processing') {
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

document.querySelector('#accountButton').addEventListener('click', () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    alert('You are currently signed in.')
  } else {
    window.location.href = '/signin.html'
  }
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