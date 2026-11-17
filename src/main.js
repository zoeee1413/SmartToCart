import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import {
  createIcons,
  UserRound,
  Store,
  MapPin,
  Search,
  RefreshCw,
  Crosshair,
  X
} from 'lucide'

// ========================================
// 1. IMPORT HERO IMAGES
// ========================================

import hero1 from './assets/images/frontpic.avif'
import hero2 from './assets/images/frontpic2.avif'
import hero3 from './assets/images/frontpic3.avif'

// ========================================
// 2. IMPORT CATEGORY IMAGES
// ========================================

import smMarkets from './assets/images/SM Markets.avif'
import smStore from './assets/images/SM Store.avif'
import smFashion from './assets/images/SM Fashion.avif'
import smHome from './assets/images/SM Home.avif'
import aceHardware from './assets/images/ACE Hardware.avif'
import toyKingdom from './assets/images/Toy Kingdom.avif'
import babyCompany from './assets/images/Baby Company.avif'
import stationery from './assets/images/Stationary.avif'
import petExpress from './assets/images/Pet Express.avif'
import kultura from './assets/images/Kultura.avif'
import dyson from './assets/images/Dyson.avif'
import nutribullet from './assets/images/Nutribullet.avif'
import snacks from './assets/images/Snacks.avif'
import smBeauty from './assets/images/SM Beauty.avif'
import surplus from './assets/images/Surplus.avif'

// ========================================
// 3. CATEGORY DATA
// ========================================

const categories = [
  { name: 'SM Markets', image: smMarkets },
  { name: 'SM Store', image: smStore },
  { name: 'SM Fashion', image: smFashion },
  { name: 'SM Home', image: smHome },
  { name: 'ACE Hardware', image: aceHardware },
  { name: 'Toy Kingdom', image: toyKingdom },
  { name: 'Baby Company', image: babyCompany },
  { name: 'Stationery', image: stationery },
  { name: 'Pet Express', image: petExpress },
  { name: 'Kultura', image: kultura },
  { name: 'Dyson', image: dyson },
  { name: 'Nutribullet', image: nutribullet },
  { name: 'Snacks', image: snacks },
  { name: 'SM Beauty', image: smBeauty },
  { name: 'Surplus', image: surplus }
]

// ========================================
// 4. HERO CAROUSEL DATA
// ========================================

const heroImages = [
  hero1,
  hero2,
  hero3
]

const HERO_INTERVAL_MS = 5000

let currentHero = 0
let heroInterval = null

// ========================================
// 5. SM CITY STA. MESA BRANCH
// ========================================

const STA_MESA_BRANCH = {
  id: 'sm-city-sta-mesa',
  name: 'SM City Sta. Mesa',
  city: 'Quezon City',
  address: 'R. Magsaysay Blvd. cor. G. Araneta Ave., Brgy. Doña Imelda, Quezon City',
  lat: 14.604361,
  lng: 121.018829
}

// ========================================
// 6. RENDER HOMEPAGE
// ========================================

