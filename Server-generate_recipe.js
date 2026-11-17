// server-generate-recipe.js
// Run:  npm i express @anthropic-ai/sdk
//       ANTHROPIC_API_KEY=your_key node server-generate-recipe.js
// The API key stays on the server. Never put it in market-home.js.

import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const client = new Anthropic() // reads ANTHROPIC_API_KEY from the environment

app.use(express.json())

app.post('/api/generate-recipe', async (req, res) => {
  const dish = String(req.body?.dish || '').trim().slice(0, 80)
  if (!dish) return res.status(400).json({ error: 'Missing dish' })

  try {
    const message = await client.messages.create({
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

app.listen(3001, () => console.log('Recipe API on http://localhost:3001'))