import {
  createIcons,
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  ArrowRight,
  Check,
  Trash2
} from 'lucide'

// Icons used by the SMart-to-Cart modal (merge these into createIcons on any page that uses it)
export const smartCartIcons = {
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  ArrowRight,
  Check,
  Trash2
}

// ========================================
// IMAGE LOADER
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
    // optional images (e.g. recipes without a photo yet) stay silent
    if (!optional) console.error(`Image not found: ${filename}`)
    return ''
  }

  return image[1]
}

// ========================================
// RECIPE DATA
// ========================================

// Basket illustration for the SMart-to-Cart modal
// (save it as assets/images/smart-to-cart.png / .avif / .webp)
const smartCartImage = getImage('SM Bonus Grocery Basket')

// Most popular recipes (Step 2 of the modal)
// ----------------------------------------
// Ingredient catalog (one place for every pack size + price)
// Prices for items not yet in the store are estimates. Edit them freely.
// ----------------------------------------
const catalog = {
  // Meat & seafood
  chicken:      { id: 'sm-bonus-fresh-chilled-chicken', name: 'Chicken', product: 'SM Bonus Fresh Chilled Chicken | 800g-1000g', unit: 'g', packSize: 900, packPrice: 190 },
  porkLiempo:   { id: 'sm-bonus-liempo', name: 'Pork Liempo', product: 'SM Bonus Liempo | 400g-500g', unit: 'g', packSize: 450, packPrice: 175 },
  porkAdoboCut: { id: 'sm-bonus-adobo-cut', name: 'Pork (Adobo Cut)', product: 'SM Bonus Pork Adobo Cut | 400g-500g', unit: 'g', packSize: 450, packPrice: 105 },
  groundPork:   { id: 'ground-pork-250g', name: 'Ground Pork', product: 'Ground Pork | 250g', unit: 'g', packSize: 250, packPrice: 95 },
  beefChuck:    { id: 'beef-chuck-500g', name: 'Beef', product: 'Beef Chuck Cubes | 500g', unit: 'g', packSize: 500, packPrice: 290 },
  beefShank:    { id: 'beef-shank-500g', name: 'Beef Shank', product: 'Beef Shank | 500g', unit: 'g', packSize: 500, packPrice: 280 },
  bangus:       { id: 'bangus-500g', name: 'Milkfish (Bangus)', product: 'Milkfish (Bangus) | 500g', unit: 'g', packSize: 500, packPrice: 190 },
  tilapia:      { id: 'tilapia-500g', name: 'Tilapia', product: 'Tilapia | 500g', unit: 'g', packSize: 500, packPrice: 110 },
  eggs:         { id: 'eggs-6pcs', name: 'Eggs', product: 'Eggs | 6 pcs', unit: 'pcs', packSize: 6, packPrice: 65 },

  // Vegetables
  garlic:       { id: 'garlic-100g', name: 'Garlic', product: 'Garlic | 100g', unit: 'g', packSize: 100, packPrice: 22 },
  onion:        { id: 'red-onion-250g', name: 'Red Onion', product: 'Red Onion | 250g', unit: 'g', packSize: 250, packPrice: 38 },
  ginger:       { id: 'ginger-100g', name: 'Ginger', product: 'Ginger | 100g', unit: 'g', packSize: 100, packPrice: 20 },
  tomato:       { id: 'tomato-250g', name: 'Tomato', product: 'Tomatoes | 250g', unit: 'g', packSize: 250, packPrice: 28 },
  potato:       { id: 'potato-500g', name: 'Potato', product: 'Potatoes | 500g', unit: 'g', packSize: 500, packPrice: 60 },
  carrot:       { id: 'carrot-250g', name: 'Carrot', product: 'Carrots | 250g', unit: 'g', packSize: 250, packPrice: 30 },
  bellPepper:   { id: 'bell-pepper-150g', name: 'Red Bell Pepper', product: 'Red Bell Pepper | 150g', unit: 'g', packSize: 150, packPrice: 45 },
  kangkong:     { id: 'kangkong-250g', name: 'Kangkong', product: 'Kangkong | 250g', unit: 'g', packSize: 250, packPrice: 25 },
  labanos:      { id: 'labanos-250g', name: 'Radish (Labanos)', product: 'Radish | 250g', unit: 'g', packSize: 250, packPrice: 25 },
  greenPapaya:  { id: 'green-papaya-500g', name: 'Green Papaya', product: 'Green Papaya | 500g', unit: 'g', packSize: 500, packPrice: 40 },
  siliLeaves:   { id: 'sili-leaves-100g', name: 'Chili Leaves', product: 'Chili Leaves (Dahon ng Sili) | 100g', unit: 'g', packSize: 100, packPrice: 15 },
  eggplant:     { id: 'eggplant-250g', name: 'Eggplant', product: 'Eggplant | 250g', unit: 'g', packSize: 250, packPrice: 30 },
  squash:       { id: 'squash-500g', name: 'Squash (Kalabasa)', product: 'Squash | 500g', unit: 'g', packSize: 500, packPrice: 35 },
  stringBeans:  { id: 'string-beans-250g', name: 'String Beans (Sitaw)', product: 'String Beans | 250g', unit: 'g', packSize: 250, packPrice: 30 },
  okra:         { id: 'okra-250g', name: 'Okra', product: 'Okra | 250g', unit: 'g', packSize: 250, packPrice: 35 },
  ampalaya:     { id: 'ampalaya-250g', name: 'Bitter Gourd (Ampalaya)', product: 'Bitter Gourd | 250g', unit: 'g', packSize: 250, packPrice: 35 },
  pechay:       { id: 'pechay-250g', name: 'Pechay', product: 'Pechay | 250g', unit: 'g', packSize: 250, packPrice: 30 },
  cabbage:      { id: 'cabbage-500g', name: 'Cabbage', product: 'Cabbage | 500g', unit: 'g', packSize: 500, packPrice: 45 },
  corn:         { id: 'sweet-corn-2pcs', name: 'Sweet Corn', product: 'Sweet Corn | 2 pcs', unit: 'pcs', packSize: 2, packPrice: 35 },
  siliHaba:     { id: 'sili-haba-100g', name: 'Green Chili (Siling Haba)', product: 'Green Chili | 100g', unit: 'g', packSize: 100, packPrice: 20 },
  siliLabuyo:   { id: 'sili-labuyo-50g', name: 'Bird\'s Eye Chili (Labuyo)', product: 'Siling Labuyo | 50g', unit: 'g', packSize: 50, packPrice: 25 },
  malunggay:    { id: 'malunggay-100g', name: 'Malunggay Leaves', product: 'Malunggay Leaves | 100g', unit: 'g', packSize: 100, packPrice: 15 },
  driedTaro:    { id: 'dried-taro-leaves-50g', name: 'Dried Taro Leaves (Gabi)', product: 'Dried Taro Leaves | 50g', unit: 'g', packSize: 50, packPrice: 30 },
  monggo:       { id: 'mung-beans-250g', name: 'Mung Beans (Monggo)', product: 'Mung Beans | 250g', unit: 'g', packSize: 250, packPrice: 45 },
  calamansi:    { id: 'calamansi-100g', name: 'Calamansi', product: 'Calamansi | 100g', unit: 'g', packSize: 100, packPrice: 20 },

  // Pantry
  suka:         { id: 'silver-swan-suka-puti', name: 'Vinegar', product: 'Silver Swan Suka Puti Doy Pack | 200ml', unit: 'ml', packSize: 200, packPrice: 8 },
  soy:          { id: 'datu-puti-soy-sauce', name: 'Soy Sauce', product: 'Datu Puti Soy Sauce | 200ml', unit: 'ml', packSize: 200, packPrice: 14 },
  patis:        { id: 'datu-puti-patis', name: 'Fish Sauce', product: 'Datu Puti Patis | 1L', unit: 'ml', packSize: 1000, packPrice: 82 },
  beefCubes:    { id: 'knorr-beef-cubes', name: 'Beef Cubes', product: 'Knorr Beef Cubes Pantry | 60g', unit: 'g', packSize: 60, packPrice: 35.75 },
  sinigangMix:  { id: 'sinigang-mix', name: 'Sinigang Mix', product: 'Sinigang sa Sampalok Mix | 44g', unit: 'g', packSize: 44, packPrice: 21 },
  tomatoSauce:  { id: 'tomato-sauce-200g', name: 'Tomato Sauce', product: 'Tomato Sauce | 200g', unit: 'g', packSize: 200, packPrice: 22 },
  liverSpread:  { id: 'liver-spread-85g', name: 'Liver Spread', product: 'Liver Spread | 85g', unit: 'g', packSize: 85, packPrice: 28 },
  peanutButter: { id: 'peanut-butter-200g', name: 'Peanut Butter', product: 'Peanut Butter | 200g', unit: 'g', packSize: 200, packPrice: 85 },
  kareMix:      { id: 'kare-kare-mix-50g', name: 'Kare-Kare Mix', product: 'Kare-Kare Mix | 50g', unit: 'g', packSize: 50, packPrice: 25 },
  bagoong:      { id: 'bagoong-230g', name: 'Shrimp Paste (Bagoong)', product: 'Bagoong Alamang | 230g', unit: 'g', packSize: 230, packPrice: 70 },
  coconutMilk:  { id: 'coconut-milk-400ml', name: 'Coconut Milk (Gata)', product: 'Coconut Milk | 400ml', unit: 'ml', packSize: 400, packPrice: 55 },
  cookingOil:   { id: 'cooking-oil-1l', name: 'Cooking Oil', product: 'Cooking Oil | 1L', unit: 'ml', packSize: 1000, packPrice: 120 },
  sugar:        { id: 'white-sugar-1kg', name: 'White Sugar', product: 'White Sugar | 1kg', unit: 'g', packSize: 1000, packPrice: 80 },
  cornstarch:   { id: 'cornstarch-200g', name: 'Cornstarch', product: 'Cornstarch | 200g', unit: 'g', packSize: 200, packPrice: 35 },
  salt:         { id: 'salt-500g', name: 'Salt', product: 'Iodized Salt | 500g', unit: 'g', packSize: 500, packPrice: 20 },
  peppercorn:   { id: 'whole-peppercorn', name: 'Whole Peppercorn', product: 'Whole Peppercorn | 10g', unit: 'g', packSize: 10, packPrice: 15 },
  bayLeaves:    { id: 'bay-leaves-10g', name: 'Bay Leaves (Laurel)', product: 'Bay Leaves | 10g', unit: 'g', packSize: 10, packPrice: 18 }
}

