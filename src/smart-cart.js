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
// SMALL HELPERS
// ========================================

function formatPeso(value) {
  return '₱' + value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function roundMoney(value) {
  return Math.round(value * 100) / 100
}

// 500 g -> "500g", 1500 g -> "1.5kg", 1000 ml -> "1L", 6 pcs -> "6 pcs"
function formatAmount(amount, unit) {
  if (unit === 'pcs') return `${Math.ceil(amount)} pcs`
  if (unit === 'g' && amount >= 1000) return `${+(amount / 1000).toFixed(2)}kg`
  if (unit === 'ml' && amount >= 1000) return `${+(amount / 1000).toFixed(2)}L`
  return `${+amount.toFixed(1)}${unit}`
}

export function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

// ========================================
// RECIPE DATA
// ========================================

// Basket illustration for the SMart-to-Cart modal
// (save it as assets/images/smart-to-cart.png / .avif / .webp)
const smartCartImage = getImage('SM Bonus Grocery Basket')

// ----------------------------------------
// Ingredient catalog (real-life pack sizes + price per pack)
// ----------------------------------------
// title = product name (no size)
// base  = the pack size already sold in the store (keeps its product id)
// sizes = the pack sizes you can really buy: sz(amount, price, label?)
// Prices for sizes not yet in the store are estimates. Edit them freely.
const sz = (amount, price, label) => ({ amount, price, label })

const catalog = {
  // Meat & seafood
  chicken:      { id: 'sm-bonus-fresh-chilled-chicken', name: 'Chicken', title: 'SM Bonus Fresh Chilled Chicken', unit: 'g', base: 900,
                  sizes: [sz(500, 110), sz(900, 190, '800g-1000g'), sz(1500, 300)] },
  porkLiempo:   { id: 'sm-bonus-liempo', name: 'Pork Liempo', title: 'SM Bonus Liempo', unit: 'g', base: 450,
                  sizes: [sz(250, 100), sz(450, 175, '400g-500g'), sz(1000, 380)] },
  porkAdoboCut: { id: 'sm-bonus-adobo-cut', name: 'Pork (Adobo Cut)', title: 'SM Bonus Pork Adobo Cut', unit: 'g', base: 450,
                  sizes: [sz(250, 60), sz(450, 105, '400g-500g'), sz(1000, 230)] },
  groundPork:   { id: 'ground-pork-250g', name: 'Ground Pork', title: 'Ground Pork', unit: 'g', base: 250,
                  sizes: [sz(250, 95), sz(500, 185), sz(1000, 360)] },
  beefChuck:    { id: 'beef-chuck-500g', name: 'Beef', title: 'Beef Chuck Cubes', unit: 'g', base: 500,
                  sizes: [sz(250, 150), sz(500, 290), sz(1000, 570)] },
  beefShank:    { id: 'beef-shank-500g', name: 'Beef Shank', title: 'Beef Shank', unit: 'g', base: 500,
                  sizes: [sz(250, 145), sz(500, 280), sz(1000, 550)] },
  bangus:       { id: 'bangus-500g', name: 'Milkfish (Bangus)', title: 'Milkfish (Bangus)', unit: 'g', base: 500,
                  sizes: [sz(300, 120), sz(500, 190), sz(800, 300)] },
  tilapia:      { id: 'tilapia-500g', name: 'Tilapia', title: 'Tilapia', unit: 'g', base: 500,
                  sizes: [sz(500, 110), sz(1000, 215)] },
  eggs:         { id: 'eggs-6pcs', name: 'Eggs', title: 'Eggs', unit: 'pcs', base: 6,
                  sizes: [sz(6, 65), sz(12, 125), sz(30, 290)] },

  // Vegetables
  garlic:       { id: 'garlic-100g', name: 'Garlic', title: 'Garlic', unit: 'g', base: 100,
                  sizes: [sz(50, 12), sz(100, 22), sz(250, 52)] },
  onion:        { id: 'red-onion-250g', name: 'Red Onion', title: 'Red Onion', unit: 'g', base: 250,
                  sizes: [sz(100, 16), sz(250, 38), sz(500, 72)] },
  ginger:       { id: 'ginger-100g', name: 'Ginger', title: 'Ginger', unit: 'g', base: 100,
                  sizes: [sz(50, 12), sz(100, 20), sz(250, 48)] },
  tomato:       { id: 'tomato-250g', name: 'Tomato', title: 'Tomatoes', unit: 'g', base: 250,
                  sizes: [sz(250, 28), sz(500, 52), sz(1000, 100)] },
  potato:       { id: 'potato-500g', name: 'Potato', title: 'Potatoes', unit: 'g', base: 500,
                  sizes: [sz(250, 32), sz(500, 60), sz(1000, 115)] },
  carrot:       { id: 'carrot-250g', name: 'Carrot', title: 'Carrots', unit: 'g', base: 250,
                  sizes: [sz(250, 30), sz(500, 56), sz(1000, 105)] },
  bellPepper:   { id: 'bell-pepper-150g', name: 'Red Bell Pepper', title: 'Red Bell Pepper', unit: 'g', base: 150,
                  sizes: [sz(150, 45), sz(300, 85)] },
  kangkong:     { id: 'kangkong-250g', name: 'Kangkong', title: 'Kangkong', unit: 'g', base: 250,
                  sizes: [sz(250, 25), sz(500, 45)] },
  labanos:      { id: 'labanos-250g', name: 'Radish (Labanos)', title: 'Radish', unit: 'g', base: 250,
                  sizes: [sz(250, 25), sz(500, 45)] },
  greenPapaya:  { id: 'green-papaya-500g', name: 'Green Papaya', title: 'Green Papaya', unit: 'g', base: 500,
                  sizes: [sz(500, 40), sz(1000, 75)] },
  siliLeaves:   { id: 'sili-leaves-100g', name: 'Chili Leaves', title: 'Chili Leaves (Dahon ng Sili)', unit: 'g', base: 100,
                  sizes: [sz(100, 15), sz(200, 28)] },
  eggplant:     { id: 'eggplant-250g', name: 'Eggplant', title: 'Eggplant', unit: 'g', base: 250,
                  sizes: [sz(250, 30), sz(500, 55), sz(1000, 105)] },
  squash:       { id: 'squash-500g', name: 'Squash (Kalabasa)', title: 'Squash', unit: 'g', base: 500,
                  sizes: [sz(500, 35), sz(1000, 65)] },
  stringBeans:  { id: 'string-beans-250g', name: 'String Beans (Sitaw)', title: 'String Beans', unit: 'g', base: 250,
                  sizes: [sz(250, 30), sz(500, 55)] },
  okra:         { id: 'okra-250g', name: 'Okra', title: 'Okra', unit: 'g', base: 250,
                  sizes: [sz(250, 35), sz(500, 65)] },
  ampalaya:     { id: 'ampalaya-250g', name: 'Bitter Gourd (Ampalaya)', title: 'Bitter Gourd', unit: 'g', base: 250,
                  sizes: [sz(250, 35), sz(500, 65)] },
  pechay:       { id: 'pechay-250g', name: 'Pechay', title: 'Pechay', unit: 'g', base: 250,
                  sizes: [sz(250, 30), sz(500, 55)] },
  cabbage:      { id: 'cabbage-500g', name: 'Cabbage', title: 'Cabbage', unit: 'g', base: 500,
                  sizes: [sz(500, 45), sz(1000, 85)] },
  corn:         { id: 'sweet-corn-2pcs', name: 'Sweet Corn', title: 'Sweet Corn', unit: 'pcs', base: 2,
                  sizes: [sz(2, 35), sz(4, 65), sz(6, 95)] },
  siliHaba:     { id: 'sili-haba-100g', name: 'Green Chili (Siling Haba)', title: 'Green Chili', unit: 'g', base: 100,
                  sizes: [sz(50, 12), sz(100, 20), sz(250, 45)] },
  siliLabuyo:   { id: 'sili-labuyo-50g', name: 'Bird\'s Eye Chili (Labuyo)', title: 'Siling Labuyo', unit: 'g', base: 50,
                  sizes: [sz(25, 15), sz(50, 25), sz(100, 45)] },
  malunggay:    { id: 'malunggay-100g', name: 'Malunggay Leaves', title: 'Malunggay Leaves', unit: 'g', base: 100,
                  sizes: [sz(100, 15), sz(200, 28)] },
  driedTaro:    { id: 'dried-taro-leaves-50g', name: 'Dried Taro Leaves (Gabi)', title: 'Dried Taro Leaves', unit: 'g', base: 50,
                  sizes: [sz(50, 30), sz(100, 55)] },
  monggo:       { id: 'mung-beans-250g', name: 'Mung Beans (Monggo)', title: 'Mung Beans', unit: 'g', base: 250,
                  sizes: [sz(250, 45), sz(500, 85), sz(1000, 160)] },
  calamansi:    { id: 'calamansi-100g', name: 'Calamansi', title: 'Calamansi', unit: 'g', base: 100,
                  sizes: [sz(100, 20), sz(250, 45), sz(500, 85)] },

  // Pantry
  suka:         { id: 'silver-swan-suka-puti', name: 'Vinegar', title: 'Silver Swan Suka Puti', unit: 'ml', base: 200,
                  sizes: [sz(200, 8, '200ml Doy Pack'), sz(385, 17), sz(1000, 40)] },
  soy:          { id: 'datu-puti-soy-sauce', name: 'Soy Sauce', title: 'Datu Puti Soy Sauce', unit: 'ml', base: 200,
                  sizes: [sz(200, 14, '200ml Doy Pack'), sz(385, 28), sz(1000, 70)] },
  patis:        { id: 'datu-puti-patis', name: 'Fish Sauce', title: 'Datu Puti Patis', unit: 'ml', base: 1000,
                  sizes: [sz(200, 16), sz(385, 30), sz(1000, 82)] },
  beefCubes:    { id: 'knorr-beef-cubes', name: 'Beef Cubes', title: 'Knorr Beef Cubes Pantry', unit: 'g', base: 60,
                  sizes: [sz(10, 7, '1 cube (10g)'), sz(60, 35.75)] },
  sinigangMix:  { id: 'sinigang-mix', name: 'Sinigang Mix', title: 'Sinigang sa Sampalok Mix', unit: 'g', base: 44,
                  sizes: [sz(22, 11), sz(44, 21)] },
  tomatoSauce:  { id: 'tomato-sauce-200g', name: 'Tomato Sauce', title: 'Tomato Sauce', unit: 'g', base: 200,
                  sizes: [sz(100, 13), sz(200, 22), sz(1000, 95)] },
  liverSpread:  { id: 'liver-spread-85g', name: 'Liver Spread', title: 'Liver Spread', unit: 'g', base: 85,
                  sizes: [sz(85, 28), sz(165, 50)] },
  peanutButter: { id: 'peanut-butter-200g', name: 'Peanut Butter', title: 'Peanut Butter', unit: 'g', base: 200,
                  sizes: [sz(200, 85), sz(340, 135)] },
  kareMix:      { id: 'kare-kare-mix-50g', name: 'Kare-Kare Mix', title: 'Kare-Kare Mix', unit: 'g', base: 50,
                  sizes: [sz(50, 25)] },
  bagoong:      { id: 'bagoong-230g', name: 'Shrimp Paste (Bagoong)', title: 'Bagoong Alamang', unit: 'g', base: 230,
                  sizes: [sz(115, 40), sz(230, 70)] },
  coconutMilk:  { id: 'coconut-milk-400ml', name: 'Coconut Milk (Gata)', title: 'Coconut Milk', unit: 'ml', base: 400,
                  sizes: [sz(250, 38), sz(400, 55)] },
  cookingOil:   { id: 'cooking-oil-1l', name: 'Cooking Oil', title: 'Cooking Oil', unit: 'ml', base: 1000,
                  sizes: [sz(200, 32), sz(500, 65), sz(1000, 120), sz(2000, 230)] },
  sugar:        { id: 'white-sugar-1kg', name: 'White Sugar', title: 'White Sugar', unit: 'g', base: 1000,
                  sizes: [sz(250, 24), sz(500, 42), sz(1000, 80)] },
  cornstarch:   { id: 'cornstarch-200g', name: 'Cornstarch', title: 'Cornstarch', unit: 'g', base: 200,
                  sizes: [sz(100, 20), sz(200, 35)] },
  salt:         { id: 'salt-500g', name: 'Salt', title: 'Iodized Salt', unit: 'g', base: 500,
                  sizes: [sz(250, 12), sz(500, 20), sz(1000, 35)] },
  peppercorn:   { id: 'whole-peppercorn', name: 'Whole Peppercorn', title: 'Whole Peppercorn', unit: 'g', base: 10,
                  sizes: [sz(5, 10), sz(10, 15), sz(25, 32)] },
  bayLeaves:    { id: 'bay-leaves-10g', name: 'Bay Leaves (Laurel)', title: 'Bay Leaves', unit: 'g', base: 10,
                  sizes: [sz(5, 12), sz(10, 18)] }
}

// Sort sizes small to big and give each one a label ("500g", "1kg", "6 pcs"...)
Object.values(catalog).forEach(item => {
  item.sizes = item.sizes
    .map(size => ({ ...size, label: size.label || formatAmount(size.amount, item.unit) }))
    .sort((a, b) => a.amount - b.amount)
})

// ----------------------------------------
// Budget flexibility rules (ingredients adjust, servings NEVER change)
// minScale = lowest % of the recommended amount an ingredient can be reduced to
// optional = can be removed completely if the budget is still too tight
// ----------------------------------------
const PROTEIN_KEYS = new Set([
  'chicken', 'porkLiempo', 'porkAdoboCut', 'groundPork', 'beefChuck',
  'beefShank', 'bangus', 'tilapia'
])

const VEGGIE_KEYS = new Set([
  'tomato', 'potato', 'carrot', 'bellPepper', 'kangkong', 'labanos',
  'greenPapaya', 'siliLeaves', 'eggplant', 'squash', 'stringBeans', 'okra',
  'ampalaya', 'pechay', 'cabbage', 'corn', 'malunggay'
])

const OPTIONAL_KEYS = new Set([
  'peppercorn', 'bayLeaves', 'siliLabuyo', 'calamansi', 'cornstarch',
  'malunggay', 'siliLeaves', 'bellPepper', 'labanos', 'cabbage'
])

function minScaleFor(key) {
  if (PROTEIN_KEYS.has(key)) return 0.6
  if (VEGGIE_KEYS.has(key)) return 0.5
  return 0.8
}

// ing('garlic', 5) = garlic, 5 g needed per serving
function ing(key, perServing) {
  if (!catalog[key]) console.error(`Unknown ingredient: ${key}`)
  return {
    ...catalog[key],
    key,
    perServing,
    minScale: minScaleFor(key),
    optional: OPTIONAL_KEYS.has(key)
  }
}

// ----------------------------------------
// Recipes (all searchable). popular: true = shown by default.
// perServing = real-life amount for ONE person (g / ml / pcs)
// ----------------------------------------
const recipes = [
  { id: 'chicken-adobo', name: 'Chicken Adobo', main: 'Chicken', popular: true, image: getImage('Adobo'),
    ingredients: [ing('chicken', 200), ing('suka', 20), ing('soy', 15), ing('garlic', 5), ing('peppercorn', 0.5), ing('bayLeaves', 0.3)] },

  { id: 'pork-adobo', name: 'Pork Adobo', main: 'Pork', image: getImage('Pork Adobo', true),
    ingredients: [ing('porkAdoboCut', 150), ing('suka', 20), ing('soy', 15), ing('garlic', 5), ing('peppercorn', 0.5), ing('bayLeaves', 0.3)] },

  { id: 'pork-sinigang', name: 'Pork Sinigang', main: 'Pork', popular: true, image: getImage('Pork Sinigang'),
    ingredients: [ing('porkLiempo', 150), ing('sinigangMix', 8), ing('kangkong', 40), ing('tomato', 30), ing('labanos', 40), ing('patis', 10)] },

  { id: 'beef-sinigang', name: 'Beef Sinigang', main: 'Beef', image: getImage('Beef Sinigang', true),
    ingredients: [ing('beefShank', 180), ing('sinigangMix', 8), ing('kangkong', 40), ing('labanos', 40), ing('tomato', 30), ing('stringBeans', 30), ing('patis', 10)] },

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
// PACK + BUDGET LOGIC (real-life packs only)
// ========================================

// Cheapest way to cover `needed` using ONE pack size (e.g. 2 x 500g).
// Ties go to the option with the least leftover.
function cheapestPack(item, needed) {
  let best = null

  item.sizes.forEach((size, sizeIndex) => {
    const qty = Math.max(1, Math.ceil(needed / size.amount - 1e-9))
    const cost = roundMoney(qty * size.price)
    const leftover = qty * size.amount - needed

    if (!best || cost < best.cost || (cost === best.cost && leftover < best.leftover)) {
      best = { sizeIndex, qty, cost, leftover }
    }
  })

  return best
}

// Total cost of a recipe for N servings (cheapest real packs)
function computeRecipeCost(recipe, servings) {
  return roundMoney(recipe.ingredients.reduce(
    (sum, item) => sum + cheapestPack(item, item.perServing * servings).cost,
    0
  ))
}

// ---------- Ingredient adjusting ----------
// The number of servings is NEVER lowered. When the full list is over budget,
// the INGREDIENTS adjust instead:
//  1) lower amounts where it actually saves money (best saving per % lost first)
//  2) when nothing else saves money, drop optional ingredients (biggest saving first)
const SCALE_STEP = 0.05

function trimToBudget(recipe, servings, budget) {
  const items = recipe.ingredients.map(item => ({
    ...item,
    scale: 1,
    dropped: false,
    pack: cheapestPack(item, item.perServing * servings)
  }))

  const total = () => roundMoney(
    items.reduce((sum, i) => (i.dropped ? sum : sum + i.pack.cost), 0)
  )

  let guard = 0

  while (total() > budget && guard++ < 500) {
    let best = null

    // 1) reduce amounts
    items.forEach(item => {
      if (item.dropped) return

      const startStep = Math.round(item.scale / SCALE_STEP) - 1

      for (let k = startStep; k * SCALE_STEP >= item.minScale - 1e-9; k--) {
        const scale = Math.round(k * SCALE_STEP * 100) / 100
        const pack = cheapestPack(item, item.perServing * servings * scale)

        if (pack.cost < item.pack.cost) {
          const saving = item.pack.cost - pack.cost
          const score = saving / (item.scale - scale)

          if (!best || score > best.score) {
            best = { item, scale, pack, score }
          }
          break
        }
      }
    })

    if (best) {
      best.item.scale = best.scale
      best.item.pack = best.pack
      continue
    }

    // 2) drop optional ingredients
    const droppable = items
      .filter(i => !i.dropped && i.optional)
      .sort((x, y) => y.pack.cost - x.pack.cost)[0]

    if (!droppable) break

    droppable.dropped = true
  }

  const cost = total()

  return {
    items,
    cost,
    fits: cost <= budget,
    changed: items.some(i => i.dropped || i.scale < 1)
  }
}

// Other recipes that fit the budget for the same servings
// (after adjusting their ingredients), cheapest first
function cheaperRecipes(budget, servings, excludeId) {
  return recipes
    .filter(r => r.id !== excludeId)
    .map(r => {
      const trim = trimToBudget(r, servings, budget)
      return { recipe: r, cost: trim.cost, fits: trim.fits }
    })
    .filter(x => x.fits)
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 3)
}

// Cheapest recipe overall for N servings (with the most adjusted ingredients)
function cheapestRecipe(servings) {
  return recipes
    .map(r => ({ recipe: r, cost: trimToBudget(r, servings, 0).cost }))
    .sort((a, b) => a.cost - b.cost)[0] || null
}

// Cart id for a size (the store's own pack keeps the original product id)
function sizeId(item, size) {
  return size.amount === item.base ? item.id : `${item.id}-${size.amount}${item.unit}`
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
              <input type="number" id="stcServings" value="3" min="1" max="50" />
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

          <!-- Shown when ingredients were adjusted to fit the budget -->
          <div id="stcNotice"></div>

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

// Styles for the pack-size dropdown + budget notice (added once)
if (!document.querySelector('#stcExtraStyles')) {
  const style = document.createElement('style')
  style.id = 'stcExtraStyles'

  style.textContent = `
    .stc-size-select {
      display: block;
      box-sizing: border-box;
      max-width: 100%;
      margin: 6px 0 4px;
      padding: 6px 8px;
      border: 1px solid #dbe2f0;
      border-radius: 8px;
      background: #fff;
      color: inherit;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .stc-size-select:disabled {
      cursor: default;
      opacity: 0.85;
    }

    .stc-size-select:focus {
      outline: none;
      border-color: #0b3cff;
      box-shadow: 0 0 0 3px rgba(11, 60, 255, 0.15);
    }

    .stc-notice ul {
      margin: 6px 0 0;
      padding-left: 18px;
    }

    .stc-notice {
      margin: 0 0 14px;
      padding: 10px 14px;
      border: 1px solid #f5d98b;
      border-radius: 10px;
      background: #fff8e1;
      color: #6b4e00;
      font-size: 14px;
      line-height: 1.5;
    }
  `

  document.head.appendChild(style)
}

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

// ---- Budget state ----
let stcBudget = 0
let stcServingsUsed = 0

// Cost of one grocery line = packs x price of the chosen pack size
function itemCost(item) {
  return roundMoney(item.qty * item.sizes[item.sizeIndex].price)
}

// Which ingredients were reduced / removed to fit the budget
let stcDropped = []

// Builds the list. The servings stay exactly what the user entered.
// If the list is over budget, the ingredients are adjusted to fit.
function startList(recipe, servings, budget) {
  localStorage.setItem('smartCartPlan', JSON.stringify({
    recipe: recipe.name,
    budget,
    servings,
    branch: branchName
  }))

  renderGroceryList({ recipe, servings, budget })
}

function renderGroceryList({ recipe, servings, budget }) {
  stcBudget = budget
  stcServingsUsed = servings
  stcState.recipe = recipe

  // Keep the Step 2 selection in sync
  stcRecipeCards.forEach(c => c.classList.toggle('selected', c.dataset.recipe === recipe.id))

  const trim = trimToBudget(recipe, servings, budget)

  stcDropped = trim.items.filter(item => item.dropped)

  stcCurrentItems = trim.items
    .filter(item => !item.dropped)
    .map(item => {
      const full = item.perServing * servings
      const raw = full * item.scale
      const needed = item.unit === 'pcs'
        ? Math.max(1, Math.ceil(raw - 1e-9))
        : Math.round(raw * 100) / 100

      return {
        ...item,
        full,                         // amount for the full recipe
        needed,                       // amount after adjusting
        sizeIndex: item.pack.sizeIndex,
        qty: item.pack.qty
      }
    })

  // No notice: ingredients are silently adjusted to fit the budget
  document.querySelector('#stcNotice').innerHTML = ''

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
  const plural = servings > 1 ? 's' : ''
  const adjusted = trimToBudget(recipe, servings, stcBudget)
  const alternatives = cheaperRecipes(stcBudget, servings, recipe.id)

  let resetHtml = ''

  if (adjusted.fits) {
    // the adjusted list fits, the user's changes pushed it over
    resetHtml = `
      <button type="button" class="stc-suggest-btn" data-suggest="reset">
        <span>Go back to the adjusted list (same ${servings} serving${plural})</span>
        <strong>${formatPeso(adjusted.cost)}</strong>
      </button>
    `
  } else {
    resetHtml = `
      <p class="stc-suggest-note">
        Even with adjusted ingredients, ${servings} serving${plural} of ${escapeHtml(recipe.name)}
        costs at least ${formatPeso(adjusted.cost)}, so it can't fit your current budget.
      </p>
    `
  }

  let recipesHtml = ''

  if (alternatives.length) {
    recipesHtml = `
      <p class="stc-suggest-label">Dishes within ${formatPeso(stcBudget)} for ${servings} serving${plural}:</p>
      ${alternatives.map(a => `
        <button type="button" class="stc-suggest-btn" data-suggest="recipe" data-value="${a.recipe.id}">
          <span>${escapeHtml(a.recipe.name)}</span>
          <strong>${formatPeso(a.cost)}</strong>
        </button>
      `).join('')}
    `
  } else {
    const cheapest = cheapestRecipe(servings)

    if (cheapest && cheapest.recipe.id !== recipe.id && cheapest.cost < adjusted.cost) {
      // A cheaper dish exists, even if it still doesn't fit the budget
      recipesHtml = `
        <p class="stc-suggest-label">No dish fits ${formatPeso(stcBudget)} for ${servings} serving${plural}. The cheapest option is:</p>
        <button type="button" class="stc-suggest-btn" data-suggest="recipe" data-value="${cheapest.recipe.id}">
          <span>${escapeHtml(cheapest.recipe.name)}</span>
          <strong>${formatPeso(cheapest.cost)}</strong>
        </button>
      `
    } else {
      // Current recipe is already the cheapest
      recipesHtml = `
        <p class="stc-suggest-note">
          ${escapeHtml(recipe.name)} is already the cheapest dish for ${servings} serving${plural}.
          You'd need at least ${formatPeso(adjusted.cost)} to cover it.
        </p>
      `
    }
  }

  box.innerHTML = `
    <div class="stc-suggest">
      <h4>💡 You're ${formatPeso(total - stcBudget)} over budget</h4>
      ${resetHtml}
      ${recipesHtml}
      <p class="stc-suggest-note">
        You can also change the pack sizes or remove items above, or continue with "Add All to Cart".
      </p>
    </div>
  `
}

// Pack size dropdown (real sizes sold in the store, with price)
function sizeSelectHtml(item) {
  return `
    <select class="stc-size-select" data-action="size" data-id="${item.id}"
      aria-label="Choose pack size for ${escapeHtml(item.name)}"
      ${item.sizes.length === 1 ? 'disabled' : ''}>
      ${item.sizes.map((size, index) => `
        <option value="${index}" ${index === item.sizeIndex ? 'selected' : ''}>
          ${escapeHtml(size.label)} · ${formatPeso(size.price)}
        </option>
      `).join('')}
    </select>
  `
}

function refreshGroceryList() {
  const items = stcCurrentItems
  const total = roundMoney(items.reduce((sum, item) => sum + itemCost(item), 0))
  const difference = roundMoney(stcBudget - total)
  const withinBudget = difference >= 0
  const percent = stcBudget > 0 ? Math.min(100, (total / stcBudget) * 100) : 0

  document.querySelector('#stcCount').textContent =
    `${items.length} item${items.length === 1 ? '' : 's'}`

  document.querySelector('#stcList').innerHTML = items.length
    ? items.map(item => {
      const size = item.sizes[item.sizeIndex]

      return `
      <div class="stc-item">

        <div class="stc-item-info">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.title)}</span>
          ${sizeSelectHtml(item)}
          <small>Recommended: ${formatAmount(item.needed, item.unit)}</small>
        </div>

        <div class="stc-qty">
          <button type="button" data-action="dec" data-id="${item.id}"
            aria-label="Decrease quantity" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="inc" data-id="${item.id}"
            aria-label="Increase quantity">+</button>
        </div>

        <div class="stc-item-total">
          <strong>${formatPeso(itemCost(item))}</strong>
          <small>${formatPeso(size.price)} each</small>
        </div>

        <button type="button" class="stc-remove" data-action="remove" data-id="${item.id}"
          aria-label="Remove ${escapeHtml(item.name)}">
          <i data-lucide="trash-2"></i>
        </button>

      </div>
    `
    }).join('')
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
  // the pack size dropdown is handled by the "change" listener below
  if (event.target.closest('select')) return

  const button = event.target.closest('[data-action]')
  if (!button) return

  const item = stcCurrentItems.find(entry => entry.id === button.dataset.id)
  if (!item) return

  const action = button.dataset.action

  if (action === 'inc') item.qty = Math.min(99, item.qty + 1)
  if (action === 'dec') item.qty = Math.max(1, item.qty - 1)
  if (action === 'remove') {
    askRemove(item)   // ask first, remove only after confirming
    return
  }

  refreshGroceryList()
})

// Pack size dropdown: only the size changes. The quantity stays exactly
// as the user set it (they decide the count with the + / - buttons).
document.querySelector('#stcList')?.addEventListener('change', event => {
  const select = event.target.closest('select[data-action="size"]')
  if (!select) return

  const item = stcCurrentItems.find(entry => entry.id === select.dataset.id)
  if (!item) return

  const sizeIndex = Number(select.value)
  if (!item.sizes[sizeIndex]) return

  item.sizeIndex = sizeIndex

  refreshGroceryList()
})

// Budget suggestion buttons (fewer servings / cheaper recipe / reset)
document.querySelector('#stcSuggestions')?.addEventListener('click', event => {
  const btn = event.target.closest('[data-suggest]')
  if (!btn) return

  if (btn.dataset.suggest === 'reset') {
    startList(stcState.recipe, stcServingsUsed, stcBudget)
  }

  if (btn.dataset.suggest === 'recipe') {
    const recipe = recipes.find(r => r.id === btn.dataset.value)
    if (!recipe) return

    startList(recipe, stcServingsUsed, stcBudget)
  }
})

document.querySelector('#stcAddAll')?.addEventListener('click', () => {
  if (!stcCurrentItems.length) return

  const cart = readStorage('smCart')
  let totalPieces = 0

  stcCurrentItems.forEach(item => {
    const size = item.sizes[item.sizeIndex]
    const id = sizeId(item, size)
    const existing = cart.find(entry => entry.id === id)

    totalPieces += item.qty

    if (existing) {
      existing.quantity += item.qty
    } else {
      cart.push({
        id,
        name: `${item.title} | ${size.label}`,
        price: size.price,
        quantity: item.qty
      })
    }
  })

  localStorage.setItem('smCart', JSON.stringify(cart))
  onCartChange()

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
  const servings = Math.floor(Number(document.querySelector('#stcServings').value))

  if (!stcState.recipe) {
    stcError.textContent = 'Please choose a recipe first.'
    return
  }

  if (!(budget > 0) || !(servings > 0)) {
    stcError.textContent = 'Please enter a valid budget and number of servings.'
    return
  }

  stcError.textContent = ''

  startList(stcState.recipe, Math.min(50, servings), budget)

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