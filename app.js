
require('dotenv/config');


require('./db');


const express = require('express');


const hbs = require('hbs');

const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo');
let flash = require('connect-flash');




require('./config')(app);


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
      }, 
      store: MongoStore.create({
        mongoUrl: `mongodb+srv://nickdb:${process.env.MONGOPASSWORD}@nickycluster.d24axft.mongodb.net/?retryWrites=true&w=majority`;
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

  // app.use((req,res,next)=> {
  //   res.locals.currentUser = req.session.theUser
  //   next();
  // })


const index = require('./routes/index');
const itemsRoute = require('./routes/items.js');
const outfitsRoute = require('./routes/outfits.js');
const authroutes = require('./routes/authroutes');

app.use('/outfits', outfitsRoute);
app.use('/', index);
app.use('/items', itemsRoute);
app.use('/', authroutes)



require('./error-handling')(app);

module.exports = app;
