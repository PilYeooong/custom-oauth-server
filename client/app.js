const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const db = require('./models');

const indexRouter = require('./routes');
const oauthRouter = require('./routes/oauth');

dotenv.config();

const app = express();

const PORT = 4000;

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

app.use('/', indexRouter);
app.use('/oauth', oauthRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})