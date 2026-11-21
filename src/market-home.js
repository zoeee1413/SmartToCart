import './market-home.css'
import './product-modal.css'

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
  ChevronLeft,
  Heart
} from 'lucide'

import {
  smartCartIcons,
  smartCartMarkup,
  initSmartCart,
  readStorage
} from './smart-cart.js'

// ========================================
// 1. IMAGE LOADER
// ========================================

const imageFiles = import.meta.glob(
  './assets/images/*',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function getImage(filename, optional = false) {
  const target = filename.toLowerCase()

  // Matches with or without the file extension (.avif, .png, .jpg, etc.)
  const image = Object.entries(imageFiles).find(([path]) => {
    const file = path.split('/').pop().toLowerCase()
    const nameOnly = file.replace(/\.[^.]+$/, '')
    return file === target || nameOnly === target
  })

  if (!image) {
    if (!optional) console.error(`Image not found: ${filename}`)
    return ''
  }

  return image[1]
}

// ========================================
// 2. LOGO + HERO IMAGES
// ========================================

const logoImage = getImage('sm_logo.avif')

const heroImages = [
  getImage('home1.avif'),
  getImage('home2.avif'),
  getImage('home3.avif')
]

// ========================================
// 3. CATEGORY DATA
// ========================================

const categories = [
  { name: 'Only in SM Markets', image: getImage('Only in SM Markets.avif') },
  { name: 'Watts Japan', image: getImage('Watts Japan.avif') },
  { name: 'Promos', image: getImage('Promos.avif') },
  { name: 'Fresh Produce', image: getImage('Fresh Produce.avif') },
  { name: 'Fresh Meat & Seafood', image: getImage('Fresh Meat & Seafood.avif') },
  { name: 'Frozen Goods', image: getImage('Frozen Goods.avif') },
  { name: 'Ready to Heat & Eat', image: getImage('Ready to Heat & Eat.avif') },
  { name: 'Ready to Cook', image: getImage('Ready to Cook.avif') },
  { name: 'Chilled & Dairy Items', image: getImage('Chilled & Dairy Items.avif') }
]

// ========================================
// 3B. FRESH MEAT & SEAFOOD PRODUCTS
// ========================================

const freshMeatProducts = [
  {
    id: 'sm-bonus-fresh-chilled-chicken',
    name: 'SM Bonus Fresh Chilled Chicken | 800g-1000g',
    size: '800G-1000G',
    brand: 'SM BONUS',
    price: 190,
    perKg: 190,
    image: getImage('SM Bonus Fresh Chilled Chicken')
  },
  {
    id: 'sm-bonus-adobo-cut',
    name: 'SM Bonus Pork Adobo Cut | 400g-500g',
    size: '400G-500G',
    brand: 'SM BONUS',
    price: 105,
    perKg: 210,
    image: getImage('SM BOnus Adobo Cut')
  },
  {
    id: 'sm-bonus-liempo',
    name: 'SM Bonus Liempo | 400g-500g',
    size: '400G-500G',
    brand: 'SM BONUS',
    price: 175,
    perKg: 350,
    image: getImage('SM Bonus Liempo')
  },
  {
    id: 'sm-bonus-c-lean',
    name: 'SM Bonus C Lean | 500g-550g',
    size: '500G-550G',
    brand: 'SM BONUS',
    price: 147.95,
    perKg: 269,
    image: getImage('SM Bonus C Lean')
  },
  {
    id: 'magnolia-chicken-breast',
    name: 'Magnolia Fresh Chilled Chicken Breast | 800g-1200g',
    size: '800G-1200G',
    brand: 'MAGNOLIA',
    price: 270,
    perKg: 225,
    image: getImage('Magnolia Chicken Breast')
  }
]

function formatPeso(value) {
  return '₱' + value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// ========================================
// 3C. PANTRY ESSENTIALS PRODUCTS
// ========================================

const pantryProducts = [
  {
    id: 'ajinomoto-msg',
    name: 'Ajinomoto Msg | 100g',
    size: '100G',
    price: 28.5,
    image: getImage('Ajinomoto Msg')
  },
  {
    id: 'knorr-liquid-seasoning',
    name: 'Knorr Liquid Seasoning Original | 250ml',
    size: '250ML',
    price: 101,
    image: getImage('Knorr Liquid')
  },
  {
    id: 'datu-puti-patis',
    name: 'Datu Puti Patis | 1L',
    size: '1L',
    price: 82,
    image: getImage('Datu Puti Pastis')
  },
  {
    id: 'knorr-beef-cubes',
    name: 'Knorr Beef Cubes Pantry | 60g',
    size: '60G',
    price: 35.75,
    oldPrice: 37,
    discount: '3% OFF',
    image: getImage('Knorr Beef Cubes')
  },
  {
    id: 'silver-swan-suka-puti',
    name: 'Silver Swan Suka Puti Doy Pack | 200ml',
    size: '200ML',
    price: 8,
    image: getImage('Silver Swan Suka Puti')
  }
]

const allProducts = [...freshMeatProducts, ...pantryProducts]

function renderProductCard(product) {
  const onSale = Boolean(product.oldPrice)

  return `
    <article class="product-card" data-product="${product.id}">

      <div class="product-image" role="button" tabindex="0"
           aria-label="Add ${product.name} to cart">
        ${product.image ? `
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          />
        ` : ''}

        ${product.discount ? `
          <span class="product-discount">${product.discount}</span>
        ` : ''}
      </div>

      <span class="product-size">${product.size}</span>

      <h3 class="product-name">${product.name}</h3>

      <div class="product-price-row ${product.perKg ? '' : 'no-per-kg'}">
        <p class="product-price ${onSale ? 'sale' : ''}">
          ${formatPeso(product.price)}
        </p>
        ${onSale ? `
          <p class="product-old-price">${formatPeso(product.oldPrice)}</p>
        ` : ''}
      </div>

      ${product.perKg ? `
        <p class="product-per-kg">${formatPeso(product.perKg)}/KG</p>
      ` : ''}

      <div class="product-actions">
        <button class="add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>

        <button
          class="favorite-button"
          data-id="${product.id}"
          aria-label="Add to favorites"
        >
          <i data-lucide="heart"></i>
        </button>
      </div>

    </article>
  `
}

function renderProductSection({ id, title, products }) {
  return `
    <section class="market-products" id="${id}">

      <div class="products-heading">
        <h2>${title}</h2>

        <button class="see-more" data-category="${title}">
          See More
          <span class="see-more-icon">
            <i data-lucide="chevron-right"></i>
          </span>
        </button>
      </div>

      <div class="products-grid">
        ${products.map(renderProductCard).join('')}
      </div>

    </section>
  `
}

// ========================================
// 4. GET SELECTED BRANCH
// ========================================

let selectedBranch = null

try {
  selectedBranch = JSON.parse(
    localStorage.getItem('selectedSMBranch')
  )
} catch (error) {
  console.error('Unable to load selected branch:', error)
}

const branchName = selectedBranch?.name || 'SM City Sta. Mesa'

// ========================================
// 5. MAIN PAGE
// ========================================

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

    <!-- SECONDARY NAVIGATION -->
    <nav class="market-navigation">

      <button class="view-categories" id="viewCategories">
        <i data-lucide="grid-2x2"></i>
        View all categories
      </button>

      <div class="market-branch">

        <i data-lucide="map-pin"></i>

        <span>
          You're currently shopping at:
          <strong id="branchName"></strong>
        </span>

      </div>

      <button class="view-stores" id="viewStores">
        <i data-lucide="store"></i>
        View Stores
      </button>

    </nav>

  </header>


  <!-- HERO CAROUSEL -->
  <section class="market-hero">

    <div class="market-hero-slides" id="heroSlides">

      ${heroImages.map((image, index) => `
        ${image ? `
          <img
            src="${image}"
            class="market-hero-image ${index === 0 ? 'active' : ''}"
            alt="SM Markets promotion"
          />
        ` : ''}
      `).join('')}

    </div>

    <button class="hero-arrow hero-prev" id="heroPrev" aria-label="Previous slide">
      <i data-lucide="chevron-left"></i>
    </button>

    <button class="hero-arrow hero-next" id="heroNext" aria-label="Next slide">
      <i data-lucide="chevron-right"></i>
    </button>

    <div class="hero-dots" id="heroDots">

      ${heroImages.map((image, index) => `
        ${image ? `
          <button
            class="hero-dot ${index === 0 ? 'active' : ''}"
            data-slide="${index}"
            aria-label="Go to slide ${index + 1}"
          ></button>
        ` : ''}
      `).join('')}

    </div>

  </section>


  <!-- CATEGORY SECTION -->
  <section class="market-category-section" id="categories">

    <div class="market-section-heading">

      <div>
        <span class="section-eyebrow">SHOP BY CATEGORY</span>
        <h2>Explore Our Categories</h2>
        <p>Discover everything you need for your everyday shopping.</p>
      </div>

      <button class="see-all-categories" id="seeAllCategories">
        View all
        <i data-lucide="chevron-right"></i>
      </button>

    </div>


    <div class="market-category-grid">

      ${categories.map((category) => `
        <button
          class="market-category-card"
          data-category="${category.name}"
        >

          <div class="market-category-icon">

            ${category.image ? `
              <img
                src="${category.image}"
                alt="${category.name}"
                loading="lazy"
              />
            ` : `
              <div class="category-fallback">
                ${category.name.charAt(0)}
              </div>
            `}

          </div>

          <span class="market-category-name">
            ${category.name}
          </span>

        </button>
      `).join('')}

    </div>

  </section>


  <!-- FRESH MEAT & SEAFOOD -->
  ${renderProductSection({
    id: 'freshMeat',
    title: 'Fresh Meat & Seafood',
    products: freshMeatProducts
  })}


  <!-- PANTRY ESSENTIALS -->
  ${renderProductSection({
    id: 'pantry',
    title: 'Pantry Essentials',
    products: pantryProducts
  })}


  <!-- WELCOME SECTION -->
  <section class="market-welcome">

    <div class="market-welcome-content">

      <span class="welcome-eyebrow">WELCOME TO SM MARKETS</span>

      <h1>Everything you need, all in one place.</h1>

      <p>
        Discover fresh groceries, everyday essentials, and great deals
        at your selected SM Markets branch.
      </p>

      <button class="browse-categories-button" id="browseCategories">
        Browse Categories
        <i data-lucide="chevron-right"></i>
      </button>

    </div>

  </section>


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


  <!-- PRODUCT QUANTITY MODAL -->
  <div class="pd-overlay" id="pdOverlay" hidden>
    <div class="pd-modal" role="dialog" aria-modal="true" aria-labelledby="pdName">

      <button class="pd-close" id="pdClose" aria-label="Close">
        <i data-lucide="x"></i>
      </button>

      <div class="pd-image"><img id="pdImage" src="" alt="" /></div>

      <div class="pd-info">
        <span class="pd-size" id="pdSize"></span>
        <h3 class="pd-name" id="pdName"></h3>

        <div class="pd-price-row">
          <strong class="pd-price" id="pdPrice"></strong>
          <span class="pd-old-price" id="pdOldPrice" hidden></span>
        </div>
        <p class="pd-per-kg" id="pdPerKg" hidden></p>

        <div class="pd-qty-row">
          <span class="pd-qty-label">Quantity</span>
          <div class="pd-qty">
            <button type="button" id="pdMinus" aria-label="Decrease quantity">−</button>
            <input type="number" id="pdQty" value="1" min="1" max="99" inputmode="numeric" aria-label="Quantity" />
            <button type="button" id="pdPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="pd-subtotal">
          <span>Subtotal</span>
          <strong id="pdSubtotal"></strong>
        </div>

        <button type="button" class="pd-confirm" id="pdConfirm">Add to Cart</button>
      </div>

    </div>
  </div>

  <div class="pd-toast" id="pdToast" role="status" aria-live="polite"></div>

  ${smartCartMarkup()}
`

// ========================================
// 6. INITIALIZE LUCIDE ICONS
// ========================================

createIcons({
  icons: {
    Search,
    UserRound,
    ShoppingCart,
    Star,
    MapPin,
    Grid2X2,
    Store,
    ChevronRight,
    ChevronLeft,
    Heart,
    ...smartCartIcons
  }
})

// ========================================
// 7. DISPLAY SELECTED BRANCH
// ========================================

const branchNameElement = document.querySelector('#branchName')

if (branchNameElement) {
  branchNameElement.textContent = branchName
}

// ========================================
// 8. HERO CAROUSEL FUNCTIONALITY
// ========================================

const slides = document.querySelectorAll('.market-hero-image')
const dots = document.querySelectorAll('.hero-dot')

let currentSlide = 0
let carouselInterval

function showSlide(index) {
  if (!slides.length) return

  currentSlide = (index + slides.length) % slides.length

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide)
  })

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide)
  })
}

function nextSlide() {
  showSlide(currentSlide + 1)
}

function previousSlide() {
  showSlide(currentSlide - 1)
}

function startCarousel() {
  clearInterval(carouselInterval)

  if (slides.length > 1) {
    carouselInterval = setInterval(nextSlide, 5000)
  }
}

document.querySelector('#heroNext')?.addEventListener('click', () => {
  nextSlide()
  startCarousel()
})

document.querySelector('#heroPrev')?.addEventListener('click', () => {
  previousSlide()
  startCarousel()
})

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index)
    startCarousel()
  })
})

startCarousel()

// ========================================
// 9. CATEGORY BUTTONS
// ========================================

document.querySelectorAll('.market-category-card').forEach(card => {
  card.addEventListener('click', () => {
    const category = card.dataset.category

    localStorage.setItem('selectedCategory', category)

    // Demo behavior until category product pages are connected
    alert(`You selected: ${category}`)
  })
})

// ========================================
// 9B. PRODUCT BUTTONS (ADD TO CART / FAVORITES)
// ========================================

// readStorage is imported from smart-cart.js

function updateCartBadge() {
  const badge = document.querySelector('#cartBadge')
  if (!badge) return

  const count = readStorage('smCart').reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  )

  badge.textContent = count > 99 ? '99+' : String(count)
  badge.hidden = count === 0
}

updateCartBadge()

// ---- Cart helpers (used by product cards) ----

function addToCart({ id, name, price, image = '', quantity = 1 }) {
  const cart = readStorage('smCart')
  const existing = cart.find(item => item.id === id)

  if (existing) {
    existing.quantity += quantity
    if (!existing.image && image) existing.image = image
  } else {
    cart.push({ id, name, price, image, quantity })
  }

  localStorage.setItem('smCart', JSON.stringify(cart))
  updateCartBadge()
}

function flashAdded(button) {
  if (!button) return

  button.textContent = 'Added ✓'
  setTimeout(() => { button.textContent = 'Add to Cart' }, 1200)
}

function addProductById(id, button) {
  const product = allProducts.find(item => item.id === id)
  if (!product) return

  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  })

  flashAdded(button)
}

// ---- Favorites ----

const savedFavorites = readStorage('smFavorites')

document.querySelectorAll('.favorite-button').forEach(button => {
  const id = button.dataset.id

  if (savedFavorites.includes(id)) {
    button.classList.add('active')
  }

  button.addEventListener('click', () => {
    const favorites = readStorage('smFavorites')
    const exists = favorites.includes(id)

    const updated = exists
      ? favorites.filter(item => item !== id)
      : [...favorites, id]

    localStorage.setItem('smFavorites', JSON.stringify(updated))
    button.classList.toggle('active', !exists)
  })
})

// ---- Product quantity modal ----

const pdOverlay = document.querySelector('#pdOverlay')
const pdQtyInput = document.querySelector('#pdQty')
let pdProduct = null
let pdQty = 1
let pdLastFocus = null

function clampQty(value) {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(99, n)
}

function updateProductModal() {
  pdQtyInput.value = pdQty
  document.querySelector('#pdMinus').disabled = pdQty <= 1
  document.querySelector('#pdPlus').disabled = pdQty >= 99

  const subtotal = document.querySelector('#pdSubtotal')
  subtotal.textContent = formatPeso(pdProduct.price * pdQty)

  // small pop whenever the number changes
  subtotal.classList.remove('pop')
  void subtotal.offsetWidth
  subtotal.classList.add('pop')
}

function openProductModal(id, trigger) {
  const product = allProducts.find(item => item.id === id)
  if (!product) return

  pdProduct = product
  pdQty = 1
  pdLastFocus = trigger || null

  const img = document.querySelector('#pdImage')
  img.src = product.image || ''
  img.alt = product.name
  img.hidden = !product.image

  document.querySelector('#pdSize').textContent = product.size
  document.querySelector('#pdName').textContent = product.name
  document.querySelector('#pdPrice').textContent = formatPeso(product.price)

  const oldPrice = document.querySelector('#pdOldPrice')
  oldPrice.hidden = !product.oldPrice
  oldPrice.textContent = product.oldPrice ? formatPeso(product.oldPrice) : ''

  const perKg = document.querySelector('#pdPerKg')
  perKg.hidden = !product.perKg
  perKg.textContent = product.perKg ? `${formatPeso(product.perKg)}/KG` : ''

  updateProductModal()

  pdOverlay.hidden = false
  document.body.style.overflow = 'hidden'
  pdQtyInput.focus()
  pdQtyInput.select()
}

function closeProductModal() {
  pdOverlay.hidden = true
  document.body.style.overflow = ''
  pdLastFocus?.focus?.()
  pdLastFocus = null
}

// ---- Add-to-cart animations ----

function bumpCart() {
  const badge = document.querySelector('#cartBadge')
  const cartBtn = document.querySelector('#cartButton')

  ;[badge, cartBtn].forEach(el => {
    if (!el) return
    el.classList.remove('bump')
    void el.offsetWidth
    el.classList.add('bump')
  })
}

function flyToCart(fromRect, src) {
  const target = document.querySelector('#cartButton')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!target || !src || !fromRect || reduced) {
    bumpCart()
    return
  }

  const to = target.getBoundingClientRect()
  const fly = document.createElement('img')
  fly.src = src
  fly.className = 'fly-img'
  fly.style.left = fromRect.left + 'px'
  fly.style.top = fromRect.top + 'px'
  fly.style.width = fromRect.width + 'px'
  fly.style.height = fromRect.height + 'px'
  document.body.appendChild(fly)

  const dx = (to.left + to.width / 2) - (fromRect.left + fromRect.width / 2)
  const dy = (to.top + to.height / 2) - (fromRect.top + fromRect.height / 2)

  const animation = fly.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 60}px) scale(0.55)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.2 }
    ],
    { duration: 750, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' }
  )

  animation.onfinish = () => {
    fly.remove()
    bumpCart()
  }
}

let toastTimer

function showToast(message) {
  const toast = document.querySelector('#pdToast')
  toast.textContent = message
  toast.classList.add('show')

  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200)
}

function confirmAddToCart() {
  if (!pdProduct) return

  const product = pdProduct
  const quantity = pdQty
  const imgEl = document.querySelector('#pdImage')
  const rect = product.image ? imgEl.getBoundingClientRect() : null

  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity
  })

  closeProductModal()
  flyToCart(rect, product.image)
  showToast(`${quantity} × ${product.name} added to cart`)
}

// ---- Modal events ----

document.querySelector('#pdClose')?.addEventListener('click', closeProductModal)
document.querySelector('#pdConfirm')?.addEventListener('click', confirmAddToCart)

document.querySelector('#pdMinus')?.addEventListener('click', () => {
  pdQty = clampQty(pdQty - 1)
  updateProductModal()
})

document.querySelector('#pdPlus')?.addEventListener('click', () => {
  pdQty = clampQty(pdQty + 1)
  updateProductModal()
})

pdQtyInput?.addEventListener('input', () => {
  if (pdQtyInput.value === '') return
  pdQty = clampQty(pdQtyInput.value)
  updateProductModal()
})

pdQtyInput?.addEventListener('blur', () => {
  pdQty = clampQty(pdQtyInput.value)
  updateProductModal()
})

pdQtyInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter') confirmAddToCart()
})

pdOverlay?.addEventListener('click', event => {
  if (event.target === pdOverlay) closeProductModal()
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && pdOverlay && !pdOverlay.hidden) {
    closeProductModal()
  }
})

// ---- Add to Cart button + product image open the modal ----

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => openProductModal(button.dataset.id, button))
})

document.querySelectorAll('.product-image').forEach(box => {
  const openFromImage = () => {
    const card = box.closest('.product-card')
    openProductModal(card.dataset.product, box)
  }

  box.addEventListener('click', openFromImage)

  // keyboard support (Enter / Space)
  box.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFromImage()
    }
  })
})

// ---- Cards fade up when they scroll into view ----

const productCards = document.querySelectorAll('.product-card')

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return

      const card = entry.target
      card.classList.add('in')
      observer.unobserve(card)

      // remove the helper classes so the hover animation is not delayed
      setTimeout(() => card.classList.remove('reveal', 'in'), 900)
    })
  }, { threshold: 0.15 })

  productCards.forEach((card, index) => {
    card.style.setProperty('--i', index % 5)
    card.classList.add('reveal')
    revealObserver.observe(card)
  })
}

document.querySelectorAll('.see-more').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category

    localStorage.setItem('selectedCategory', category)
    alert(`${category} page will be available soon.`)
  })
})

// ========================================
// 10. BROWSE CATEGORIES
// ========================================

function scrollToCategories() {
  document.querySelector('#categories')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

document.querySelector('#viewCategories')?.addEventListener(
  'click',
  scrollToCategories
)

document.querySelector('#seeAllCategories')?.addEventListener(
  'click',
  scrollToCategories
)

document.querySelector('#browseCategories')?.addEventListener(
  'click',
  scrollToCategories
)

// ========================================
// 11. SEARCH FUNCTIONALITY
// ========================================

const marketSearch = document.querySelector('#marketSearch')

function performSearch() {
  const searchValue = marketSearch.value.trim()

  if (!searchValue) {
    marketSearch.focus()
    return
  }

  localStorage.setItem('marketSearchQuery', searchValue)

  alert(`Searching for: ${searchValue}`)
}

document.querySelector('#searchButton')?.addEventListener(
  'click',
  performSearch
)

marketSearch?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    performSearch()
  }
})

// ========================================
// 12. ACCOUNT BUTTON
// ========================================

document.querySelector('#accountButton')?.addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  window.location.href = isLoggedIn ? '/profile.html' : '/signin.html'
})

// ========================================
// 13. SMART-TO-CART MODAL
// ========================================
// All logic lives in smart-cart.js. This must run AFTER app.innerHTML is set.

const smartCart = initSmartCart({
  branchName,
  onCartChange: updateCartBadge
  // onShowCart: defaults to going to /cart.html
})

// ========================================
// 14. CART BUTTON
// ========================================

document.querySelector('#cartButton')?.addEventListener('click', () => {
  window.location.href = '/cart.html'
})

// ========================================
// 15. FAVORITES BUTTON
// ========================================

document.querySelector('#favoritesButton')?.addEventListener('click', () => {
  alert('Your favorites will be available soon.')
})

// ========================================
// 16. VIEW STORES
// ========================================

document.querySelector('#viewStores')?.addEventListener('click', () => {
  alert('Store directory will be available soon.')
})

// ========================================
// 17. NEWSLETTER SUBSCRIPTION
// ========================================

document.querySelector('#newsletterForm')?.addEventListener(
  'submit',
  event => {
    event.preventDefault()

    const email = document.querySelector('#newsletterEmail').value.trim()
    const message = document.querySelector('#newsletterMessage')

    if (!email) return

    message.textContent = 'Thank you for subscribing!'
    document.querySelector('#newsletterEmail').value = ''
  }
)

// ========================================
// 17B. OPEN FROM OTHER PAGES (e.g. cart page navbar)
// ========================================

if (window.location.hash === '#smart-to-cart') {
  smartCart.open()
  history.replaceState(null, '', window.location.pathname)
}

if (window.location.hash === '#categories') {
  scrollToCategories()
}

// ========================================
// 18. DEBUGGING
// ========================================

console.log('SM Markets homepage loaded successfully. [build v5: shared smart-cart module]')
console.log('Selected branch:', branchName)
console.log('Logo:', logoImage)
console.log('Hero images:', heroImages)
console.log('Categories:', categories)