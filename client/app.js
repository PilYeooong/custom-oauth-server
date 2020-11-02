const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const db = require('./models');

const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const oauthRouter = require('./routes/oauth');

dotenv.config();

const app = express();
const PORT = 4000;

passportConfig();
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

db.sequelize
  .sync({ force: false })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/oauth', oauthRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})