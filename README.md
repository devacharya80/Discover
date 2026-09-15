# Discover — Geospatial Company Discovery Platform

> A full-stack company discovery platform that combines interactive maps, geolocation, distance-based discovery, and a PostgreSQL/PostGIS backend.

**Status:** 🚧 Active development

## Overview

Discover helps users find and explore companies through an interactive map. It combines a React/TypeScript frontend with a Node.js/Express API and a PostgreSQL database using PostGIS for location-aware data.

The project is designed around a clean separation between the UI, API, and persistence layers.

## Key Features

- 🗺️ Interactive map-based company discovery
- 📍 Browser geolocation
- 📏 Distance calculation between users and companies
- 🏢 Company markers and interactive popups
- 🔎 Company detail pages
- 🧭 Client-side routing
- 🔌 REST API for company data
- 🗄️ PostgreSQL/PostGIS-backed location data
- 📱 Responsive interface

## Architecture

```text
┌────────────────────────────┐
│     React + TypeScript     │
│  Map UI / Routing / Views  │
└─────────────┬──────────────┘
              │ REST API
              ▼
┌────────────────────────────┐
│   Node.js + Express + TS   │
│      API / Business Logic  │
└─────────────┬──────────────┘
              │ Prisma ORM
              ▼
┌────────────────────────────┐
│      PostgreSQL + PostGIS  │
│     Location-aware data    │
└────────────────────────────┘
```

## Tech Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- React Router
- MapLibre
- Motion

**Backend**
- Node.js
- Express
- TypeScript
- REST APIs

**Data**
- PostgreSQL
- PostGIS
- Prisma ORM

## Engineering Highlights

- Separates frontend, backend, and persistence concerns
- Uses geospatial database capabilities rather than treating location as plain text
- Uses Prisma as the data-access layer over PostgreSQL
- Exposes company data through a backend API
- Builds map interactions around real user geolocation

## Project Structure

```text
Discover/
├── frontend/   # React + TypeScript application
├── backend/    # Node.js + Express API
└── README.md
```

## Roadmap

- Advanced search and filtering
- Production deployment
- Dockerized development/production setup
- Automated tests
- CI/CD
- Natural-language discovery using retrieval/LLM workflows

> The RAG/LLM functionality is part of the roadmap and is not represented as a completed feature yet.

## Author

**Devacharya** — Full-Stack Developer | MERN | TypeScript | AI

[GitHub](https://github.com/devacharya80)
