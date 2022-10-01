// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo');
let flash = require('connect-flash');


// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;



app.use(
    session({
      secret: '123secret',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 600000
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/lab-movies-celebrities'
      })
    })
  );
  
  app.use(flash());

  app.use(function (req, res, next) {
    res.locals.theUser = req.session.currentlyLoggedIn;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
  })

// 👇 Start handling routes here
const index = require('./routes/index');
const itemsRoute = require('./routes/items.js');
const outfitsRoute = require('./routes/outfits.js');
const authroutes = require('./routes/authroutes');

app.use('/', index);
app.use('/items', itemsRoute);
app.use('/outfits', outfitsRoute);
app.use('/', authroutes)



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
