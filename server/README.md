# Form Builder Backend (Node.js + Express + MongoDB)

This is the backend for the Form Builder app. It provides RESTful APIs for managing forms, form versioning, and submissions.

---

## Features

- **Form versioning:** Every edit creates a new version, preserving history.
- **Submissions:** Submissions are linked to the exact version of the form.
- **RESTful API:** Endpoints for creating, updating, fetching, and deleting forms and submissions.
- **MongoDB:** Uses Mongoose for schema and data management.

---

## Project Structure

```
server/
├── src/
│   ├── models/         # Mongoose models (Form, Submission)
│   ├── routes/         # Express route handlers
│   ├── types/          # TypeScript types
│   └── index.ts        # App entry point
├── package.json
├── tsconfig.json
├── docker-compose.yml  # For running with MongoDB
└── README.md
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** (local or Docker)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/makarenko-alexandra/typeform-challenge
cd typeform-live-coding/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment (optional)

- By default, the app connects to `mongodb://localhost:27017/forms`.
- To use a different MongoDB URI, set the `MONGODB_URI` environment variable.

### 4. Start MongoDB

- **Option 1: Use Docker Compose (recommended)**
  ```bash
  docker-compose up -d
  ```
- **Option 2: Use your local MongoDB instance**

### 5. Start the server

```bash
npm run dev
```
- The server will run on [http://localhost:4000](http://localhost:4000) by default.

---

## API Endpoints

- **Forms**
  - `POST   /api/forms`            - Create a new form
  - `GET    /api/forms`            - Get all forms (all versions)
  - `GET    /api/forms/:id`        - Get a form by versioned ID
  - `PUT    /api/forms/:id`        - Update a form (creates a new version)
  - `DELETE /api/forms/:id`        - Delete a form version

- **Submissions**
  - `POST   /api/forms/:formId/submissions`         - Submit answers for a form version
  - `GET    /api/forms/:formId/submissions`         - Get all submissions for a form version
  - `GET    /api/forms/:formId/submissions/:id`     - Get a single submission

---

## Development Notes

- **Form versioning:** Each update creates a new document with an incremented version.
- **Submissions:** Each submission is linked to the form version it was submitted against.
- **CORS:** Make sure CORS is enabled if you use the frontend locally.
