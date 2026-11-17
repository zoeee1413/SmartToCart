
import './style.css'
import './signup.css'

import {
  createIcons,
  UserRound,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide'

// ========================================
// SIGN UP PAGE
// ========================================

document.querySelector('#app').innerHTML = `

  <!-- HEADER -->
  <header class="shop-header signup-header">
    <div class="header-inner">
      <a href="/" class="shopsm-logo">SHOPSM</a>

      <div class="header-actions">
        <button type="button" aria-label="My Account">
          <i data-lucide="user-round"></i>
        </button>
      </div>
    </div>
  </header>


  <!-- SIGN UP MAIN -->
  <main class="signup-main">

    <form id="signupForm" class="signup-form" novalidate>

      <div class="signup-columns">

        <!-- ACCOUNT INFORMATION -->
        <section class="signup-card">

          <h2>Create an Account</h2>

          <div class="signup-field">
            <label for="signupEmail">
              <span class="required">*</span> Email Address
            </label>

            <input
              type="email"
              id="signupEmail"
              name="email"
              placeholder="Enter your Email:"
              autocomplete="email"
              required
            />
          </div>


          <div class="signup-field">
            <label for="signupMobile">
              <span class="required">*</span>
              Mobile Number (valid PH number only)
            </label>

            <div class="mobile-input">
              <span>+63</span>

              <input
                type="tel"
                id="signupMobile"
                name="mobile"
                placeholder="9XX XXX XXXX"
                maxlength="10"
                inputmode="numeric"
                autocomplete="tel-national"
                required
              />
            </div>
          </div>


          <div class="signup-field">
            <label for="signupPassword">
              <span class="required">*</span> Password
            </label>

            <div class="signup-password-wrap">
              <input
                type="password"
                id="signupPassword"
                name="password"
                placeholder="Enter Password:"
                autocomplete="new-password"
                required
              />

              <button
                type="button"
                class="signup-toggle-password"
                data-target="signupPassword"
                aria-label="Show password"
              >
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>


          <div class="signup-field">
            <label for="confirmPassword">
              <span class="required">*</span> Confirm Password
            </label>

            <div class="signup-password-wrap">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password:"
                autocomplete="new-password"
                required
              />

              <button
                type="button"
                class="signup-toggle-password"
                data-target="confirmPassword"
                aria-label="Show password"
              >
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

        </section>


        <!-- PERSONAL INFORMATION -->
        <section class="signup-card">

          <h2>Personal Information</h2>

          <div class="signup-field">
            <label for="firstName">
              <span class="required">*</span> First Name
            </label>

            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter First Name:"
              autocomplete="given-name"
              required
            />
          </div>


          <div class="signup-field">
            <label for="lastName">
              <span class="required">*</span> Last Name
            </label>

            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter Last Name:"
              autocomplete="family-name"
              required
            />
          </div>


          <div class="signup-field">
            <label for="gender">
              <span class="required">*</span> Gender
            </label>

            <div class="signup-select-wrap">
              <select id="gender" name="gender" required>
                <option value="" disabled selected>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>

              <i data-lucide="chevron-right"></i>
            </div>
          </div>


          <div class="signup-field">
            <label for="birthdate">
              <span class="required">*</span> Birthdate
            </label>

            <input
              type="date"
              id="birthdate"
              name="birthdate"
              required
            />
          </div>

        </section>

      </div>


      <!-- AGREEMENTS -->
      <div class="signup-agreements">

        <label class="signup-check-row">
          <input
            type="checkbox"
            id="ageAgreement"
            required
          />

          <span>
            By entering and using this App, you affirm that you're
            18 years old and above and are the legal owner of the
            payment method entered in your profile.
          </span>
        </label>


        <label class="signup-check-row">
          <input
            type="checkbox"
            id="termsAgreement"
            required
          />

          <span>
            I have read and agree to the
            <a href="#" id="termsLink">Terms of Use</a>
            and
            <a href="#" id="privacyLink">Privacy Policy</a>
            of ShopSM.
          </span>
        </label>

      </div>


      <!-- MESSAGE -->
      <p
        id="signupMessage"
        class="signup-message"
        aria-live="polite"
      ></p>


      <!-- REGISTER BUTTON -->
      <button
        type="submit"
        class="signup-register-button"
      >
        Register
      </button>


      <p class="signup-login-link">
        Already have an account?
        <a href="/signin.html">Sign in</a>
      </p>

    </form>

  </main>


  <!-- FOOTER -->
  <footer class="shop-footer signup-footer">

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
          />

          <button type="submit">Subscribe</button>
        </form>
      </section>


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
            <div class="shopsm-app-icon">SM</div>

            <div class="store-badge">
              Download on the<br />
              <strong>App Store</strong>
            </div>

            <div class="store-badge">
              GET IT ON<br />
              <strong>Google Play</strong>
            </div>
          </div>

          <button class="bir-button" type="button">
            View BIR Seal
          </button>
        </div>

      </div>


      <div class="footer-bottom">
        <span>© 2026 ShopSM. All rights reserved.</span>
        <strong>SHOPSM</strong>
      </div>

    </div>

  </footer>

`

// ========================================
// ICONS
// ========================================

function refreshIcons() {
  createIcons({
    icons: {
      UserRound,
      Eye,
      EyeOff,
      ChevronRight
    }
  })
}

refreshIcons()


// ========================================
// PASSWORD VISIBILITY
// ========================================

document
  .querySelectorAll('.signup-toggle-password')
  .forEach(button => {

    button.addEventListener('click', () => {

      const targetId = button.dataset.target
      const input = document.getElementById(targetId)

      const isPassword = input.type === 'password'

      input.type = isPassword ? 'text' : 'password'

      button.innerHTML = isPassword
        ? '<i data-lucide="eye-off"></i>'
        : '<i data-lucide="eye"></i>'

      button.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
      )

      refreshIcons()

    })

  })


