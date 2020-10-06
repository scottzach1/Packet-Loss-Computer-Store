const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const db = require('./server/controller/db')
const path = require('path')


const routes = require('./client/routes');
const app = express();
const store = require('connect-mongodb-session')(session);

app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/client'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
//  store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  },
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/', routes);

db.connectToServer((error) =>{
  if(error){
    console.log('could not connect to the database');
  }else {
    console.log('Connected to database ')
  }
})

app.listen(3000, () => {
  console.log('Listening on 3000');
});

module.exports = app;
