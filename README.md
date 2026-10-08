# Paradise Scuba Goa

Booking website for scuba diving and water-sports packages in Goa.

| Folder                 | Stack                                         | Deployed on |
| ---------------------- | --------------------------------------------- | ----------- |
| `sunshine-frontend/`   | React 19, Vite, React Router, React Bootstrap | Vercel      |
| `sunshine-activities/` | Node.js, Express 5, Mongoose (MongoDB Atlas)  | Render      |

Images are stored on Cloudinary. Admin sign-in uses Firebase Authentication.

## Prerequisites

- Node.js 24 or newer (see `.nvmrc`)
- A MongoDB Atlas cluster, a Cloudinary account and a Firebase project

## Getting started

```bash
# 1. API
cd sunshine-activities
cp .env.example .env      # fill in the values
npm install
npm run dev               # http://localhost:5000/api

# 2. Web app (in a second terminal)
cd sunshine-frontend
cp .env.example .env      # fill in the values
npm install
npm run dev               # http://localhost:3000
```

## Scripts

| Command                      | API | Web | Description                                |
| ---------------------------- | :-: | :-: | ------------------------------------------ |
| `npm run dev`                |  ✓  |  ✓  | Start in watch / dev-server mode           |
| `npm start`                  |  ✓  |  ✓  | Start the API / dev server                 |
| `npm run build`              |     |  ✓  | Production build into `build/`             |
| `npm run preview`            |     |  ✓  | Serve the production build locally         |
| `npm test`                   |     |  ✓  | Run unit tests (Vitest)                    |
| `npm run lint`               |  ✓  |  ✓  | ESLint                                     |
| `npm run format`             |  ✓  |  ✓  | Prettier                                   |
| `npm run set-admin -- <uid>` |  ✓  |     | Grant the `admin` claim to a Firebase user |

## Project structure

```
sunshine-activities/src
├── app.js            Express app (middleware + routes)
├── server.js         Entry point: DB connection, graceful shutdown
├── config/           env, database, Cloudinary, Firebase Admin
├── controllers/      Request handlers
├── middleware/       auth, upload, validation, rate limiting, errors
├── models/           Mongoose schemas
├── routes/           Routers, mounted under /api
├── services/         Cloudinary and Google Places integrations
└── utils/            ApiError, logger, helpers

sunshine-frontend/src
├── main.jsx / App.jsx
├── config/           env and Firebase client
├── context/ hooks/   Auth provider, useAuth, analytics
├── routes/           Route table, paths, ProtectedRoute
├── services/         Axios client + one module per API resource
├── pages/public      Public pages
├── pages/admin       Admin pages (require sign-in)
├── components/       layout, home, packages, activities, common
├── styles/ assets/ data/ utils/
```

## Authentication

Routes that change data, and the bookings list, require a Firebase ID token from an admin user.
The web app sends this token automatically. A user counts as an admin when their email is in
`ADMIN_EMAILS` (API) / `VITE_ADMIN_EMAILS` (web), or they have the `admin` custom claim.
