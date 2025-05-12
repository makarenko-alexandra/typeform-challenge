# Form Builder (Fullstack)

A modern, accessible form builder with versioning, built using React, TypeScript, Vite, Mantine UI, Node.js, Express, and MongoDB.

---

## Features

- **Form Versioning:** Every edit creates a new version, preserving history.
- **Inline Editing:** Edit question titles directly in the list.
- **Question Management:** Add and remove questions easily.
- **Version History:** View and edit any previous version of a form.
- **Accessible UI:** Built with Mantine for a clean, accessible experience.
- **API Integration:** Uses React Query for efficient data fetching and caching.
- **RESTful API:** Endpoints for creating, updating, fetching, and deleting forms and submissions.
- **MongoDB:** Uses Mongoose for schema and data management.

---

## Project Structure

```
.
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── queries/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── server/                # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yml
│   └── README.md
│
└── README.md              # (this file)
```

---

## Screenshot

![Form Builder Screenshot](./client/src/assets/builder.png)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/makarenko-alexandra/typeform-challenge
cd typeform-live-coding
```

---

### 2. Setup and Run the Backend (Server)

#### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** (local or Docker)

#### Steps

1. Go to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment:
   - By default, connects to `mongodb://localhost:27017/forms`.
   - To use a different MongoDB URI, set the `MONGODB_URI` environment variable.
4. Start MongoDB:
   - **Option 1:** Use Docker Compose (recommended)
     ```bash
     docker-compose up -d
     ```
   - **Option 2:** Use your local MongoDB instance
5. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on [http://localhost:4000](http://localhost:4000) by default.

---

### 3. Setup and Run the Frontend (Client)

1. Open a new terminal and go to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

4. (Optional) Build for production:
   ```bash
   npm run build
   ```
   The output will be in the `dist/` folder.

5. (Optional) Preview the production build:
   ```bash
   npm run preview
   ```
   This will serve the built app locally for testing.

---

## API Endpoints (Backend)

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
