# Team board (MERN)

Three-column task board (To do, In progress, Done) built with MongoDB, Express, React (Vite) and Node.

## Setup

1. Install dependencies for everything:
   ```
   npm run install:all
   ```
2. Edit **`server/.env`** (created for you from `.env.example`):
   - `MONGODB_URI` – your local MongoDB or Atlas connection string
   - `PORT` – API port (default 5000)
   - `CLIENT_ORIGIN` – frontend URL allowed by CORS (default http://localhost:5173)
3. Edit **`client/.env`** if your API is not at `http://localhost:5000/api` (`VITE_API_URL`).
4. Start both servers:
   ```
   npm run dev
   ```
   Open http://localhost:5173

## API

| Method | Path             | Purpose        |
|--------|------------------|----------------|
| GET    | /api/tasks       | List tasks     |
| POST   | /api/tasks       | Create a task  |
| PUT    | /api/tasks/:id   | Update / move  |
| DELETE | /api/tasks/:id   | Delete a task  |

## Features

- Create, edit, delete tasks (title, description, assignee, due date)
- Drag cards between columns on desktop; use the ‹ › buttons on touch screens
- Overdue tasks (past due date, not done) are highlighted in red
- Search by title and filter by assignee
- Data persisted in MongoDB, so it survives reloads
- Swipeable columns and a bottom-sheet form on mobile; follows light/dark system theme
