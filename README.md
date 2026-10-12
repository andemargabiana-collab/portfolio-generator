# DevFolio - Portfolio Template Generator

DevFolio is a Portfolio Template Generator website that lets users enter their information, save it to an online database (MongoDB Atlas), choose from 3 portfolio templates (Simple, Modern, Creative), and generate a shareable portfolio.

Quick start
1. Open in Codespaces or clone the repo
2. Copy `.env.example` to `.env` and set `MONGODB_URI`
3. npm install
4. npm start
5. Open http://localhost:3000

Features
- Create, view, edit, delete portfolios
- Choose between 3 templates and preview the generated portfolio
- Stores data in an online MongoDB Atlas database

Files
- app.js - Express app
- models/Portfolio.js - Mongoose schema
- views/ - EJS templates (includes 3 template layouts)
- public/style.css - Styling

Do not commit secrets. Use environment variables on your host or Codespaces.
