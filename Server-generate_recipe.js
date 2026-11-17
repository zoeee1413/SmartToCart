// server.js
// Serves the built site (dist/) AND the recipe API from one Railway service.
//
// Local test:
//   npm run build
//   PowerShell:  $env:ANTHROPIC_API_KEY="your_key"; npm start
//   Mac/Linux:   ANTHROPIC_API_KEY=your_key npm start
//
// The API key stays on the server (Railway Variables). Never put it in the frontend or in Git.

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Create the client lazily so the website still works even if the key is missing
let client
function getClient() {
  client ??= new Anthropic() // reads ANTHROPIC_API_KEY from the environment
  return client
}

app.set('trust proxy', 1) // Railway sits behind a proxy, so req.ip is the real visitor
app.use(express.json({ limit: '10kb' }))

// ---- simple rate limit (protects your API credits from abuse) ----
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const hits = new Map()

function rateLimit(req, res, next) {
  const now = Date.now()
  const recent = (hits.get(req.ip) || []).filter(time => now - time < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' })
  }

  recent.push(now)
  hits.set(req.ip, recent)
  next()
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, times] of hits) {
    if (!times.some(time => now - time < WINDOW_MS)) hits.delete(ip)
  }
}, WINDOW_MS).unref()

// ---- API ----
app.post('/api/generate-recipe', rateLimit, async (req, res) => {
  const dish = String(req.body?.dish || '').trim().slice(0, 80)
  if (!dish) return res.status(400).json({ error: 'Missing dish' })

  try {
    const message = await getClient().messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 1200,
      system:
        'You are a Filipino grocery planner. Reply with JSON only, no markdown. ' +
        'Shape: {"name": string, "ingredients": [{"name": string, "product": string, ' +
        '"perServing": number, "unit": "g"|"ml"|"pcs", "packSize": number, "packPrice": number}]}. ' +
        'perServing is the amount for ONE serving, in the given unit. packSize is the size of one ' +
        'retail pack in the same unit. packPrice is a realistic Philippine supermarket price in PHP. ' +
        'Use 5 to 10 ingredients. Skip water. If the input is not a food or dish, return {"ingredients": []}.',
      messages: [{ role: 'user', content: `Dish: ${dish}` }]
    })

    const text = message.content.find(block => block.type === 'text')?.text ?? ''
    const json = JSON.parse(text.replace(/```json|```/g, '').trim())

    res.json(json)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Generation failed' })
  }
})

// ---- the built website (must come after the API routes) ----
app.use(express.static(path.join(__dirname, 'dist')))

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on port ${port}`))