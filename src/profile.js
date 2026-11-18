import './market-home.css'
import './profile.css'
import { smartCartMarkup, initSmartCart, smartCartIcons } from './smart-cart.js'

import {
  createIcons,
  LogOut,
  MapPin,
  Lock,
  Clock,
  Search,
  UserRound,
  ShoppingCart,
  Star
} from 'lucide'

const icons = {
  ...smartCartIcons,
  LogOut,
  MapPin,
  Lock,
  Clock,
  Search,
  UserRound,
  ShoppingCart,
  Star
}

// ========================================
// 1. STORAGE HELPERS
// ========================================

// Where the logged-in account might be saved by signin.js.
// Add your own key to the front of this list if you use a different one.
const USER_KEYS = ['currentUser', 'loggedInUser', 'authUser', 'user']
const EMAIL_KEYS = ['loggedInEmail', 'currentUserEmail', 'userEmail']

function readJSON(key, fallback = null) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

function pick(obj, names) {
  for (const name of names) {
    if (obj?.[name] != null && obj[name] !== '') return obj[name]
  }
  return ''
}

function normalize(raw) {
  return {
    firstName: pick(raw, ['firstName', 'firstname', 'first_name', 'fname']),
    lastName: pick(raw, ['lastName', 'lastname', 'last_name', 'lname']),
    email: pick(raw, ['email', 'Email']),
    contact: pick(raw, ['contact', 'contactNumber', 'phone', 'mobile', 'phoneNumber']),
    passwordChangedAt: pick(raw, ['passwordChangedAt', 'createdAt'])
  }
}

function loadUser() {
  let raw = null
  let sourceKey = null

  for (const key of USER_KEYS) {
    const value = readJSON(key)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      raw = value
      sourceKey = key
      break
    }
  }

  // Fallback: an email is saved and the full account is in the "users" list
  if (!raw) {
    const email = EMAIL_KEYS.map(key => localStorage.getItem(key)).find(Boolean)
    const users = readJSON('users', [])

    if (email && Array.isArray(users)) {
      raw = users.find(u => String(pick(u, ['email'])).toLowerCase() === email.toLowerCase())
    }
  }

  return raw ? { raw, sourceKey, ...normalize(raw) } : null
}

