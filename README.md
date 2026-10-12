# Portfolio Generator

Minimal Portfolio Template Generator (Node.js + Express + MongoDB)

Features
- Create / Save portfolio information
- Choose one of 3 templates (Simple / Modern / Creative)
- Preview, Edit, Delete portfolios
- Uses MongoDB Atlas (online DB)

Setup
1. Open this repository in GitHub Codespaces or clone locally.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`.
3. Install dependencies: `npm install`
4. Run: `npm start` (or `npm run dev` if using Codespace/Dev)
5. Open http://localhost:3000

Files of interest
- app.js - main Express app
- models/Portfolio.js - Mongoose schema
- views/ - EJS views
- public/style.css - basic styles
- .env.example - environment example

Notes
- Do NOT commit secrets. Use environment variables in Codespaces or your host.
