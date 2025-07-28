const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const randBetween = (start, end) =>
  Math.floor(Math.random() * (end - start + 1)) + start;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many API requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

const wordsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "words.json"), "utf8")
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "public/search.html"));
});

app.get("/api", (req, res) => {
  res.json({
    message: "WordWonder API",
    version: "1.0.0",
    documentation:
      "https://github.com/hellokhoyer/WordWonder/blob/main/README.md",
    endpoints: {
      "GET /api/random-word": "Get a random word with definition",
      "GET /api/search": "Search words by query (?q=term&limit=10)",
      "GET /api/word/:slug": "Get specific word by slug",
      "GET /api/pronunciation/:word": "Get pronunciation audio URLs",
      "GET /api/related-words/:word": "Get synonyms/antonyms (?type=synonym)",
    },
    examples: {
      randomWord: "/api/random-word",
      search: "/api/search?q=happy&limit=5",
      wordDetails: "/api/word/happiness",
      pronunciation: "/api/pronunciation/hello",
      synonyms: "/api/related-words/joy?type=synonym",
    },
  });
});

app.get("/api/random-word", (req, res) => {
  try {
    const wordIndex = randBetween(0, wordsData.length - 1);
    const wordData = wordsData[wordIndex];
    res.json(wordData);
  } catch (error) {
    console.error("Error getting random word:", error);
    res.status(500).json({ error: "Failed to get random word" });
  }
});

app.get("/api/pronunciation/:word", async (req, res) => {
  const { word } = req.params;
  const apiKey = process.env.WORDNIK_API_KEY;
  const apiUrl = `https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=true&limit=3&api_key=${apiKey}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching pronunciation:", error);
    res.status(500).json({ error: "Failed to get pronunciation" });
  }
});

app.get("/api/search", (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const maxLimit = Math.min(parseInt(limit) || 10, 50);

    const searchTerm = q.toLowerCase().trim();
    const results = wordsData
      .filter((word) => {
        const wordContent = word.front[0].content.toLowerCase();
        const definition = word.back[1].content.toLowerCase();

        return (
          wordContent.includes(searchTerm) || definition.includes(searchTerm)
        );
      })
      .slice(0, maxLimit)
      .map((word) => ({
        id: word.id,
        word: word.front[0].content,
        definition: word.back[1].content,
        example: word.back[2]?.content || null,
        slug: word.slug,
      }));

    res.json(results);
  } catch (error) {
    console.error("Error searching words:", error);
    res.status(500).json({ error: "Failed to search words" });
  }
});

app.get("/api/word/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const word = wordsData.find((w) => w.slug === slug);

    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json(word);
  } catch (error) {
    console.error("Error getting word:", error);
    res.status(500).json({ error: "Failed to get word" });
  }
});

app.get("/api/related-words/:word", async (req, res) => {
  const { word } = req.params;
  const { type } = req.query;
  const apiKey =
    process.env.WORDNIK_API_KEY_2 ||
    "8e5956350987aa6b0521e0c4761074eabe07f42e9d8fd1492";
  const apiUrl = `https://api.wordnik.com/v4/word.json/${word}/relatedWords?useCanonical=true&relationshipTypes=${type}&limitPerRelationshipType=5&api_key=${apiKey}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type}s:`, error);
    res.status(500).json({ error: `Failed to get ${type}s` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