// Save changes to the current user AND to the "users" list (if the account is there)
function persistUser(changes) {
  const merged = { ...state.user.raw, ...changes }
  localStorage.setItem(state.user.sourceKey || 'currentUser', JSON.stringify(merged))

  const users = readJSON('users', [])

  if (Array.isArray(users)) {
    const index = users.findIndex(
      u => String(pick(u, ['email'])).toLowerCase() === state.user.email.toLowerCase()
    )

    if (index !== -1) {
      users[index] = { ...users[index], ...changes }
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  state.user = { raw: merged, sourceKey: state.user.sourceKey || 'currentUser', ...normalize(merged) }
}

function findPasswordRecord() {
  const users = readJSON('users', [])

  if (Array.isArray(users)) {
    const found = users.find(
      u => String(pick(u, ['email'])).toLowerCase() === state.user.email.toLowerCase()
    )
    if (found) return found
  }

  return state.user.raw
}

const addressKey = () => `smAddress:${state.user.email.toLowerCase()}`

// ========================================
// 2. UTILITIES
// ========================================

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(value) {
  const date = new Date(value)
  if (isNaN(date)) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function timeAgo(value) {
  const date = new Date(value)
  if (isNaN(date)) return ''

  const days = Math.floor((Date.now() - date.getTime()) / 86400000)

  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

// ========================================
// 3. STATE
// ========================================

if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = '/signin.html'
}

const state = {
  user: loadUser() || { raw: {}, sourceKey: null, firstName: '', lastName: '', email: '', contact: '', passwordChangedAt: '' },
  editing: false,
  addressEditing: false,
  passwordOpen: false,
  message: null   // { section: 'personal' | 'address' | 'security', type: 'ok' | 'error', text }
}

const logoFiles = import.meta.glob('./assets/images/sm_logo.*', {
  eager: true,
  query: '?url',
  import: 'default'
})

const logoImage = Object.values(logoFiles)[0] || ''

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

    <nav class="market-navigation profile-nav">

      <div class="market-branch">
        <i data-lucide="map-pin"></i>
        <span>
          You're currently shopping at:
          <strong id="branchName">${escapeHtml(branchName)}</strong>
        </span>
      </div>

    </nav>

  </header>

  <!-- PROFILE CONTENT -->
  <div id="profileContent"></div>

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
          <a href="/profile.html">My Account</a>
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
`

const content = document.querySelector('#profileContent')


// ========================================
// 4. RENDER
// ========================================

function flash(section) {
  const m = state.message
  return m && m.section === section
    ? `<p class="pf-msg ${m.type}">${escapeHtml(m.text)}</p>`
    : ''
}

function renderPersonal(u) {
  const row = (label, value) => `
    <div class="pf-row">
      <span class="pf-label">${label}</span>
      <strong class="pf-value">${escapeHtml(value) || '—'}</strong>
    </div>`

  const input = (label, id, value, extra = '') => `
    <div class="pf-row">
      <label class="pf-label" for="${id}">${label}</label>
      <input class="pf-input" id="${id}" value="${escapeHtml(value)}" ${extra} />
    </div>`

  return `
    <section class="pf-card">
      <div class="pf-card-head">
        <h2>Personal Information</h2>
        ${state.editing
          ? `<div class="pf-head-actions">
               <button class="pf-btn pf-btn-ghost" data-action="cancel">Cancel</button>
               <button class="pf-btn pf-btn-primary" data-action="save">Save</button>
             </div>`
          : `<button class="pf-btn pf-btn-soft" data-action="edit">Edit</button>`}
      </div>

      ${state.editing
        ? input('First name', 'pfFirst', u.firstName) +
          input('Last name', 'pfLast', u.lastName) +
          row('Email', u.email) +
          input('Contact', 'pfContact', u.contact, 'inputmode="tel"')
        : row('First name', u.firstName) +
          row('Last name', u.lastName) +
          row('Email', u.email) +
          row('Contact', u.contact)}

      ${flash('personal')}
    </section>`
}

function renderAddress() {
  const address = readJSON(addressKey())

  let body

  if (state.addressEditing) {
    const a = address || {}
    body = `
      <div class="pf-form">
        <input class="pf-input" id="adStreet" placeholder="House no. / Street" value="${escapeHtml(a.street)}" />
        <input class="pf-input" id="adBarangay" placeholder="Barangay" value="${escapeHtml(a.barangay)}" />
        <input class="pf-input" id="adCity" placeholder="City / Municipality" value="${escapeHtml(a.city)}" />
        <div class="pf-form-two">
          <input class="pf-input" id="adProvince" placeholder="Province" value="${escapeHtml(a.province)}" />
          <input class="pf-input" id="adZip" placeholder="ZIP code" inputmode="numeric" value="${escapeHtml(a.zip)}" />
        </div>
        <div class="pf-form-actions">
          <button class="pf-btn pf-btn-ghost" data-action="cancel-address">Cancel</button>
          <button class="pf-btn pf-btn-primary" data-action="save-address">Save address</button>
        </div>
      </div>`
  } else if (address) {
    body = `
      <div class="pf-address">
        <i data-lucide="map-pin"></i>
        <p>
          ${escapeHtml(address.street)}<br />
          ${escapeHtml(address.barangay)}, ${escapeHtml(address.city)}<br />
          ${escapeHtml(address.province)} ${escapeHtml(address.zip)}
        </p>
      </div>
      <div class="pf-form-actions">
        <button class="pf-btn pf-btn-ghost" data-action="remove-address">Remove</button>
        <button class="pf-btn pf-btn-soft" data-action="add-address">Edit address</button>
      </div>`
  } else {
    body = `
      <div class="pf-empty">
        <i data-lucide="map-pin"></i>
        <p>Default billing address is not added.</p>
      </div>
      <button class="pf-btn pf-btn-soft pf-btn-block" data-action="add-address">+ Add address</button>`
  }

  return `
    <section class="pf-card">
      <div class="pf-card-head"><h2>Address Book</h2></div>
      <div class="pf-card-body">
        <p class="pf-eyebrow">Default billing address</p>
        ${body}
        ${flash('address')}
      </div>
    </section>`
}

function renderSecurity(u) {
  const changed = u.passwordChangedAt
  const dateText = changed ? formatDate(changed) : 'Not available'
  const agoText = changed ? timeAgo(changed) : ''

  return `
    <section class="pf-card pf-security">
      <div class="pf-card-head">
        <h2>Security</h2>
        <span class="pf-pill">Manage your password and account security</span>
      </div>

      <div class="pf-sec-row">
        <span class="pf-sec-icon"><i data-lucide="lock"></i></span>
        <div class="pf-sec-text">
          <strong>Change Password</strong>
          <p>Update your password to keep your account secure.</p>
        </div>
        <button class="pf-btn pf-btn-soft" data-action="change-password">Change Password</button>
      </div>

      <div class="pf-sec-row">
        <span class="pf-sec-icon"><i data-lucide="clock"></i></span>
        <div class="pf-sec-text">
          <strong>Last Password Changed</strong>
          <p>${escapeHtml(dateText)}</p>
        </div>
        ${agoText ? `<span class="pf-pill">${escapeHtml(agoText)}</span>` : ''}
      </div>

      ${flash('security')}
    </section>`
}

function renderPasswordModal() {
  if (!state.passwordOpen) return ''

  return `
    <div class="pf-overlay" data-action="close-password-bg">
      <div class="pf-modal" role="dialog" aria-modal="true" aria-labelledby="pfPwTitle">
        <h3 id="pfPwTitle">Change Password</h3>
        <p>Enter your current password, then choose a new one.</p>

        <div class="pf-form">
          <input class="pf-input" type="password" id="pwCurrent" placeholder="Current password" autocomplete="current-password" />
          <input class="pf-input" type="password" id="pwNew" placeholder="New password (min. 8 characters)" autocomplete="new-password" />
          <input class="pf-input" type="password" id="pwConfirm" placeholder="Confirm new password" autocomplete="new-password" />
        </div>

        <p class="pf-msg error" id="pwError" hidden></p>

        <div class="pf-form-actions">
          <button class="pf-btn pf-btn-ghost" data-action="close-password">Cancel</button>
          <button class="pf-btn pf-btn-primary" data-action="save-password">Update password</button>
        </div>
      </div>
    </div>`
}

function render() {
  const u = state.user

  const initials =
    ((u.firstName[0] || '') + (u.lastName[0] || '')).toUpperCase() ||
    (u.email[0] || '?').toUpperCase()

  const fullName = `${u.firstName} ${u.lastName}`.trim() || u.email || 'Guest'

  content.innerHTML = `
    <main class="pf-page">

      <header class="pf-banner">
        <div class="pf-user">
          <div class="pf-avatar">${escapeHtml(initials)}</div>
          <div>
            <span>Welcome back,</span>
            <h1>${escapeHtml(fullName)}</h1>
          </div>
        </div>

        <button class="pf-logout" data-action="logout">
          <i data-lucide="log-out"></i> Log out
        </button>
      </header>

      <div class="pf-grid">
        ${renderPersonal(u)}
        ${renderAddress()}
      </div>

      ${renderSecurity(u)}

    </main>

    ${renderPasswordModal()}
  `

  createIcons({ icons })
}

// ========================================
// 5. ACTIONS
// ========================================

function savePersonal() {
  const firstName = document.querySelector('#pfFirst').value.trim()
  const lastName = document.querySelector('#pfLast').value.trim()
  const contact = document.querySelector('#pfContact').value.trim()
  const digits = contact.replace(/\D/g, '')

  if (!firstName || !lastName) {
    state.message = { section: 'personal', type: 'error', text: 'First name and last name are required.' }
    return render()
  }

  if (contact && (digits.length < 10 || digits.length > 13)) {
    state.message = { section: 'personal', type: 'error', text: 'Please enter a valid contact number.' }
    return render()
  }

  persistUser({ firstName, lastName, contact })

  state.editing = false
  state.message = { section: 'personal', type: 'ok', text: 'Your information was updated.' }
  render()
}

function saveAddress() {
  const get = id => document.querySelector(id).value.trim()

  const address = {
    street: get('#adStreet'),
    barangay: get('#adBarangay'),
    city: get('#adCity'),
    province: get('#adProvince'),
    zip: get('#adZip')
  }

  if (Object.values(address).some(value => !value)) {
    state.message = { section: 'address', type: 'error', text: 'Please fill in all address fields.' }
    return render()
  }

  localStorage.setItem(addressKey(), JSON.stringify(address))

  state.addressEditing = false
  state.message = { section: 'address', type: 'ok', text: 'Address saved.' }
  render()
}

function savePassword() {
  const current = document.querySelector('#pwCurrent').value
  const next = document.querySelector('#pwNew').value
  const confirm = document.querySelector('#pwConfirm').value
  const error = document.querySelector('#pwError')

  const fail = text => {
    error.textContent = text
    error.hidden = false
  }

  const record = findPasswordRecord()

  // Only verifies the current password if the account stores a plain "password" field
  if (record?.password && current !== record.password) {
    return fail('Current password is incorrect.')
  }

  if (next.length < 8) return fail('New password must be at least 8 characters.')
  if (next === current) return fail('New password must be different from the current one.')
  if (next !== confirm) return fail('Passwords do not match.')

  persistUser({ password: next, passwordChangedAt: new Date().toISOString() })

  state.passwordOpen = false
  state.message = { section: 'security', type: 'ok', text: 'Password updated successfully.' }
  render()
}

content.addEventListener('click', event => {
  const target = event.target.closest('[data-action]')
  if (!target) return

  const action = target.dataset.action

  // Clicking the dark backdrop closes the password dialog
  if (action === 'close-password-bg') {
    if (event.target === target) {
      state.passwordOpen = false
      render()
    }
    return
  }

  switch (action) {
    case 'edit':
      state.editing = true
      state.message = null
      return render()

    case 'cancel':
      state.editing = false
      state.message = null
      return render()

    case 'save':
      return savePersonal()

    case 'add-address':
      state.addressEditing = true
      state.message = null
      return render()

    case 'cancel-address':
      state.addressEditing = false
      state.message = null
      return render()

    case 'save-address':
      return saveAddress()

    case 'remove-address':
      if (window.confirm('Are you sure you want to remove this address?')) {
        localStorage.removeItem(addressKey())
        state.message = { section: 'address', type: 'ok', text: 'Address removed.' }
        render()
      }
      return

    case 'change-password':
      state.passwordOpen = true
      state.message = null
      return render()

    case 'close-password':
      state.passwordOpen = false
      return render()

    case 'save-password':
      return savePassword()

    case 'logout':
      localStorage.setItem('isLoggedIn', 'false')
      window.location.href = '/market-home.html'
  }
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.passwordOpen) {
    state.passwordOpen = false
    render()
  }
})

// ========================================
// 6. HEADER + FOOTER BEHAVIOUR
// ========================================

function updateCartBadge() {
  const badge = document.querySelector('#cartBadge')
  if (!badge) return

  const cart = readJSON('smCart', [])
  const count = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  )

  badge.textContent = count > 99 ? '99+' : String(count)
  badge.hidden = count === 0
}

updateCartBadge()

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

// Already on the profile page, so just scroll to the top
document.querySelector('#accountButton').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

document.querySelector('#cartButton').addEventListener('click', () => {
  window.location.href = '/cart.html'
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

// ========================================
// 7. SMART-TO-CART (same modal as the home and cart pages)
// ========================================

app.insertAdjacentHTML('beforeend', smartCartMarkup())

initSmartCart({
  branchName,
  onCartChange: updateCartBadge,
  onShowCart: () => { window.location.href = '/cart.html' }
})

render()