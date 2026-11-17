# AI-Powered Project & Task Management

A full-stack Kanban-style project management application for organizing projects and tracking tasks. The app combines project and task management with AI-assisted task suggestions and automated Telegram reminders.

## Features

- **Account management** — Register, log in, and authenticate with JWT; Google sign-in is also supported by the backend.
- **Project management** — Create, view, update, and delete projects.
- **Task management** — Create, view, update, and delete tasks within projects.
- **AI task generation** — Generate five task suggestions from a project's name and description using the OpenAI API. Suggestions include a title, description, and priority.
- **Task reminders** — A scheduled backend job checks for tasks due approximately 24 hours ahead and sends Telegram reminders when a Telegram chat is configured.
- **Protected API** — Authenticated routes use bearer-token middleware.
- **Frontend state management** — Redux Toolkit manages authentication, projects, and tasks.

## Tech Stack

| Layer          | Technologies                                   |
| -------------- | ---------------------------------------------- |
| Frontend       | React 19, Vite, React Router                   |
| UI             | Tailwind CSS, DaisyUI                          |
| State & API    | Redux Toolkit, Axios                           |
| Backend        | Node.js, Express 5                             |
| Database / ORM | PostgreSQL, Sequelize                          |
| Authentication | JSON Web Tokens, bcryptjs, Google OAuth client |
| Integrations   | OpenAI API, Telegram Bot API                   |
| Testing        | Jest, Supertest                                |

## Architecture

```text
React + Vite frontend
        |
        | HTTP / JSON + Bearer JWT
        v
Express REST API
        |
        +---- Sequelize ---- PostgreSQL
        |
        +---- OpenAI API (task suggestions)
        |
        +---- Telegram Bot API (task reminders)
```

The repository is organized into two main applications:

- `frontend/` — React client, pages, reusable components, API client, and Redux slices.
- `backend/` — Express application, routes, controllers, Sequelize models/migrations, authentication helpers, integrations, and tests.

## Getting Started

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm
- PostgreSQL
- An OpenAI API key (for AI task generation)
- A Telegram bot token (for Telegram reminders)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

Set the values in `backend/.env`:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
TELEGRAM_BOT_TOKEN=
```

`DATABASE_URL` should point to your PostgreSQL database when using the production-style environment configuration. The development Sequelize configuration is in `backend/config/config.json`; update its local database credentials/name as needed. Do not commit real credentials or API keys.

Create the database and run the Sequelize migrations using the Sequelize CLI available through the installed dependencies. For example:

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

If the CLI is not available in your environment, install/configure the Sequelize CLI before running these commands.

Start the API:

```bash
npm run dev
```

The backend runs on port `3000` by default. A health endpoint is available at `GET /check-health`.

### 3. Configure and run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend API client currently targets `http://localhost:3000` in `src/api.js`. Update this base URL if your backend runs elsewhere.

### 4. Run tests

From the `backend/` directory:

```bash
npm test
```

## Main API Capabilities

The API exposes public authentication endpoints:

- `POST /register`
- `POST /login`
- `POST /google-login`

The remaining application routes are protected by JWT authentication and include user information, project CRUD, task CRUD, and AI task generation. See `backend/routes/` for the route definitions and `backend/controllers/` for request handling.

## Configuration & Security Notes

- Keep `.env` files, database credentials, JWT secrets, and third-party API keys out of version control.
- Use a strong, unique `JWT_SECRET`.
- Configure Google OAuth credentials if using Google sign-in.
- Configure a Telegram bot and associate a chat ID with the user to receive reminders.
- AI task generation requires a valid OpenAI API key.
- The frontend currently stores the access token in browser local storage. Review the authentication/storage approach before deploying a production application.
- Configure CORS, HTTPS, database access, and deployment secrets for your hosting environment.

## Project Structure

```text
.
├── backend/
│   ├── controllers/
│   ├── helpers/
│   ├── jobs/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seeders/
│   └── __test__/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── store/
```
