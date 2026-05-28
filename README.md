# gregwiley.dev Server

## Overview

A Node.js/Express REST API backend for my personal code project tracker application. Serves an Angular SPA from `dist/gregwiley-dev-client/browser` and exposes a JSON API under `/api`.

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