document.querySelector('#app').innerHTML = `

  <!-- HEADER -->
  <header class="shop-header">
    <div class="header-inner">

      <a href="#" class="shopsm-logo">
        SHOPSM
      </a>

      <div class="header-actions">
        <button aria-label="My Account" id="accountButton">
          <i data-lucide="user-round"></i>
        </button>
      </div>

    </div>
  </header>

  <!-- MAIN CONTENT -->
  <main class="homepage">

    <!-- HERO CAROUSEL -->
    <section class="hero-section">
      <div class="hero-banner" id="heroBanner">

        <div class="hero-track" id="heroTrack">
          ${[...heroImages, heroImages[0]].map((image, index) => `
            <img
              src="${image}"
              alt="ShopSM promotional banner ${(index % heroImages.length) + 1}"
              draggable="false"
              ${index === heroImages.length ? 'aria-hidden="true"' : ''}
            >
          `).join('')}
        </div>

        <div class="hero-dots">
          ${heroImages.map((_, index) => `
            <button
              class="hero-dot ${index === 0 ? 'active' : ''}"
              data-slide="${index}"
              aria-label="Go to slide ${index + 1}"
            ></button>
          `).join('')}
        </div>

      </div>
    </section>

    <!-- CATEGORY GRID -->
    <section class="category-section">
      <div class="category-grid">

        ${categories.map(category => `
          <button
            class="category-card"
            data-category="${category.name}"
            aria-label="${category.name}"
            style="background-image: url('${category.image}');"
          ></button>
        `).join('')}

      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="shop-footer">
    <div class="footer-container">

      <section class="newsletter">
        <h3>
          Get awesome exclusives and more deals when you subscribe!
        </h3>

        <form id="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
            required
          >

          <button type="submit">
            Subscribe
          </button>
        </form>
      </section>

      <div class="footer-columns">

        <div class="footer-column">
          <h4>Help & Information</h4>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
        </div>

        <div class="footer-column">
          <h4>About ShopSM</h4>
          <a href="#">My Account</a>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
        </div>

        <div class="footer-column app-download">
          <h4>Download our App</h4>

          <div class="app-badges">
            <div class="shopsm-app-icon">
              SM
            </div>

            <div class="store-badge">
              Download on the<br>
              <strong>App Store</strong>
            </div>

            <div class="store-badge">
              GET IT ON<br>
              <strong>Google Play</strong>
            </div>
          </div>

          <button class="bir-button">
            View BIR Seal
          </button>
        </div>

      </div>

      <div class="footer-bottom">
        <span>
          © 2026 ShopSM. All rights reservedDFSFSDF.
        </span>

        <strong>SHOPSM</strong>
      </div>

    </div>
  </footer>

  <!-- BRANCH SELECTION MODAL -->
  <div id="branchModal" class="branch-modal-overlay">

    <div class="branch-modal">

      <!-- MODAL HEADER -->
      <div class="branch-modal-header">

        <h2 id="branchModalTitle">
          Shop at SM Markets
        </h2>

        <button
          id="closeBranchModal"
          class="close-branch-modal"
          aria-label="Close"
        >
          <i data-lucide="x"></i>
        </button>

      </div>

      <!-- MODAL BODY -->
      <div class="branch-modal-content">

        <!-- SEARCH -->
        <div class="location-search-panel">

          <div class="location-search">

            <input
              type="text"
              id="branchSearch"
              placeholder="Search nearby branch or location..."
              autocomplete="off"
            >

            <button
              id="searchBranch"
              aria-label="Search location"
            >
              <i data-lucide="search"></i>
            </button>

          </div>

          <button
            id="useMyLocation"
            class="location-button"
            type="button"
          >
            Use my location
          </button>

        </div>

        <!-- SEARCH STATUS -->
        <p
          id="nearbyStatus"
          class="nearby-status"
          aria-live="polite"
        ></p>

        <!-- MAP -->
        <div id="mapSection" class="map-section" hidden>

          <div id="branchMap"></div>

          <!-- SELECTED BRANCH -->
          <div class="selected-branch">

            <div>
              <strong>SM City Sta. Mesa</strong>
              <p>
                R. Magsaysay Blvd. cor. G. Araneta Ave.,
                Quezon City
              </p>
            </div>

            <span id="locationStatus">
              Selected
            </span>

          </div>

        </div>

        <!-- PROCEED -->
        <button
          id="proceedBranch"
          class="proceed-branch"
          type="button"
          disabled
        >
          Proceed
        </button>

      </div>
    </div>
  </div>
`

// ========================================
// 7. INITIALIZE LUCIDE ICONS
// ========================================

function refreshIcons() {
  createIcons({
    icons: {
      UserRound,
      Store,
      MapPin,
      Search,
      RefreshCw,
      Crosshair,
      X
    }
  })
}

refreshIcons()

// ========================================
// 8. HERO CAROUSEL
// ========================================

const heroBanner = document.querySelector('#heroBanner')
const heroTrack = document.querySelector('#heroTrack')
const heroDots = document.querySelectorAll('.hero-dot')

function setHeroPosition(index, animate = true) {

  heroTrack.style.transition = animate
    ? 'transform 0.6s ease'
    : 'none'

  heroTrack.style.transform = `translateX(-${index * 100}%)`

}

function updateHeroDots() {

  const activeIndex = currentHero % heroImages.length

  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex)
  })

}

function changeHero(index) {

  currentHero = index

  setHeroPosition(currentHero)

  updateHeroDots()

}

function nextHero() {

  changeHero(currentHero + 1)

}

heroTrack.addEventListener('transitionend', event => {

  if (event.target !== heroTrack) return

  if (currentHero >= heroImages.length) {

    currentHero = 0

    setHeroPosition(0, false)

    updateHeroDots()

  }

})

function startHeroSlider() {

  clearInterval(heroInterval)

  heroInterval = setInterval(nextHero, HERO_INTERVAL_MS)

}

function stopHeroSlider() {

  clearInterval(heroInterval)

}

heroDots.forEach(dot => {

  dot.addEventListener('click', () => {

    changeHero(Number(dot.dataset.slide))

    startHeroSlider()

  })

})

heroBanner.addEventListener('mouseenter', stopHeroSlider)
heroBanner.addEventListener('mouseleave', startHeroSlider)

startHeroSlider()

// ========================================
// 9. MODAL ELEMENTS
// ========================================

const branchModal =
  document.querySelector('#branchModal')

const branchSearch =
  document.querySelector('#branchSearch')

const searchBranchButton =
  document.querySelector('#searchBranch')

const mapSection =
  document.querySelector('#mapSection')

const nearbyStatus =
  document.querySelector('#nearbyStatus')

const proceedBranch =
  document.querySelector('#proceedBranch')

let branchMap = null
let branchMarker = null
let branchIsSelected = false

// ========================================
// 10. OPEN MODAL
// ========================================

function openBranchModal(category) {

  document.querySelector('#branchModalTitle').textContent =
    `Shop at ${category}`

  branchModal.classList.add('show')

  document.body.style.overflow = 'hidden'

  branchSearch.value = ''

  mapSection.hidden = true

  nearbyStatus.textContent = ''

  proceedBranch.disabled = true

  branchIsSelected = false

  setTimeout(() => {
    branchSearch.focus()
  }, 100)

}