// ing('garlic', 5) = garlic, 5 g needed per serving
function ing(key, perServing) {
  if (!catalog[key]) console.error(`Unknown ingredient: ${key}`)
  return { ...catalog[key], perServing }
}

// ----------------------------------------
// Recipes (all searchable). popular: true = shown by default.
// ----------------------------------------
const recipes = [
  { id: 'chicken-adobo', name: 'Chicken Adobo', main: 'Chicken', popular: true, image: getImage('Adobo'),
    ingredients: [ing('chicken', 200), ing('suka', 20), ing('soy', 15), ing('garlic', 5), ing('peppercorn', 0.5), ing('bayLeaves', 0.3)] },

  { id: 'pork-adobo', name: 'Pork Adobo', main: 'Pork', image: getImage('Pork Adobo', true),
    ingredients: [ing('porkAdoboCut', 150), ing('suka', 20), ing('soy', 15), ing('garlic', 5), ing('peppercorn', 0.5), ing('bayLeaves', 0.3)] },

  { id: 'pork-sinigang', name: 'Pork Sinigang', main: 'Pork', popular: true, image: getImage('Pork Sinigang'),
    ingredients: [ing('porkLiempo', 150), ing('sinigangMix', 11), ing('kangkong', 40), ing('tomato', 30), ing('labanos', 40), ing('patis', 10)] },

  { id: 'beef-sinigang', name: 'Beef Sinigang', main: 'Beef', image: getImage('Beef Sinigang', true),
    ingredients: [ing('beefShank', 180), ing('sinigangMix', 11), ing('kangkong', 40), ing('labanos', 40), ing('tomato', 30), ing('stringBeans', 30), ing('patis', 10)] },

  { id: 'beef-caldereta', name: 'Beef Caldereta', main: 'Beef', popular: true, image: getImage('Beef Caldereta'),
    ingredients: [ing('beefChuck', 150), ing('tomatoSauce', 30), ing('potato', 60), ing('carrot', 40), ing('bellPepper', 25), ing('beefCubes', 3)] },

  { id: 'chicken-tinola', name: 'Chicken Tinola', main: 'Chicken', image: getImage('Chicken Tinola', true),
    ingredients: [ing('chicken', 200), ing('ginger', 10), ing('greenPapaya', 80), ing('siliLeaves', 20), ing('patis', 10)] },

  { id: 'kare-kare', name: 'Kare-Kare', main: 'Beef', image: getImage('Kare-Kare', true),
    ingredients: [ing('beefChuck', 150), ing('peanutButter', 25), ing('eggplant', 50), ing('stringBeans', 40), ing('pechay', 40), ing('kareMix', 10), ing('bagoong', 15)] },

  { id: 'bicol-express', name: 'Bicol Express', main: 'Pork', image: getImage('Bicol Express', true),
    ingredients: [ing('porkLiempo', 150), ing('coconutMilk', 100), ing('siliHaba', 20), ing('siliLabuyo', 5), ing('bagoong', 10), ing('garlic', 5), ing('onion', 20)] },

  { id: 'pork-menudo', name: 'Pork Menudo', main: 'Pork', image: getImage('Pork Menudo', true),
    ingredients: [ing('porkAdoboCut', 120), ing('liverSpread', 17), ing('potato', 60), ing('carrot', 40), ing('bellPepper', 25), ing('tomatoSauce', 30), ing('soy', 10)] },

  { id: 'chicken-afritada', name: 'Chicken Afritada', main: 'Chicken', image: getImage('Chicken Afritada', true),
    ingredients: [ing('chicken', 200), ing('potato', 60), ing('carrot', 40), ing('bellPepper', 25), ing('tomatoSauce', 40), ing('garlic', 5), ing('onion', 20)] },

  { id: 'pork-giniling', name: 'Pork Giniling', main: 'Ground Pork', image: getImage('Pork Giniling', true),
    ingredients: [ing('groundPork', 120), ing('potato', 50), ing('carrot', 40), ing('tomatoSauce', 30), ing('onion', 20), ing('garlic', 5), ing('soy', 10)] },

  { id: 'pork-sisig', name: 'Pork Sisig', main: 'Pork', image: getImage('Pork Sisig', true),
    ingredients: [ing('porkLiempo', 150), ing('onion', 30), ing('siliHaba', 10), ing('calamansi', 15), ing('soy', 10), ing('peppercorn', 0.5), ing('eggs', 0.5)] },

  { id: 'nilagang-baka', name: 'Nilagang Baka', main: 'Beef', image: getImage('Nilagang Baka', true),
    ingredients: [ing('beefShank', 200), ing('potato', 60), ing('corn', 0.4), ing('pechay', 40), ing('onion', 20), ing('peppercorn', 0.5), ing('patis', 10)] },

  { id: 'bulalo', name: 'Bulalo', main: 'Beef Shank', image: getImage('Bulalo', true),
    ingredients: [ing('beefShank', 250), ing('corn', 0.4), ing('pechay', 40), ing('cabbage', 50), ing('onion', 20), ing('peppercorn', 0.5), ing('patis', 10)] },

  { id: 'laing', name: 'Laing', main: 'Taro Leaves', image: getImage('Laing', true),
    ingredients: [ing('driedTaro', 15), ing('coconutMilk', 80), ing('porkLiempo', 50), ing('siliHaba', 10), ing('ginger', 5), ing('garlic', 5), ing('onion', 15), ing('bagoong', 10)] },

  { id: 'ginisang-monggo', name: 'Ginisang Monggo', main: 'Mung Beans', image: getImage('Ginisang Monggo', true),
    ingredients: [ing('monggo', 40), ing('porkLiempo', 40), ing('malunggay', 20), ing('garlic', 5), ing('onion', 15), ing('tomato', 30), ing('patis', 10)] },

  { id: 'paksiw-na-bangus', name: 'Paksiw na Bangus', main: 'Milkfish', image: getImage('Paksiw na Bangus', true),
    ingredients: [ing('bangus', 200), ing('suka', 40), ing('ginger', 10), ing('garlic', 5), ing('onion', 20), ing('siliHaba', 10), ing('peppercorn', 0.5)] },

  { id: 'sweet-and-sour-fish', name: 'Sweet and Sour Fish', main: 'Fish', image: getImage('Sweet and Sour Fish', true),
    ingredients: [ing('tilapia', 200), ing('bellPepper', 25), ing('carrot', 30), ing('onion', 20), ing('tomatoSauce', 30), ing('sugar', 10), ing('suka', 20), ing('cornstarch', 10)] },

  { id: 'pinakbet', name: 'Pinakbet', main: 'Mixed Vegetables', image: getImage('Pinakbet', true),
    ingredients: [ing('squash', 50), ing('stringBeans', 40), ing('okra', 30), ing('eggplant', 40), ing('ampalaya', 30), ing('tomato', 30), ing('bagoong', 15), ing('porkLiempo', 50), ing('garlic', 5), ing('onion', 15)] },

  { id: 'tortang-talong', name: 'Tortang Talong', main: 'Eggplant', image: getImage('Tortang Talong', true),
    ingredients: [ing('eggplant', 150), ing('eggs', 1), ing('cookingOil', 15), ing('salt', 1)] }
]

