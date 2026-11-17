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

// Serve the built Vite app
app.use(express.static(path.join(__dirname, "dist")));

// Fallback to index.html (Express 5-safe, no "*" route)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on ${port}`));