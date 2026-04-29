<div align="center">

# 📝 Notes App — Assignment 03

**A production-ready REST API built with Node.js, Express & MongoDB**

[![Live API](https://img.shields.io/badge/🚀_Live_API-Render-46E3B7?style=for-the-badge)](https://notes-app-assignment-03.onrender.com)
[![Postman Docs](https://img.shields.io/badge/📬_Postman-Docs-FF6C37?style=for-the-badge)](https://documenter.getpostman.com/view/50839274/2sBXqJKgFh)
[![GitHub Repo](https://img.shields.io/badge/💻_GitHub-Repository-181717?style=for-the-badge)](https://github.com/Priyankkhatri/notes-app-assignment-03)

</div>

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 🚀 Live Backend | [https://notes-app-assignment-03.onrender.com](https://notes-app-assignment-03.onrender.com) |
| 📬 Postman Docs | [View Collection](https://documenter.getpostman.com/view/50839274/2sBXqJKgFh) |
| 💻 GitHub Repo | [notes-app-assignment-03](https://github.com/Priyankkhatri/notes-app-assignment-03) |

---

## ✨ Features

- **Full CRUD** — Create, read, update, and delete notes
- **Search** — Title, content, and combined full-text search via MongoDB `$regex`
- **Filter & Sort** — Query by category, pin status, and sort by any field
- **Pagination** — Offset-based pagination on all list endpoints
- **Master Query Endpoint** — One endpoint that handles search + filter + sort + pagination together
- **Consistent Response Format** — Every endpoint returns `success`, `message`, and `data`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Config | dotenv |
| Deployment | Render |

---

## 📁 Project Structure

```
notes-app/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   └── note.model.js          # Mongoose schema
│   ├── controllers/
│   │   └── note.controller.js     # Business logic
│   ├── routes/
│   │   └── note.routes.js         # Route definitions
│   ├── middlewares/               # Custom middleware
│   ├── app.js                     # Express app setup
│   └── index.js                   # Server entry point
│
├── postman/
│   └── collections/
│       └── notes-app-assignment-03.postman_collection.json
│
├── .env.example
├── package.json
└── README.md
```

---

## 🗂️ Note Schema

```js
const noteSchema = new mongoose.Schema(
  {
    title:    { type: String, required: [true, "Title is required"] },
    content:  { type: String, required: [true, "Content is required"] },
    category: {
      type: String,
      enum: ["work", "personal", "study"],
      default: "personal",
    },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

---

## 📡 API Endpoints

### CRUD

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a single note |
| `POST` | `/api/notes/bulk` | Create multiple notes |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/:id` | Get a note by ID |
| `PUT` | `/api/notes/:id` | Replace a note |
| `PATCH` | `/api/notes/:id` | Partially update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes |

### Search

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes/search` | Search by title |
| `GET` | `/api/notes/search/content` | Search by content |
| `GET` | `/api/notes/search/all` | Search across title & content |

### Combined Queries

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes/filter-sort` | Filter + sort |
| `GET` | `/api/notes/filter-paginate` | Filter + paginate |
| `GET` | `/api/notes/sort-paginate` | Sort + paginate |
| `GET` | `/api/notes/search-filter` | Search + filter |
| `GET` | `/api/notes/search-sort-paginate` | Search + sort + paginate |
| `GET` | `/api/notes/filter-sort-paginate` | Filter + sort + paginate |
| `GET` | `/api/notes/query` | ⭐ Master endpoint — everything together |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

> Copy `.env.example` as a starting point.

---

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/Priyankkhatri/notes-app-assignment-03.git
cd notes-app-assignment-03

# Install dependencies
npm install

# Start development server
npm run dev
```

Server starts at → `http://localhost:5000`

---

## 📬 Sample Requests

**Create a note**

```http
POST /api/notes
Content-Type: application/json

{
  "title": "Team standup agenda",
  "content": "Discuss sprint blockers and deployment plan",
  "category": "work",
  "isPinned": true
}
```

**Master query — search, filter, sort & paginate in one call**

```http
GET /api/notes/query?q=meeting&category=work&sortBy=createdAt&order=desc&page=1&limit=5
```

---

## 📦 Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "count": 5,
  "data": []
}
```

> Paginated endpoints additionally return a `pagination` object with `page`, `limit`, and `total`.

---

## ✅ Submission Checklist

- [x] GitHub repository created and pushed
- [x] Render deployment live
- [x] Postman documentation published
- [x] All required assignment endpoints implemented

---

<div align="center">

Made with Node.js

</div>