// ========================================
// HELPERS
// ========================================

function formatPeso(value) {
  return '₱' + value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

// ========================================
// MODAL MARKUP (put this inside the page)
// ========================================

export function smartCartMarkup() {
  return `
  <!-- SMART-TO-CART MODAL -->
  <div class="stc-overlay" id="stcOverlay" hidden>
    <div class="stc-modal" role="dialog" aria-modal="true" aria-labelledby="stcTitle">

      <div class="stc-header">
        <h2 id="stcTitle">SMart-to cart</h2>
        <button class="stc-close" id="stcClose" aria-label="Close">
          <i data-lucide="x"></i>
        </button>
      </div>

      <div class="stc-body">

        <!-- STEPPER -->
        <div class="stc-stepper" id="stcStepper">
          <div class="stc-step active" data-step="1">
            <span class="stc-circle"><span class="stc-num">1</span><i data-lucide="check" class="stc-check"></i></span>
            <span class="stc-label">Overview</span>
          </div>

          <div class="stc-line"><span></span></div>

          <div class="stc-step" data-step="2">
            <span class="stc-circle"><span class="stc-num">2</span><i data-lucide="check" class="stc-check"></i></span>
            <span class="stc-label">Find Recipe</span>
          </div>

          <div class="stc-line"><span></span></div>

          <div class="stc-step" data-step="3">
            <span class="stc-circle"><span class="stc-num">3</span><i data-lucide="check" class="stc-check"></i></span>
            <span class="stc-label">Grocery List</span>
          </div>
        </div>

        <!-- STEP 1: OVERVIEW -->
        <div class="stc-panel active" data-panel="1">

          <h3 class="stc-title">Plan your meal and fill your cart in minutes.</h3>

          ${smartCartImage ? `
            <img class="stc-hero" src="${smartCartImage}" alt="SM basket of groceries" />
          ` : ''}

          <div class="stc-features">

            <div class="stc-feature">
              <span class="stc-feature-icon"><i data-lucide="search"></i></span>
              <h4>Choose a Recipe</h4>
              <p>Search the dishes you want to cook.</p>
            </div>

            <i data-lucide="chevron-right" class="stc-arrow"></i>

            <div class="stc-feature">
              <span class="stc-feature-icon"><i data-lucide="users"></i></span>
              <h4>Set serving and budget</h4>
              <p>Exact portions help reduce food waste.</p>
            </div>

            <i data-lucide="chevron-right" class="stc-arrow"></i>

            <div class="stc-feature">
              <span class="stc-feature-icon"><i data-lucide="shopping-cart"></i></span>
              <h4>Add to cart</h4>
              <p>Add the complete ingredients list to your ShopSM cart.</p>
            </div>

          </div>

          <p class="stc-note">
            SMart-to-Cart automatically calculates ingredient quantities, matches them to
            available products in your selected branch, and helps reduce food waste.
          </p>

          <button class="stc-primary" id="stcNext">
            Get Started <i data-lucide="arrow-right"></i>
          </button>

        </div>

        <!-- STEP 2: FIND RECIPE -->
        <div class="stc-panel" data-panel="2">

          <button class="stc-back" data-go="1" aria-label="Back">
            <i data-lucide="chevron-left"></i>
          </button>

          <h3 class="stc-title">Find a Recipe</h3>
          <p class="stc-subtitle">
            Search for a dish, then set the number of servings and your budget.
          </p>

          <label class="stc-search">
            <i data-lucide="search"></i>
            <input
              type="text"
              id="stcRecipeSearch"
              placeholder="Search for a Recipe (e.g., Adobo, Sinigang, Caldereta)"
              autocomplete="off"
            />
          </label>

          <p class="stc-popular" id="stcPopularLabel">Most Popular this week:</p>

          <div class="stc-recipes" id="stcRecipes">
            ${recipes.map(recipe => `
              <button
                type="button"
                class="stc-recipe"
                data-recipe="${recipe.id}"
                data-name="${(recipe.name + ' ' + recipe.main).toLowerCase()}"
                data-popular="${recipe.popular ? 'true' : 'false'}"
                ${recipe.popular ? '' : 'hidden'}
              >
                <h4>${recipe.name}</h4>
                <span class="stc-recipe-main">${recipe.main}</span>
                ${recipe.image
                  ? `<img src="${recipe.image}" alt="${recipe.name}" />`
                  : `<div class="stc-recipe-initial">${recipe.name.charAt(0)}</div>`}
              </button>
            `).join('')}
          </div>

          <p class="stc-empty" id="stcEmpty" hidden></p>

          <div class="stc-fields">

            <label class="stc-field">
              <span class="stc-field-badge">₱</span>
              <span class="stc-field-label">Target Budget:</span>
              <input type="number" id="stcBudget" value="500" min="1" />
            </label>

            <label class="stc-field">
              <span class="stc-field-icon"><i data-lucide="users"></i></span>
              <span class="stc-field-label">Number of Servings:</span>
              <input type="number" id="stcServings" value="5" min="1" max="50" />
            </label>

          </div>

          <p class="stc-error" id="stcError"></p>

          <p class="stc-note">
            SMart-to-Cart automatically calculates ingredient quantities, matches them to
            available products in your selected branch, and helps reduce food waste.
          </p>

          <button class="stc-primary" id="stcGenerate">
            Generate Grocery List <i data-lucide="arrow-right"></i>
          </button>

        </div>

        <!-- STEP 3: GROCERY LIST -->
        <div class="stc-panel" data-panel="3">

          <button class="stc-back" data-go="2" aria-label="Back">
            <i data-lucide="chevron-left"></i>
          </button>

          <h3 class="stc-title">Your Grocery List</h3>

          <div class="stc-stats" id="stcSummary"></div>

          <div class="stc-list-head">
            <p>Ingredients</p>
            <span id="stcCount"></span>
          </div>

          <div class="stc-list" id="stcList"></div>

          <div class="stc-totals" id="stcTotals"></div>

          <!-- BUDGET SUGGESTIONS (shown only when over budget) -->
          <div id="stcSuggestions"></div>

          <p class="stc-fineprint">
            Prices are estimates and may vary per branch.
          </p>

          <button class="stc-primary" id="stcAddAll">
            Add All to Cart <i data-lucide="shopping-cart"></i>
          </button>

          <button class="stc-secondary" data-go="1">Start Over</button>

        </div>
      </div>
    </div>

    <!-- ADDED TO CART SUCCESS -->
    <div class="stc-confirm" id="stcSuccess" hidden>
      <div class="stc-confirm-box stc-success-box" role="alertdialog" aria-modal="true" aria-labelledby="stcSuccessTitle">
        <span class="stc-success-icon"><i data-lucide="check"></i></span>
        <h4 id="stcSuccessTitle">Added to cart successfully!</h4>
        <p id="stcSuccessText"></p>
        <div class="stc-success-actions">
          <button type="button" class="stc-success-primary" id="stcShowCart">
            Show Cart <i data-lucide="shopping-cart"></i>
          </button>
          <button type="button" class="stc-success-secondary" id="stcSuccessClose">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>

    <!-- REMOVE CONFIRMATION -->
    <div class="stc-confirm" id="stcConfirm" hidden>
      <div class="stc-confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="stcConfirmTitle">
        <h4 id="stcConfirmTitle">Remove this item?</h4>
        <p>
          Are you sure you want to remove
          <strong id="stcConfirmName"></strong> from your grocery list?
        </p>
        <div class="stc-confirm-actions">
          <button type="button" class="stc-confirm-cancel" id="stcConfirmCancel">Cancel</button>
          <button type="button" class="stc-confirm-ok" id="stcConfirmOk">Yes, remove</button>
        </div>
      </div>
    </div>

  </div>

`
}

// ========================================
// MODAL LOGIC
// ========================================

/**
 * Wires up the SMart-to-Cart modal.
 * Call smartCartMarkup() first so the modal exists in the page.
 *
 * @param branchName    selected branch (saved in the plan)
 * @param onCartChange  called after items are added to the cart
 * @param onShowCart    called when the user taps "Show Cart" in the success popup
 */
export function initSmartCart({
  branchName,
  onCartChange = () => {},
  onShowCart = () => { window.location.href = '/cart.html' }
} = {}) {

// ========================================
// 13. SMART-TO-CART MODAL
// ========================================

const stcOverlay = document.querySelector('#stcOverlay')
const stcSteps = document.querySelectorAll('.stc-step')
const stcLines = document.querySelectorAll('.stc-line')
const stcPanels = document.querySelectorAll('.stc-panel')

function goToStep(step) {
  stcSteps.forEach(el => {
    const n = Number(el.dataset.step)
    el.classList.toggle('active', n === step)
    el.classList.toggle('done', n < step)
  })

  // Fill the line leading to each completed / current step
  stcLines.forEach((line, i) => {
    line.classList.toggle('filled', i + 1 < step)
    line.classList.toggle('half', i + 1 === step)
  })

  stcPanels.forEach(panel => {
    panel.classList.toggle('active', Number(panel.dataset.panel) === step)
  })
}

function openSmartCart() {
  goToStep(1)
  stcOverlay.hidden = false
  document.body.style.overflow = 'hidden'
}

function closeSmartCart() {
  stcSuccess.hidden = true
  stcConfirm.hidden = true
  stcOverlay.hidden = true
  document.body.style.overflow = ''
}

document.querySelector('#smartCartButton')?.addEventListener('click', openSmartCart)
document.querySelector('#stcClose')?.addEventListener('click', closeSmartCart)
document.querySelector('#stcNext')?.addEventListener('click', () => goToStep(2))

document.querySelectorAll('[data-go]').forEach(btn => {
  btn.addEventListener('click', () => goToStep(Number(btn.dataset.go)))
})

// ---- Step 3: grocery list ----
let stcCurrentItems = []

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ---- Remove confirmation ----
const stcConfirm = document.querySelector('#stcConfirm')
const stcSuccess = document.querySelector('#stcSuccess')
let stcPendingRemoveId = null

function askRemove(item) {
  stcPendingRemoveId = item.id
  document.querySelector('#stcConfirmName').textContent = item.name
  stcConfirm.hidden = false
}

function closeConfirm() {
  stcConfirm.hidden = true
  stcPendingRemoveId = null
}

document.querySelector('#stcConfirmCancel')?.addEventListener('click', closeConfirm)

document.querySelector('#stcConfirmOk')?.addEventListener('click', () => {
  stcCurrentItems = stcCurrentItems.filter(entry => entry.id !== stcPendingRemoveId)
  closeConfirm()
  refreshGroceryList()
})

stcConfirm?.addEventListener('click', event => {
  if (event.target === stcConfirm) closeConfirm()
})

function formatAmount(amount, unit) {
  if (unit === 'pcs') return `${Math.ceil(amount)} pcs`
  if (unit === 'g' && amount >= 1000) return `${+(amount / 1000).toFixed(2)} kg`
  if (unit === 'ml' && amount >= 1000) return `${+(amount / 1000).toFixed(2)} L`
  return `${+amount.toFixed(1)} ${unit}`
}

// ---- Budget helpers ----
let stcBudget = 0
let stcServingsUsed = 0

// Total cost of a recipe for N servings (pack-based pricing)
function computeRecipeCost(recipe, servings) {
  return recipe.ingredients.reduce((sum, item) => {
    const needed = item.perServing * servings
    const packs = Math.max(1, Math.ceil(needed / item.packSize))
    return sum + packs * item.packPrice
  }, 0)
}

// Highest servings that still fit the budget (null if even 1 serving is too much).
// Pack-based pricing is not strictly increasing, so every value is checked.
function maxServingsWithinBudget(recipe, budget, limit = 50) {
  let best = null
  for (let s = 1; s <= limit; s++) {
    if (computeRecipeCost(recipe, s) <= budget) best = s
  }
  return best
}

// Other recipes that fit the budget for the same servings (cheapest first)
function cheaperRecipes(budget, servings, excludeId) {
  return recipes
    .filter(r => r.id !== excludeId)
    .map(r => ({ recipe: r, cost: computeRecipeCost(r, servings) }))
    .filter(x => x.cost <= budget)
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 3)
}

// Cheapest recipe overall for N servings (includes the current recipe)
function cheapestRecipe(servings) {
  return recipes
    .map(r => ({ recipe: r, cost: computeRecipeCost(r, servings) }))
    .sort((a, b) => a.cost - b.cost)[0] || null
}

function renderGroceryList({ recipe, servings, budget }) {
  stcBudget = budget
  stcServingsUsed = servings
  stcState.recipe = recipe

  // Keep the Step 2 selection in sync
  stcRecipeCards.forEach(c => c.classList.toggle('selected', c.dataset.recipe === recipe.id))

  stcCurrentItems = recipe.ingredients.map(item => {
    const needed = item.perServing * servings
    return {
      ...item,
      needed,
      packs: Math.max(1, Math.ceil(needed / item.packSize))
    }
  })

  document.querySelector('#stcSummary').innerHTML = `
    <div class="stc-stat stc-stat-recipe">
      ${recipe.image ? `<img src="${recipe.image}" alt="${escapeHtml(recipe.name)}" />` : ''}
      <div>
        <span>Recipe</span>
        <strong>${escapeHtml(recipe.name)}</strong>
      </div>
    </div>
    <div class="stc-stat">
      <span>Servings</span>
      <strong>${servings}</strong>
    </div>
    <div class="stc-stat">
      <span>Budget</span>
      <strong>${formatPeso(budget)}</strong>
    </div>
  `

  refreshGroceryList()
}

function renderBudgetSuggestions(total) {
  const box = document.querySelector('#stcSuggestions')
  if (!box) return

  const recipe = stcState.recipe

  if (!recipe || total <= stcBudget || !stcCurrentItems.length) {
    box.innerHTML = ''
    return
  }

  const servings = stcServingsUsed
  const maxServ = maxServingsWithinBudget(recipe, stcBudget)
  const alternatives = cheaperRecipes(stcBudget, servings, recipe.id)
  const minCost = computeRecipeCost(recipe, 1)

  let servingsHtml = ''

  if (maxServ && maxServ < servings) {
    servingsHtml = `
      <button type="button" class="stc-suggest-btn" data-suggest="servings" data-value="${maxServ}">
        <span>Reduce to ${maxServ} serving${maxServ > 1 ? 's' : ''}</span>
        <strong>${formatPeso(computeRecipeCost(recipe, maxServ))}</strong>
      </button>
    `
  } else if (!maxServ) {
    servingsHtml = `
      <p class="stc-suggest-note">
        Even 1 serving of ${escapeHtml(recipe.name)} costs ${formatPeso(minCost)},
        so it can't fit your current budget.
      </p>
    `
  }

  let recipesHtml = ''

  if (alternatives.length) {
    recipesHtml = `
      <p class="stc-suggest-label">Dishes within ${formatPeso(stcBudget)} for ${servings} serving${servings > 1 ? 's' : ''}:</p>
      ${alternatives.map(a => `
        <button type="button" class="stc-suggest-btn" data-suggest="recipe" data-value="${a.recipe.id}">
          <span>${escapeHtml(a.recipe.name)}</span>
          <strong>${formatPeso(a.cost)}</strong>
        </button>
      `).join('')}
    `
  } else {
    const cheapest = cheapestRecipe(servings)
    const currentCost = computeRecipeCost(recipe, servings)

    if (cheapest && cheapest.recipe.id !== recipe.id && cheapest.cost < currentCost) {
      // A cheaper dish exists, even if it still doesn't fit the budget
      recipesHtml = `
        <p class="stc-suggest-label">No dish fits ${formatPeso(stcBudget)} for ${servings} serving${servings > 1 ? 's' : ''}. The cheapest option is:</p>
        <button type="button" class="stc-suggest-btn" data-suggest="recipe" data-value="${cheapest.recipe.id}">
          <span>${escapeHtml(cheapest.recipe.name)}</span>
          <strong>${formatPeso(cheapest.cost)}</strong>
        </button>
      `
    } else {
      // Current recipe is already the cheapest
      recipesHtml = `
        <p class="stc-suggest-note">
          ${escapeHtml(recipe.name)} is already the cheapest dish for ${servings} serving${servings > 1 ? 's' : ''}.
          You'd need at least ${formatPeso(currentCost)} to cover it.
        </p>
      `
    }
  }

  box.innerHTML = `
    <div class="stc-suggest">
      <h4>💡 You're ${formatPeso(total - stcBudget)} over budget</h4>
      ${servingsHtml}
      ${recipesHtml}
      <p class="stc-suggest-note">
        You can also remove items above, or continue with "Add All to Cart".
      </p>
    </div>
  `
}

function refreshGroceryList() {
  const items = stcCurrentItems
  const total = items.reduce((sum, item) => sum + item.packs * item.packPrice, 0)
  const difference = stcBudget - total
  const withinBudget = difference >= 0
  const percent = stcBudget > 0 ? Math.min(100, (total / stcBudget) * 100) : 0

  document.querySelector('#stcCount').textContent =
    `${items.length} item${items.length === 1 ? '' : 's'}`

  document.querySelector('#stcList').innerHTML = items.length
    ? items.map(item => `
      <div class="stc-item">

        <div class="stc-item-info">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.product)}</span>
          <small>Recommended: ${formatAmount(item.needed, item.unit)}</small>
        </div>

        <div class="stc-qty">
          <button type="button" data-action="dec" data-id="${item.id}"
            aria-label="Decrease quantity" ${item.packs <= 1 ? 'disabled' : ''}>−</button>
          <span>${item.packs}</span>
          <button type="button" data-action="inc" data-id="${item.id}"
            aria-label="Increase quantity">+</button>
        </div>

        <div class="stc-item-total">
          <strong>${formatPeso(item.packs * item.packPrice)}</strong>
          <small>${formatPeso(item.packPrice)} each</small>
        </div>

        <button type="button" class="stc-remove" data-action="remove" data-id="${item.id}"
          aria-label="Remove ${escapeHtml(item.name)}">
          <i data-lucide="trash-2"></i>
        </button>

      </div>
    `).join('')
    : '<p class="stc-list-empty">No ingredients left. Go back to choose another recipe.</p>'

  document.querySelector('#stcTotals').innerHTML = `
    <div class="stc-total-row">
      <span>Estimated total</span>
      <strong>${formatPeso(total)}</strong>
    </div>
    <div class="stc-bar ${withinBudget ? '' : 'over'}"><span style="width:${percent}%"></span></div>
    <div class="stc-total-row stc-status ${withinBudget ? 'ok' : 'over'}">
      <span>${withinBudget ? 'Remaining budget' : 'Over budget by'}</span>
      <strong>${formatPeso(Math.abs(difference))}</strong>
    </div>
  `

  renderBudgetSuggestions(total)

  const addAll = document.querySelector('#stcAddAll')
  addAll.disabled = items.length === 0
  addAll.innerHTML = 'Add All to Cart <i data-lucide="shopping-cart"></i>'

  createIcons({ icons: { Trash2, ShoppingCart } })
}

// Add / subtract / remove (event delegation)
document.querySelector('#stcList')?.addEventListener('click', event => {
  const button = event.target.closest('[data-action]')
  if (!button) return

  const item = stcCurrentItems.find(entry => entry.id === button.dataset.id)
  if (!item) return

  const action = button.dataset.action

  if (action === 'inc') item.packs = Math.min(99, item.packs + 1)
  if (action === 'dec') item.packs = Math.max(1, item.packs - 1)
  if (action === 'remove') {
    askRemove(item)   // ask first, remove only after confirming
    return
  }

  refreshGroceryList()
})

// Budget suggestion buttons (fewer servings / cheaper recipe)
document.querySelector('#stcSuggestions')?.addEventListener('click', event => {
  const btn = event.target.closest('[data-suggest]')
  if (!btn) return

  if (btn.dataset.suggest === 'servings') {
    const servings = Number(btn.dataset.value)

    document.querySelector('#stcServings').value = servings

    renderGroceryList({
      recipe: stcState.recipe,
      servings,
      budget: stcBudget
    })
  }

  if (btn.dataset.suggest === 'recipe') {
    const recipe = recipes.find(r => r.id === btn.dataset.value)
    if (!recipe) return

    renderGroceryList({
      recipe,
      servings: stcServingsUsed,
      budget: stcBudget
    })
  }
})

document.querySelector('#stcAddAll')?.addEventListener('click', () => {
  if (!stcCurrentItems.length) return

  const cart = readStorage('smCart')

  stcCurrentItems.forEach(item => {
    const existing = cart.find(entry => entry.id === item.id)

    if (existing) {
      existing.quantity += item.packs
    } else {
      cart.push({
        id: item.id,
        name: item.product,
        price: item.packPrice,
        quantity: item.packs
      })
    }
  })

  localStorage.setItem('smCart', JSON.stringify(cart))
  onCartChange()

  const totalPieces = stcCurrentItems.reduce((sum, item) => sum + item.packs, 0)
  const recipeName = stcState.recipe ? stcState.recipe.name : 'your recipe'

  document.querySelector('#stcSuccessText').textContent =
    `${stcCurrentItems.length} item${stcCurrentItems.length === 1 ? '' : 's'} ` +
    `(${totalPieces} pc${totalPieces === 1 ? '' : 's'}) for ${recipeName} ` +
    `${stcCurrentItems.length === 1 ? 'was' : 'were'} added to your cart.`

  stcSuccess.hidden = false
})

document.querySelector('#stcShowCart')?.addEventListener('click', () => {
  onShowCart()
})

document.querySelector('#stcSuccessClose')?.addEventListener('click', closeSmartCart)

stcSuccess?.addEventListener('click', event => {
  if (event.target === stcSuccess) stcSuccess.hidden = true
})

// ---- Step 2: recipe selection, search, generate ----
const stcState = { recipe: null }
const stcRecipeCards = document.querySelectorAll('.stc-recipe')
const stcSearch = document.querySelector('#stcRecipeSearch')
const stcEmpty = document.querySelector('#stcEmpty')
const stcError = document.querySelector('#stcError')

stcRecipeCards.forEach(card => {
  card.addEventListener('click', () => {
    stcState.recipe = recipes.find(r => r.id === card.dataset.recipe)

    stcRecipeCards.forEach(c => c.classList.toggle('selected', c === card))
    stcError.textContent = ''
  })
})

const stcPopularLabel = document.querySelector('#stcPopularLabel')

function updateRecipeList() {
  const raw = stcSearch.value.trim()
  const query = raw.toLowerCase()
  let visible = 0

  stcRecipeCards.forEach(card => {
    const match = query
      ? card.dataset.name.includes(query)
      : card.dataset.popular === 'true'

    card.hidden = !match
    if (match) visible++
  })

  stcPopularLabel.textContent = query ? 'Search results:' : 'Most Popular this week:'

  const noMatch = Boolean(query) && visible === 0
  stcEmpty.hidden = !noMatch
  if (noMatch) stcEmpty.textContent = `No recipe found for "${raw}".`
}

stcSearch?.addEventListener('input', updateRecipeList)

document.querySelector('#stcGenerate')?.addEventListener('click', () => {
  const budget = Number(document.querySelector('#stcBudget').value)
  const servings = Number(document.querySelector('#stcServings').value)

  if (!stcState.recipe) {
    stcError.textContent = 'Please choose a recipe first.'
    return
  }

  if (!(budget > 0) || !(servings > 0)) {
    stcError.textContent = 'Please enter a valid budget and number of servings.'
    return
  }

  stcError.textContent = ''

  localStorage.setItem('smartCartPlan', JSON.stringify({
    recipe: stcState.recipe.name,
    budget,
    servings,
    branch: branchName
  }))

  renderGroceryList({ recipe: stcState.recipe, servings, budget })

  goToStep(3)
})

// Click outside the modal to close
stcOverlay?.addEventListener('click', event => {
  if (event.target === stcOverlay) closeSmartCart()
})

// Esc to close
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !stcOverlay || stcOverlay.hidden) return

  // Close the popups first, then the modal
  if (!stcSuccess.hidden) {
    stcSuccess.hidden = true
    return
  }

  if (!stcConfirm.hidden) {
    closeConfirm()
    return
  }

  closeSmartCart()
})

  return { open: openSmartCart, close: closeSmartCart }
}