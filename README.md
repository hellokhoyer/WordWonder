# WordWonder

**WordWonder** is a vocabulary explorer that helps users search, discover, and pronounce English words interactively.

The word list is curated from the **most commonly suggested GRE vocabulary**, inspired by platforms like **Magoosh**, **Manhattan Prep**, and **Kaplan**. It is ideal for test prep, ESL learners, and language enthusiasts.

Designed with a decoupled architecture and clean modular code, demonstrates production-ready frontend tooling, RESTful API design, and seamless third-party API integration.

---

## Features

- 🔍 Instant search with live auto-suggestions
- 🔄 Random word generator on homepage
- 🎧 Audio pronunciation via Wordnik API
- 📖 Definitions, usage examples, synonyms & antonyms
- 💡 Dynamic search routing and word slugs
- 🧹 RESTful API and static frontend integration

---

## Use Case

WordWonder is especially useful for:

- 🎓 Students preparing for the **GRE**
- 🌍 ESL learners expanding academic vocabulary
- 👨‍💻 Developers exploring full-stack app patterns

---

## Architecture

WordWonder follows a **decoupled multi-page application (MPA)** architecture with a separate API backend and static frontend:

### Backend – RESTful API (Node.js + Express)

- **Pattern**: RESTful API service
- **Language**: JavaScript (CommonJS modules)
- **Routes**:

  - `GET /api/search`
  - `GET /api/random-word`
  - `GET /api/word/:slug`
  - `GET /api/pronunciation/:word`
  - `GET /api/related-words/:word`

  check API.md for API documentation and usage.

### Frontend – Static MPA (Vite + Tailwind CSS)

- **Bundler**: Vite (lightning-fast build)
- **Pages**:

  - `index.html`: random word viewer
  - `search.html`: full word search experience

- **JavaScript Modules**:

  - `script.js`: homepage interactions
  - `search.js`: search logic and rendering

- **Styling**: Tailwind CSS
- **Build Output**: Compiled into `backend/public` for API server to serve

---

## Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Backend  | Node.js, Express               |
| Frontend | Vite, Tailwind CSS, Vanilla JS |
| Tooling  | PostCSS, nodemon, rate-limit   |
| API      | Wordnik API                    |
| Hosting  | Render.com                     |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/hellokhoyer/wordwonder.git
cd wordwonder
```

### 2. Build the frontend and install backend

```bash
cd backend
npm install
npm run build:frontend   # Compiles frontend from ../frontend into /public
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=3000
WORDNIK_API_KEY=your_primary_api_key
WORDNIK_API_KEY_2=your_backup_key
```

### 4. Run the backend server

```bash
npm run dev       # Development with nodemon
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deploy only the `/backend` directory.

- **Build Command**: `npm run build:frontend`
- **Root Directory**: `backend`
- **Start Command**: `npm start`
- **Environment Variables**: Add via hosting dashboard

---

## Project Structure

```
wordwonder/
├── frontend/
│   ├── index.html
│   ├── search.html
│   ├── scripts/
│   └── styles/
├── backend/
│   ├── app.js
│   ├── public/         # Vite build output
│   ├── .env
│   └── words.json      # Mock Data (excluded)
```

---

## Word Data Structure

The backend uses a JSON file (`words.json`) as a mock database.

> This file is excluded intentionally to encourage extension.

```json
{
  "id": "123",
  "slug": "example-word",
  "front": [{ "content": "example" }],
  "back": [
    { "content": "<strong>noun:</strong> a sample entry" },
    {
      "content": "Here is an <strong>example</strong> of how this word is used in context."
    }
  ]
}
```

### Schema Highlights

| Field     | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| `id`      | string | Unique word ID                            |
| `slug`    | string | URL-friendly identifier                   |
| `front[]` | array  | Content displayed on the card front       |
| `back[]`  | array  | Definition, usage, example (HTML allowed) |

---

> “Words are free. It’s how you use them that may cost you.”

```
