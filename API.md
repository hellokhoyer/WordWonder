# WordWonder API Documentation

A free API for most commonly suggested GRE vocabulary definitions, pronunciations, and search functionality.

## Base URL

```
https://wordwonder.onrender.com/api
```

---

## Endpoints

### 1. Get Random Word

**GET** `/random-word`

Returns a randomly selected word from the dataset.

**Example Response:**

```json
{
  "id": 388,
  "slug": "anemic",
  "front": [{ "type": "word", "content": "anemic" }],
  "back": [
    { "type": "word", "content": "anemic", "styles": ["word-small"] },
    {
      "type": "text",
      "content": "<strong>adjective:</strong> lacking energy and vigor"
    },
    {
      "type": "example",
      "content": "After three straight shows, the lead actress gave an <strong>anemic</strong> performance the fourth night, barely speaking loudly enough for those in the back rows to hear."
    }
  ]
}
```

---

### 2. Search Words

**GET** `/search?q={query}&limit={number}`

Performs a fuzzy search on the word and definition.

**Query Parameters:**

- `q` (required): Search term (min 2 characters)
- `limit` (optional): Max number of results (default: 10, max: 50)

**Example:**

```
GET /api/search?q=anemic&limit=1
```

**Example Response:**

```json
[
  {
    "id": 388,
    "word": "anemic",
    "definition": "lacking energy and vigor",
    "example": "After three straight shows, the lead actress gave an anemic performance the fourth night...",
    "slug": "anemic"
  }
]
```

---

### 3. Get Word by Slug

**GET** `/word/{slug}`

Returns full word object by its slug.

**Example:**

```
GET /api/word/anemic
```

**Example Response:**

```json
{
  "id": 388,
  "slug": "anemic",
  "front": [{ "type": "word", "content": "anemic" }],
  "back": [
    { "type": "word", "content": "anemic", "styles": ["word-small"] },
    {
      "type": "text",
      "content": "<strong>adjective:</strong> lacking energy and vigor"
    },
    {
      "type": "example",
      "content": "After three straight shows, the lead actress gave an <strong>anemic</strong> performance the fourth night, barely speaking loudly enough for those in the back rows to hear."
    }
  ]
}
```

---

### 4. Get Pronunciation Audio

**GET** `/pronunciation/{word}`

Returns a list of audio files for the word from Wordnik.

**Example:**

```
GET /api/pronunciation/anemic
```

**Example Response:**

```json
[
  {
    "audioType": "pronunciation",
    "duration": 1.2,
    "fileUrl": "https://audio-url.com/anemic.mp3"
  }
]
```

---

### 5. Get Related Words

**GET** `/related-words/{word}?type={synonym|antonym}`

Returns synonyms or antonyms for a word.

**Query Parameters:**

- `type` (required): Either `synonym` or `antonym`

**Example:**

```
GET /api/related-words/anemic?type=synonym
```

**Example Response:**

```json
[
  {
    "relationshipType": "synonym",
    "words": ["weak", "feeble", "languid"]
  }
]
```

---

## Rate Limiting

- Fair-use policy enforced
- Limits: 100 requests per 15 minutes per IP
- Response includes `429 Too Many Requests` if exceeded

---

## CORS

- CORS is **enabled for all origins**
- Safe for browser-based apps

---

## Usage Examples

### JavaScript (Fetch API)

```js
// Get a random word
const res = await fetch("https://wordwonder.onrender.com/api/random-word");
const data = await res.json();

// Search for a word
const res2 = await fetch(
  "https://wordwonder.onrender.com/api/search?q=anemic&limit=1"
);
const results = await res2.json();
```

### cURL

```bash
# Get a random word
curl https://wordwonder.onrender.com/api/random-word

# Search for words
curl "https://wordwonder.onrender.com/api/search?q=anemic&limit=1"
```

---

## 🙏 Attribution

This API uses audio and synonym data from [Wordnik](https://www.wordnik.com).

If you use WordWonder in your project, consider linking back to it.

---
