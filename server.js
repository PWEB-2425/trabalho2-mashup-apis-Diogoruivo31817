
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const bcrypt     = require('bcryptjs');
const axios      = require('axios');
const path       = require('path');

const app = express();


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [REQUEST] ${req.method} ${req.url}`);
  next();
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB conectado'))
  .catch(err => console.error('✗ Erro MongoDB:', err));


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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/',    (req, res) => res.send('root OK'));
app.get('/ping', (req, res) => res.send('pong'));


function ensureAuth(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login.html');
}


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ username, password: hash });
    req.session.userId = u._id;
    res.redirect('/pesquisa.html');
  } catch {
    res.redirect('/register.html');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ username });
  if (u && await bcrypt.compare(password, u.password)) {
    req.session.userId = u._id;
    return res.redirect('/pesquisa.html');
  }
  res.redirect('/login.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});


app.get('/api/search', ensureAuth, async (req, res) => {
  try {
    const city = req.query.q;
    
    const w = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: process.env.OWM_KEY, units: 'metric' }
    });
    
    const code = w.data.sys.country;
    const c    = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    
    await Search.create({ user: req.session.userId, term: city });
   
    return res.json({
      weather: {
        city:       w.data.name,
        temp:       w.data.main.temp,
        desc:       w.data.weather[0].description,
        feels_like: w.data.main.feels_like,
        humidity:   w.data.main.humidity,
        windSpeed:  w.data.wind.speed
      },
      country: {
        name:       c.data[0].name.common,
        capital:    c.data[0].capital[0],
        population: c.data[0].population,
        flag:       c.data[0].flags.png,
        region:     c.data[0].region,
        languages:  Object.values(c.data[0].languages).join(', '),
        currencies: Object.values(c.data[0].currencies).map(cur => cur.name).join(', ')
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro na pesquisa' });
  }
});


app.get('/history', ensureAuth, async (req, res) => {
  try {
    const docs = await Search
      .find({ user: req.session.userId })
      .sort({ date: -1 })
      .lean();
    const history = docs.map(d => ({
      term: d.term,
      date: d.date.toISOString()
    }));
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível obter o histórico.' });
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Servidor a correr em http://localhost:${port}`)
);




