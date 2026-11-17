import './style.css'
import './signin.css'

import {
  createIcons,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide'

// ========================================
// SIGN IN PAGE
// ========================================

document.querySelector('#app').innerHTML = `

  <!-- HEADER -->
  <header class="shop-header signin-header">
    <div class="header-inner">

      <a href="/" class="shopsm-logo">
        SHOPSM
      </a>

      <div class="header-actions">
        <button type="button" aria-label="My Account">
          <i data-lucide="user-round"></i>
        </button>
      </div>

    </div>
  </header>


  <!-- SIGN IN MAIN -->
  <main class="signin-main">

    <section class="signin-card">

      <div class="signin-heading">
        <h1>Welcome back!</h1>
        <p>Sign in to your SHOPSM account to continue.</p>
      </div>


      <!-- SIGN IN FORM -->
      <form id="signinForm" novalidate>

        <div class="signin-field">

          <label for="email">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your Email:"
            autocomplete="email"
            required
          />

        </div>


        <div class="signin-field">

          <div class="password-label-row">

            <label for="password">
              Password
            </label>

            <a href="#" id="forgotPassword">
              Forgot Password?
            </a>

          </div>


          <div class="password-input-wrap">

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password:"
              autocomplete="current-password"
              required
            />

            <button
              type="button"
              id="togglePassword"
              class="toggle-password"
              aria-label="Show password"
            >
              <i data-lucide="eye"></i>
            </button>

          </div>

        </div>


        <!-- REMEMBER ME -->
        <label class="remember-row">

          <input
            type="checkbox"
            id="rememberMe"
          />

          <span>
            Remember me on this device
          </span>

        </label>


        <!-- ERROR MESSAGE -->
        <p
          id="signinMessage"
          class="signin-message"
          aria-live="polite"
        ></p>


        <!-- SIGN IN BUTTON -->
        <button
          type="submit"
          class="signin-submit"
        >
          Sign in
          <i data-lucide="arrow-right"></i>
        </button>

      </form>


      <!-- DIVIDER -->
      <div class="signin-divider">

        <span></span>

        <p>or continue with</p>

        <span></span>

      </div>


      <!-- SOCIAL LOGIN -->
      <div class="social-signin">

        <button
          type="button"
          class="social-button google-button"
          aria-label="Continue with Google"
        >
          <span class="google-g">G</span>
        </button>


        <button
          type="button"
          class="social-button facebook-button"
          aria-label="Continue with Facebook"
        >
          <span class="facebook-f">f</span>
        </button>

      </div>


      <!-- CREATE ACCOUNT -->
      <p class="create-account">

        Don't have an Account?

        <a href="#" id="createAccount">
          Create account
        </a>

      </p>

    </section>

  </main>


  <!-- FOOTER -->
  <footer class="shop-footer signin-footer">

    <div class="footer-container">


      <!-- NEWSLETTER -->
      <section class="newsletter">

        <h3>
          Get awesome exclusives and more deals when you subscribe!
        </h3>

        <form id="newsletter-form">

          <input
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </section>


      <!-- FOOTER COLUMNS -->
      <div class="footer-columns">


        <div class="footer-column">

          <h4>Help &amp; Information</h4>

          <a href="#">Terms &amp; Conditions</a>
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
              Download on the<br />
              <strong>App Store</strong>
            </div>

            <div class="store-badge">
              GET IT ON<br />
              <strong>Google Play</strong>
            </div>

          </div>

          <button
            class="bir-button"
            type="button"
          >
            View BIR Seal
          </button>

        </div>

      </div>


      <!-- COPYRIGHT -->
      <div class="footer-bottom">

        <span>
          © 2026 ShopSM. All rights reserved.
        </span>

        <strong>
          SHOPSM
        </strong>

      </div>

    </div>

  </footer>

`


// ========================================
// INITIALIZE LUCIDE ICONS
// ========================================

function refreshIcons() {

  createIcons({
    icons: {
      UserRound,
      Eye,
      EyeOff,
      ArrowRight
    }
  })

}

refreshIcons()


// ========================================
// PASSWORD VISIBILITY
// ========================================

const passwordInput =
  document.querySelector('#password')

const togglePassword =
  document.querySelector('#togglePassword')


togglePassword.addEventListener('click', () => {

  const isPassword =
    passwordInput.type === 'password'

  passwordInput.type =
    isPassword ? 'text' : 'password'

  togglePassword.innerHTML = isPassword
    ? '<i data-lucide="eye-off"></i>'
    : '<i data-lucide="eye"></i>'

  togglePassword.setAttribute(
    'aria-label',
    isPassword ? 'Hide password' : 'Show password'
  )

  refreshIcons()

})


// ========================================
// FIND THE ACCOUNT CREATED IN SIGN UP
// ========================================

// Where signup.js might have saved the account.
// Add your own key here if you use a different one.
const ACCOUNT_LIST_KEYS = ['users', 'shopSMUsers', 'accounts', 'registeredUsers']
const ACCOUNT_SINGLE_KEYS = ['shopSMUser', 'registeredUser', 'user', 'account']

function readJSON(key) {

  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }

}

