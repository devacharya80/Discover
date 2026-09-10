# Discover

Discover is a full-stack web application for exploring and discovering companies through an interactive, location-based map.

The project is currently under active development. The core application architecture and several major features have already been implemented, with additional functionality being developed.

## 🚧 Project Status

**Work in Progress**

Discover is an actively developed project. Features, architecture, and UI are continuously being improved as development progresses.

## ✨ Features

- 🗺️ Interactive map-based company discovery
- 📍 User geolocation
- 📏 Distance calculation between the user and companies
- 🏢 Company markers on the map
- 💬 Interactive company popups
- 🔎 Company detail pages
- 🧭 Client-side navigation
- 🔌 REST APIs for company data
- 🗄️ Database-backed company information
- 📱 Responsive user interface

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- MapLibre
- Motion

### Backend

- Node.js
- Express
- TypeScript

### Database

- PostgreSQL
- PostGIS
- Prisma ORM

## 🏗️ Architecture

```text
┌─────────────────────┐
│      React App      │
│     TypeScript      │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│   Express Backend   │
│     Node.js + TS    │
└──────────┬──────────┘
           │
           │ Prisma ORM
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│       PostGIS       │
└─────────────────────┘