// ========================================
// MOBILE NUMBER INPUT
// ========================================

const mobileInput =
  document.querySelector('#signupMobile')

mobileInput.addEventListener('input', () => {

  mobileInput.value =
    mobileInput.value.replace(/\D/g, '').slice(0, 10)

})


// ========================================
// BIRTHDATE LIMIT
// ========================================

const birthdateInput =
  document.querySelector('#birthdate')

const today = new Date()

const maximumBirthdate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
)

const dateString = [
  maximumBirthdate.getFullYear(),
  String(maximumBirthdate.getMonth() + 1).padStart(2, '0'),
  String(maximumBirthdate.getDate()).padStart(2, '0')
].join('-')

birthdateInput.max = dateString


// ========================================
// SIGN UP FORM VALIDATION
// ========================================

const signupForm =
  document.querySelector('#signupForm')

const signupMessage =
  document.querySelector('#signupMessage')

signupForm.addEventListener('submit', event => {

  event.preventDefault()

  signupMessage.textContent = ''
  signupMessage.className = 'signup-message'


  const email =
    document.querySelector('#signupEmail').value.trim()

  const mobile =
    mobileInput.value.trim()

  const password =
    document.querySelector('#signupPassword').value

  const confirmPassword =
    document.querySelector('#confirmPassword').value

  const firstName =
    document.querySelector('#firstName').value.trim()

  const lastName =
    document.querySelector('#lastName').value.trim()

  const gender =
    document.querySelector('#gender').value

  const birthdate =
    birthdateInput.value

  const ageAgreement =
    document.querySelector('#ageAgreement').checked

  const termsAgreement =
    document.querySelector('#termsAgreement').checked


  function showError(message) {

    signupMessage.textContent = message
    signupMessage.classList.add('error')

    signupMessage.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })

  }


  // REQUIRED FIELDS
  if (
    !email ||
    !mobile ||
    !password ||
    !confirmPassword ||
    !firstName ||
    !lastName ||
    !gender ||
    !birthdate
  ) {

    showError('Please complete all required fields.')
    return

  }


  // EMAIL FORMAT
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

    showError('Please enter a valid email address.')
    return

  }


  // PH MOBILE NUMBER
  if (!/^9\d{9}$/.test(mobile)) {

    showError(
      'Please enter a valid Philippine mobile number starting with 9.'
    )

    return

  }


  // PASSWORD LENGTH
  if (password.length < 8) {

    showError(
      'Password must contain at least 8 characters.'
    )

    return

  }


  // PASSWORD MATCH
  if (password !== confirmPassword) {

    showError('Your passwords do not match.')
    return

  }


  // CHECK AGE
  const birthDateObject = new Date(
    `${birthdate}T00:00:00`
  )

  let age =
    today.getFullYear() - birthDateObject.getFullYear()

  const monthDifference =
    today.getMonth() - birthDateObject.getMonth()

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDateObject.getDate()
    )
  ) {
    age--
  }

  if (
    Number.isNaN(birthDateObject.getTime()) ||
    birthDateObject > today ||
    age < 18
  ) {

    showError(
      'You must be at least 18 years old to create an account.'
    )

    return

  }


  // AGREEMENTS
  if (!ageAgreement || !termsAgreement) {

    showError(
      'Please accept both required agreements before registering.'
    )

    return

  }


  /*
    FRONTEND DEMO ONLY.

    This stores sample registration information locally.
    Connect to a secure backend before using real accounts.
    Never store actual passwords in localStorage.
  */

  const demoAccount = {
    email,
    mobile: '+63' + mobile,
    firstName,
    lastName,
    gender,
    birthdate
  }

  localStorage.setItem(
    'shopSMRegisteredAccount',
    JSON.stringify(demoAccount)
  )


  signupMessage.className = 'signup-message success'

  signupMessage.textContent =
    'Registration details validated! Please sign in to continue.'


  setTimeout(() => {

    window.location.href = '/signin.html'

  }, 1200)

})


// ========================================
// TERMS AND PRIVACY PLACEHOLDERS
// ========================================

document
  .querySelector('#termsLink')
  .addEventListener('click', event => {

    event.preventDefault()

    alert('Terms of Use page will be connected soon.')

  })


document
  .querySelector('#privacyLink')
  .addEventListener('click', event => {

    event.preventDefault()

    alert('Privacy Policy page will be connected soon.')

  })


// ========================================
// NEWSLETTER
// ========================================

document
  .querySelector('#newsletter-form')
  .addEventListener('submit', event => {

    event.preventDefault()

    alert('Thank you for subscribing to ShopSM!')

    event.target.reset()

  })


// ========================================
// END OF SIGN UP JS
// ========================================
