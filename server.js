// server.js
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const bcrypt     = require('bcryptjs');
const axios      = require('axios');
const path       = require('path');

const app = express();

// 1) Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB conectado'))
  .catch(err => console.error('✗ Erro MongoDB:', err));

// 2) Definir modelos
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

const searchSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  term:   String,
  date:   { type: Date, default: Date.now }
});
const Search = mongoose.model('Search', searchSchema);

// 3) Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// 4) Servir ficheiros estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 5) Proteção de rotas
function ensureAuth(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login.html');
}

// 6) Rotas de autenticação

// Registo
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ username, password: hash });
    req.session.userId = u._id;
    res.redirect('/pesquisa.html');
  } catch (e) {
    console.error(e);
    res.redirect('/register.html');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ username });
  if (u && await bcrypt.compare(password, u.password)) {
    req.session.userId = u._id;
    return res.redirect('/pesquisa.html');
  }
  res.redirect('/login.html');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// 7) Rota mashup clima + país
app.get('/api/search', ensureAuth, async (req, res) => {
  try {
    const city = req.query.q;
    // a) OpenWeather
    const w = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      { params: { q: city, appid: process.env.OWM_KEY, units: 'metric' } }
    );
    // b) RestCountries
    const code = w.data.sys.country;
    const c    = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    // c) Guardar histórico
    await Search.create({ user: req.session.userId, term: city });
    // d) Responder JSON
    res.json({
      weather: {
        city: w.data.name,
        temp: w.data.main.temp,
        desc: w.data.weather[0].description
      },
      country: {
        name:       c.data[0].name.common,
        capital:    c.data[0].capital[0],
        population: c.data[0].population,
        flag:       c.data[0].flags.png
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro na pesquisa' });
  }
});

// 8) Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor a correr em http://localhost:${port}`);
});

