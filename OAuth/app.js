const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const nunjucks = require('nunjucks');
const cors = require('cors');

const db = require('./models');

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const v1 = require('./routes/v1');

dotenv.config();

const app = express();
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

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/v1', v1);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
