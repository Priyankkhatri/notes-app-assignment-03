# Notes App Assignment 03

A backend API built from scratch for **Backend with Node.js - Assignment 03**.

This project implements:

- REST API with Express and MongoDB
- Full CRUD for notes
- Search using MongoDB `$regex`
- Combined query APIs for filter, sort, and pagination
- One master query endpoint that supports everything together

## Live Links

- GitHub Repository: [notes-app-assignment-03](https://github.com/Priyankkhatri/notes-app-assignment-03)
- Live Backend: [https://notes-app-assignment-03.onrender.com](https://notes-app-assignment-03.onrender.com)
- Postman Documentation: [View Collection Docs](https://documenter.getpostman.com/view/50839274/2sBXqJKgFh)

## Tech Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv

## Project Structure

```text
notes-app/
|
|-- src/
|   |-- config/
|   |   `-- db.js
|   |-- models/
|   |   `-- note.model.js
|   |-- controllers/
|   |   `-- note.controller.js
|   |-- routes/
|   |   `-- note.routes.js
|   |-- middlewares/
|   |-- app.js
|   `-- index.js
|
|-- postman/
|   `-- collections/
|       `-- notes-app-assignment-03.postman_collection.json
|-- .env
|-- .env.example
|-- package.json
`-- README.md
```

## Note Schema

```js
const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
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

## API Endpoints

### CRUD

- `POST /api/notes`
- `POST /api/notes/bulk`
- `GET /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `PATCH /api/notes/:id`
- `DELETE /api/notes/:id`
- `DELETE /api/notes/bulk`

### Search

- `GET /api/notes/search`
- `GET /api/notes/search/content`
- `GET /api/notes/search/all`

### Combined Queries

- `GET /api/notes/filter-sort`
- `GET /api/notes/filter-paginate`
- `GET /api/notes/sort-paginate`
- `GET /api/notes/search-filter`
- `GET /api/notes/search-sort-paginate`
- `GET /api/notes/filter-sort-paginate`
- `GET /api/notes/query`

## Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

## Run Locally

```bash
npm install
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

## Sample Requests

Create a note:

```http
POST /api/notes
Content-Type: application/json
```

```json
{
  "title": "Team standup agenda",
  "content": "Discuss sprint blockers and deployment plan",
  "category": "work",
  "isPinned": true
}
```

Master query example:

```http
GET /api/notes/query?q=meeting&category=work&sortBy=createdAt&order=desc&page=1&limit=5
```

## Response Format

Every endpoint follows this format:

```json
{
  "success": true,
  "message": "...",
  "data": []
}
```

List endpoints also return `count`, and paginated endpoints return `pagination`.

## Submission Links

- Repository: [notes-app-assignment-03](https://github.com/Priyankkhatri/notes-app-assignment-03)
- Postman Docs: [https://documenter.getpostman.com/view/50839274/2sBXqJKgFh](https://documenter.getpostman.com/view/50839274/2sBXqJKgFh)
- Deployed API: [https://notes-app-assignment-03.onrender.com](https://notes-app-assignment-03.onrender.com)

## Status

- GitHub repository created and pushed
- Render deployment live
- Postman documentation published
- All required assignment endpoints implemented