// ========================================
// 11. CLOSE MODAL
// ========================================

function closeBranchModal() {

  branchModal.classList.remove('show')

  document.body.style.overflow = ''

}

document
  .querySelector('#closeBranchModal')
  .addEventListener('click', closeBranchModal)

branchModal.addEventListener('click', event => {

  if (event.target === branchModal) {
    closeBranchModal()
  }

})

document.addEventListener('keydown', event => {

  if (
    event.key === 'Escape' &&
    branchModal.classList.contains('show')
  ) {
    closeBranchModal()
  }

})

// ========================================
// 12. CATEGORY CARD INTERACTION
// ========================================

document.querySelectorAll('.category-card')
  .forEach(card => {

    card.addEventListener('click', () => {

      const category = card.dataset.category

      openBranchModal(category)

    })

  })

// ========================================
// 13. INITIALIZE LEAFLET MAP
// ========================================

function initializeStaMesaMap() {

  if (!branchMap) {

    branchMap = L.map('branchMap', {
      scrollWheelZoom: true
    }).setView(
      [
        STA_MESA_BRANCH.lat,
        STA_MESA_BRANCH.lng
      ],
      16
    )

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    ).addTo(branchMap)

    branchMarker = L.marker([
      STA_MESA_BRANCH.lat,
      STA_MESA_BRANCH.lng
    ])
      .addTo(branchMap)
      .bindPopup(`
        <strong>${STA_MESA_BRANCH.name}</strong>
        <br>
        ${STA_MESA_BRANCH.address}
      `)

  } else {

    branchMap.setView(
      [
        STA_MESA_BRANCH.lat,
        STA_MESA_BRANCH.lng
      ],
      16
    )

  }

  setTimeout(() => {

    branchMap.invalidateSize()

    if (branchMarker) {
      branchMarker.openPopup()
    }

  }, 200)

}

// ========================================
// 14. SEARCH STA. MESA
// ========================================

function searchStaMesa() {

  const query =
    branchSearch.value.trim().toLowerCase()

  if (!query) {

    nearbyStatus.textContent =
      'Please enter a branch or location to search.'

    return

  }

  const matchesStaMesa =
    query.includes('sta mesa') ||
    query.includes('santa mesa') ||
    query.includes('sm city sta') ||
    query.includes('sm sta') ||
    query.includes('centerpoint') ||
    query.includes('sta. mesa')

  if (!matchesStaMesa) {

    mapSection.hidden = true

    proceedBranch.disabled = true

    branchIsSelected = false

    nearbyStatus.textContent =
      'This prototype currently supports SM City Sta. Mesa only. Try searching "Sta Mesa".'

    return

  }

  mapSection.hidden = false

  branchIsSelected = true

  proceedBranch.disabled = false

  nearbyStatus.textContent =
    'SM City Sta. Mesa found. This branch is selected.'

  initializeStaMesaMap()

}

// ========================================
// 15. SEARCH BUTTON
// ========================================

searchBranchButton.addEventListener(
  'click',
  searchStaMesa
)

branchSearch.addEventListener('keydown', event => {

  if (event.key === 'Enter') {
    searchStaMesa()
  }

})

// ========================================
// 16. USE MY LOCATION BUTTON
// ========================================

document
  .querySelector('#useMyLocation')
  .addEventListener('click', () => {

    branchSearch.value = 'SM City Sta. Mesa'

    searchStaMesa()

  })

// ========================================
// 17. PROCEED - LOGIN REQUIRED
// ========================================

proceedBranch.addEventListener('click', () => {

  if (!branchIsSelected) {

    nearbyStatus.textContent =
      'Please select a branch first.'

    return

  }

  const isLoggedIn =
    localStorage.getItem('isLoggedIn') === 'true'

  // Not signed in yet -> go to sign in first
  if (!isLoggedIn) {

    // After signing in, the user continues to the shop
    localStorage.setItem(
      'redirectAfterLogin',
      '/market-home.html'
    )

    localStorage.setItem(
      'selectedSMBranch',
      JSON.stringify(STA_MESA_BRANCH)
    )

    window.location.href = '/signin.html'

    return

  }

  // Already signed in -> continue to the shop
  localStorage.setItem(
    'selectedSMBranch',
    JSON.stringify(STA_MESA_BRANCH)
  )

  window.location.href = '/market-home.html'

})

// ========================================
// 18. ACCOUNT BUTTON
// ========================================

document
  .querySelector('#accountButton')
  .addEventListener('click', () => {

    const isLoggedIn =
      localStorage.getItem('isLoggedIn') === 'true'

    if (isLoggedIn) {
      window.location.href = '/profile.html'
    } else {
      window.location.href = '/signin.html'
    }

  })

// ========================================
// 19. NEWSLETTER
// ========================================

document
  .querySelector('#newsletter-form')
  .addEventListener('submit', event => {

    event.preventDefault()

    alert('Thank you for subscribing to ShopSM!')

    event.target.reset()

  })

// ========================================
// END OF MAIN.JS
// ========================================