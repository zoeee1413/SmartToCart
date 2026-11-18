import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// --- Your API routes go here (example) ---
// import Anthropic from "@anthropic-ai/sdk";
// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// app.post("/api/chat", async (req, res) => {
//   const msg = await client.messages.create({
//     model: "claude-sonnet-4-6",
//     max_tokens: 1000,
//     messages: req.body.messages,
//   });
//   res.json(msg);
// });

// Serve static assets mula sa Vite build (dist folder)
app.use(express.static(path.join(__dirname, "dist")));

// Explicit Multi-Page Routes para hindi mapunta sa index.html ang ibang pages
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "profile.html"));
});

app.get('/market', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "market-home.html"));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "signin.html"));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "signup.html"));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "cart.html"));
});

// Fallback to index.html para sa main landing page o iba pang hindi nakalista
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on ${port}`));