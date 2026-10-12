// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const Portfolio = require('./models/Portfolio');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Please set MONGODB_URI in .env");
  process.exit(1);
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes

// Home
app.get('/', (req, res) => {
  res.render('index');
});

// Create form
app.get('/portfolios/create', (req, res) => {
  res.render('create');
});

// Save portfolio
app.post('/portfolios', async (req, res) => {
  try {
    const data = {
      fullName: req.body.fullName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      aboutMe: req.body.aboutMe,
      profileImageUrl: req.body.profileImageUrl,
      templateChoice: req.body.templateChoice || 'simple',
      educations: parseList(req.body.educations),
      skills: parseList(req.body.skills),
      projects: parseProjects(req.body),
      experiences: parseExperiences(req.body),
      socialLinks: parseSocials(req.body)
    };
    const p = new Portfolio(data);
    await p.save();
    res.redirect(`/portfolios/${p._id}/preview`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving portfolio');
  }
});

// Manage (list)
app.get('/portfolios', async (req, res) => {
  const list = await Portfolio.find().sort({ createdAt: -1 });
  res.render('manage', { portfolios: list });
});

// Edit form
app.get('/portfolios/:id/edit', async (req, res) => {
  const p = await Portfolio.findById(req.params.id);
  if (!p) return res.status(404).send('Not found');
  res.render('edit', { portfolio: p });
});

// Update
app.put('/portfolios/:id', async (req, res) => {
  try {
    const update = {
      fullName: req.body.fullName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      aboutMe: req.body.aboutMe,
      profileImageUrl: req.body.profileImageUrl,
      templateChoice: req.body.templateChoice || 'simple',
      educations: parseList(req.body.educations),
      skills: parseList(req.body.skills),
      projects: parseProjects(req.body),
      experiences: parseExperiences(req.body),
      socialLinks: parseSocials(req.body)
    };
    await Portfolio.findByIdAndUpdate(req.params.id, update);
    res.redirect(`/portfolios/${req.params.id}/preview`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Update error');
  }
});

// Delete
app.post('/portfolios/:id/delete', async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  res.redirect('/portfolios');
});

// Template selection (simple page to choose template for an existing portfolio)
app.get('/portfolios/:id/choose-template', async (req, res) => {
  const p = await Portfolio.findById(req.params.id);
  if (!p) return res.status(404).send('Not found');
  res.render('choose-template', { portfolio: p });
});

app.post('/portfolios/:id/set-template', async (req, res) => {
  const t = req.body.templateChoice || 'simple';
  await Portfolio.findByIdAndUpdate(req.params.id, { templateChoice: t });
  res.redirect(`/portfolios/${req.params.id}/preview`);
});

// Preview (render the selected template)
app.get('/portfolios/:id/preview', async (req, res) => {
  const p = await Portfolio.findById(req.params.id);
  if (!p) return res.status(404).send('Not found');
  res.render('preview', { portfolio: p });
});

// Public view (shareable)
app.get('/p/:id', async (req, res) => {
  const p = await Portfolio.findById(req.params.id);
  if (!p) return res.status(404).send('Not found');
  res.render('preview', { portfolio: p });
});

// Utilities to parse form lists (simple CSV-like)
function parseList(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field.map(s => s.trim()).filter(Boolean);
  return field.split(',').map(s => s.trim()).filter(Boolean);
}
function parseProjects(body) {
  // expects projectTitle[], projectDesc[], projectLink[]
  const titles = asArray(body.projectTitle);
  const descs = asArray(body.projectDesc);
  const links = asArray(body.projectLink);
  const out = [];
  for (let i=0;i<titles.length;i++){
    if (!titles[i]) continue;
    out.push({ title: titles[i], description: descs[i]||'', link: links[i]||'' });
  }
  return out;
}
function parseExperiences(body) {
  const companies = asArray(body.expCompany);
  const positions = asArray(body.expPosition);
  const details = asArray(body.expDetails);
  const out = [];
  for (let i=0;i<companies.length;i++){
    if (!companies[i]) continue;
    out.push({ company: companies[i], position: positions[i]||'', details: details[i]||'' });
  }
  return out;
}
function parseSocials(body) {
  const platforms = asArray(body.socialPlatform);
  const urls = asArray(body.socialUrl);
  const out = [];
  for (let i=0;i<platforms.length;i++){
    if (!platforms[i] || !urls[i]) continue;
    out.push({ platform: platforms[i], url: urls[i] });
  }
  return out;
}
function asArray(val){
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
