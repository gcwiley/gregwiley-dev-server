# Introduction

A robust, modern **Node.js / Express** REST API backend powering my personal project tracker web application. It connects to **MongoDB** (via Mongoose), integrates with **Firebase Authentication** & **Firebase Storage**, and is structured to serve the compiled Angular frontend SPA.

---

## Features

- **Project Management**: Full CRUD endpoints for managing projects, including paginated list, search, and count functionality.

## Tech Stack

- **Runtime**: Node.js 24 (ESM modules — `"type": "module"` in package.json)
- **Framework**: Express 4
- **Database**: MongoDB (Mongoose)
- **Auth**: Firebase Admin SDK — verifies Firebase ID tokens (JWT Bearer tokens)
- **File Storage**: Firebase/Google Cloud Storage (via `firebase-admin`)
- **Deploy Target**: Google App Engine (`app.yaml`, nodejs24 runtime)

## Running the Project

```bash
npm run dev     # development (nodemon)
npm start       # production (node)