function findAccount(email) {

  const target = email.toLowerCase()
  const candidates = []

  ACCOUNT_LIST_KEYS.forEach(key => {

    const value = readJSON(key)

    if (Array.isArray(value)) {
      candidates.push(...value)
    }

  })

  ACCOUNT_SINGLE_KEYS.forEach(key => {

    const value = readJSON(key)

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      candidates.push(value)
    }

  })

  return candidates.find(account =>
    String(account?.email ?? '').toLowerCase() === target
  ) || null

}


// ========================================
// SIGN IN FORM
// ========================================

const signinForm =
  document.querySelector('#signinForm')

const signinMessage =
  document.querySelector('#signinMessage')


signinForm.addEventListener('submit', event => {

  event.preventDefault()

  const email =
    document.querySelector('#email').value.trim()

  const password =
    passwordInput.value

  const rememberMe =
    document.querySelector('#rememberMe').checked


  signinMessage.className = 'signin-message'
  signinMessage.textContent = ''


  // CHECK EMPTY FIELDS
  if (!email || !password) {

    signinMessage.textContent =
      'Please enter your email address and password.'

    signinMessage.classList.add('error')

    return

  }


  // CHECK EMAIL FORMAT
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

    signinMessage.textContent =
      'Please enter a valid email address.'

    signinMessage.classList.add('error')

    return

  }


  /*
    FRONTEND DEMO ONLY.

    This is not real account authentication.
    Connect this section to your backend API
    before accepting actual customer accounts.
  */

  const account = findAccount(email)

  // If the account saved a plain password, it must match
  if (account && account.password && account.password !== password) {

    signinMessage.textContent =
      'Incorrect email or password.'

    signinMessage.classList.add('error')

    return

  }


  // Save who is signed in (the profile page reads this)
  const { password: _password, ...safeAccount } = account || {}

  localStorage.setItem(
    'currentUser',
    JSON.stringify({ ...safeAccount, email })
  )

  localStorage.setItem(
    'isLoggedIn',
    'true'
  )

  localStorage.setItem(
    'shopSMUserEmail',
    email
  )

  localStorage.setItem(
    'loggedInEmail',
    email
  )


  if (rememberMe) {

    localStorage.setItem(
      'rememberShopSM',
      'true'
    )

  } else {

    localStorage.removeItem(
      'rememberShopSM'
    )

  }


  // Go back to where the user came from (e.g. cart checkout),
  // otherwise go to the shop. Only local paths are allowed.
  const savedRedirect =
    localStorage.getItem('redirectAfterLogin')

  const isSafeRedirect =
    savedRedirect &&
    savedRedirect.startsWith('/') &&
    !savedRedirect.startsWith('//')

  const nextPage =
    isSafeRedirect ? savedRedirect : '/market-home.html'


  localStorage.removeItem(
    'redirectAfterLogin'
  )


  window.location.href = nextPage

})


// ========================================
// FORGOT PASSWORD
// ========================================

document
  .querySelector('#forgotPassword')
  .addEventListener('click', event => {

    event.preventDefault()

    alert(
      'Forgot Password will be connected when the account recovery feature is ready.'
    )

  })


// ========================================
// CREATE ACCOUNT
// ========================================

document
  .querySelector('#createAccount')
  .addEventListener('click', event => {
    event.preventDefault()
    window.location.href = '/signup.html'
  })


// ========================================
// GOOGLE AND FACEBOOK BUTTONS
// ========================================

document
  .querySelectorAll('.social-button')
  .forEach(button => {

    button.addEventListener('click', () => {

      alert(
        'Social sign-in needs to be connected to an authentication provider.'
      )

    })

  })


// ========================================
// NEWSLETTER
// ========================================

document
  .querySelector('#newsletter-form')
  .addEventListener('submit', event => {

    event.preventDefault()

    alert(
      'Thank you for subscribing to ShopSM!'
    )

    event.target.reset()

  })


// ========================================
// END OF SIGN IN JS
// ========================================