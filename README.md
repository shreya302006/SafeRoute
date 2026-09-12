# SafeRoute

**Crowd-Powered Safety Navigation**
**Live app:** https://safe-route-blush.vercel.app/ 

## Overview

SafeRoute is a navigation-style web app that helps people choose safer paths through a city using incident reports submitted by the community. Users can view live incident markers on a map, search for a route between two points, see a safety score for their area, and report new incidents in seconds.

This repository contains a deployable **MVP**: a working map, a real geospatial backend backed by MongoDB, and a clean dark UI — deliberately kept simple so it can be extended feature by feature.

## Features

- Interactive dark-themed map (Leaflet + OpenStreetMap tiles)
- Live incident markers, color-coded by severity
- Browser geolocation for "current location"
- Report Incident modal that saves straight to MongoDB and appears on the map instantly
- Geospatial "nearby incidents" query using MongoDB's native `$nearSphere`
- Simple, isolated safety-score calculation (easy to replace with a smarter model later)
- Route search UI with a safety-focused results card (distance, ETA, safety score, nearby incident count)

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS, React-Leaflet      |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB Atlas, Mongoose (GeoJSON + 2dsphere) |
| Deployment | Vercel (frontend), Render (backend)          |

## Architecture

```
saferoute/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Sidebar, Map, SearchPanel, RouteInfoCard, ReportIncidentModal
│       ├── pages/          # Dashboard (main screen)
│       ├── services/       # api.js — all backend calls live here
│       ├── App.jsx
│       └── main.jsx
└── server/                 # Express backend
    ├── models/             # Incident.js (Mongoose schema)
    ├── controllers/        # incidentController.js (route handlers)
    ├── routes/             # incidentRoutes.js
    ├── utils/              # safetyScore.js, seedIncidents.js
    └── server.js           # app entry point
```

The frontend never calls `fetch` directly from components — everything goes through `client/src/services/api.js`, so swapping in a real routing API later means editing one file instead of hunting through the UI.

The safety-score logic lives in `server/utils/safetyScore.js` as a single pure function, `calculateSafetyScore(incidents)`, so it can be replaced with a smarter model without touching any route or controller code.

## API Endpoints

| Method | Endpoint                                   | Description                                      |
|--------|---------------------------------------------|---------------------------------------------------|
| GET    | `/api/incidents`                            | Returns all incidents                              |
| GET    | `/api/incidents/nearby?lat=&lng=&distance=` | Returns incidents within `distance` meters (default 2000m) using MongoDB geospatial query, plus a computed safety score |
| POST   | `/api/incidents`                            | Creates a new incident (`title`, `category`, `severity`, `description`, `latitude`, `longitude`) |

## Database Design

Each incident is stored as a GeoJSON `Point`:

```js
{
  title: String,
  category: String,   // theft | harassment | assault | poor_lighting | accident | suspicious_activity | other
  severity: String,   // low | medium | high
  description: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]  // GeoJSON order
  },
  createdAt: Date
}
```

A `2dsphere` index is created on `location` (`incidentSchema.index({ location: "2dsphere" })`), which is what allows MongoDB to answer "what's near this point" efficiently using `$nearSphere` instead of looping over every document in JavaScript.

## Local Setup

### Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (or local MongoDB)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your MongoDB Atlas connection string
npm run seed     # populates the database with demo incidents
npm run dev      # starts the API on http://localhost:5000
```

### 2. Frontend

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
# .env already points to http://localhost:5000 by default
npm run dev      # starts the app on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Allow location access to see your own position on the map.

## Environment Variables

**server/.env**

| Variable         | Description                                             |
|------------------|----------------------------------------------------------|
| `MONGODB_URI`    | Your MongoDB Atlas connection string                      |
| `PORT`           | Port for the API server (default `5000`)                 |
| `CLIENT_ORIGIN`  | Comma-separated allowed CORS origin(s), e.g. your Vercel URL |

**client/.env**

| Variable        | Description                                  |
|-----------------|-----------------------------------------------|
| `VITE_API_URL`  | Base URL of the deployed backend API          |

## Future Enhancements

- Dynamic route risk scoring
- Route comparison (multiple path options ranked by safety)
- Safety heatmaps
- Time-dependent risk analysis (day vs. night patterns)
- Incident verification / community upvotes
- Real-time safety alerts
- User authentication
- Admin moderation tools
- Personalized route preferences

---

## What was built

**Backend (`server/`)**
- `models/Incident.js` — Mongoose schema for incidents using GeoJSON, with a `2dsphere` index for geospatial queries.
- `controllers/incidentController.js` — handlers for listing all incidents, querying nearby incidents, and creating new ones.
- `routes/incidentRoutes.js` — wires the controller functions to `/api/incidents` endpoints.
- `utils/safetyScore.js` — the isolated, replaceable safety-score function.
- `utils/seedIncidents.js` — a script that fills your database with realistic demo incidents around a default city center.
- `server.js` — Express app setup: CORS, JSON parsing, MongoDB connection, route mounting.

**Frontend (`client/`)**
- `components/Sidebar.jsx` — left navigation (Home, Explore, Report Incident, Safety Map, My Reports, Settings).
- `components/SafetyMap.jsx` — the Leaflet map: dark tiles, incident markers, user location marker, popups.
- `components/incidentIcon.js` — builds colored marker icons by severity without external image assets.
- `components/SearchPanel.jsx` — the floating "From / To / Find Safe Route" search bar.
- `components/RouteInfoCard.jsx` — the floating card showing safety score, distance, ETA, and nearby incident count.
- `components/ReportIncidentModal.jsx` — the "Report Incident" form, using the user's current location.
- `pages/Dashboard.jsx` — combines the map, search panel, route card, and report modal into the main screen.
- `services/api.js` — the only file that talks to the backend; every component calls functions from here.
- `App.jsx` / `main.jsx` — top-level layout and app bootstrap.

## How the frontend works

`App.jsx` renders the `Sidebar` next to `Dashboard`. `Dashboard` owns the app's state: the list of incidents, the user's geolocation, the current map center, and any active route search. On mount, it fetches all incidents via `services/api.js` and asks the browser for the user's location. Submitting the search panel calls the `/nearby` endpoint around the user's current position and builds a demo route summary (distance/ETA are placeholder values for the MVP; the safety score and incident count are real). Reporting an incident opens a modal, and a successful submission adds the new incident straight into React state so it appears on the map immediately — no page refresh needed.

## How the backend works

`server.js` boots an Express app, enables CORS for your frontend's origin, connects to MongoDB Atlas via Mongoose, and mounts `/api/incidents`. The controller functions in `incidentController.js` handle three things: fetching every incident, fetching incidents near a point (using MongoDB's `$nearSphere` operator against the `2dsphere` index), and creating a new incident from a POST body. The safety score returned by the `/nearby` endpoint comes from `utils/safetyScore.js`, a single small function that can be swapped for something smarter later without changing any routes.

## How MongoDB geospatial queries work

Each incident's `location` field is stored in GeoJSON format: `{ type: "Point", coordinates: [longitude, latitude] }`. Because the schema declares a `2dsphere` index on that field, MongoDB can efficiently answer proximity questions natively — no manual latitude/longitude math in JavaScript. The `/api/incidents/nearby` endpoint uses the `$nearSphere` operator with `$geometry` (the query point) and `$maxDistance` (in meters) to ask MongoDB directly for every incident within range, sorted by distance automatically.

## How to run the project locally

See **Local Setup** above — in short:

```bash
# terminal 1
cd server && npm install && npm run seed && npm run dev

# terminal 2
cd client && npm install && npm run dev
```

## Exactly what to run to deploy

### Deploy the backend to Render

1. Push this repository to GitHub (see the section below).
2. Go to [render.com](https://render.com) → **New +** → **Web Service** → connect your GitHub repo.
3. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables in Render's dashboard:
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_ORIGIN` = your Vercel frontend URL (you'll get this in the next step — you can update it after)
5. Click **Create Web Service**. Render will give you a URL like `https://saferoute-api.onrender.com`.

### Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the same GitHub repo.
2. Set:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://saferoute-api.onrender.com`)
4. Click **Deploy**. Vercel will give you a URL like `https://saferoute.vercel.app`.
5. Go back to Render and update `CLIENT_ORIGIN` to this Vercel URL, then redeploy the backend so CORS allows it.

### MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. Under **Database → Connect → Drivers**, copy the connection string and paste it into `MONGODB_URI` (both locally in `server/.env` and in Render's environment variables).
5. Run `npm run seed` once (locally, pointed at your Atlas URI) to populate demo incidents.
