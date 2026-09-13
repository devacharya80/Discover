# Discover

> A full-stack location-based company discovery platform built with React, TypeScript, Node.js, PostgreSQL, PostGIS, and Prisma.

**Status:** 🚧 In active development

## Overview

Discover helps users explore companies through an interactive map. The application combines geolocation, distance calculation, map-based company markers, company details, and a REST API backed by PostgreSQL/PostGIS.

The project is intentionally being developed as a production-oriented full-stack application, with additional features and deployment improvements planned as development continues.

## ✨ Current Features

- 🗺️ Interactive map-based company discovery
- 📍 User geolocation
- 📏 Distance calculation between the user and companies
- 🏢 Company markers and interactive popups
- 🔎 Company detail pages
- 🧭 Client-side navigation
- 🔌 REST APIs for company data
- 🗄️ Database-backed company information
- 📱 Responsive user interface

## 🏗️ Architecture

```text
┌─────────────────────────┐
│   React + TypeScript    │
│     Frontend / UI       │
└────────────┬────────────┘
             │ REST API
             ▼
┌─────────────────────────┐
│ Node.js + Express + TS  │
│        Backend          │
└────────────┬────────────┘
             │ Prisma ORM
             ▼
┌─────────────────────────┐
│ PostgreSQL + PostGIS    │
│   Location-aware data   │
└─────────────────────────┘
```

## 🛠️ Tech Stack

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

**Database**
- PostgreSQL
- PostGIS
- Prisma ORM

## 🎯 Why I Built It

Discover is a practical project for learning and applying full-stack engineering concepts including REST API design, database modeling, geospatial data, frontend routing, map-based interfaces, and the separation of frontend and backend responsibilities.

## 🚧 Roadmap

Planned improvements include additional discovery and filtering capabilities, production deployment, containerization, and automated CI/CD as the project matures.

## 👨‍💻 Author

**Devacharya**

GitHub: https://github.com/devacharya80

---

> This repository is a work in progress. Features and architecture may change as development continues.
