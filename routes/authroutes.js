const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Item');
const nodemailer = require("nodemailer");
const bcryptjs = require('bcryptjs');
const axios = require("axios");

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.post('/signup', (req,res,next) => {
    const saltRounds = 12;
    
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(req.body.password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
      User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
    }).then((newUser)=>{
      const data = {
        personalizations:[{to:[{email: req.body.email}],
        subject:"Thank you for signing up!! " + req.body.username}],
        from:{email: process.env.GMAILUSERNAME},
        content:[{type:"text/plain",value:"Hello, World!"}]
      }

      const options = {
        method: 'POST',
        url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '7551bd998fmshcd2c2220e76f8e9p1add01jsne453ce90f67f',
          'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
        },
        data: JSON.stringify(data)
      };
      
      axios.request(options).then(function (response) {
        console.log(response);
        res.redirect("/login");
      }).catch(function (error) {
        console.error(error);
      });
    })
    })
    .catch(error => next(error));
});

router.get('/login', (req, res, next)=>{
    res.render('auth/login');
  })
  
  router.post('/login', (req, res, next) => {
    if (req.body.username === '' || req.body.password === '') {
      req.flash('error', 'Please make sure to fill in both fields');
      res.redirect('/login');
      return;
    }
   
    User.findOne({ username: req.body.username })
      .then(resultFromDB => {
        if (!resultFromDB) {
          req.flash('error', 'could not find that username')
          res.redirect('/login');
          return;
        } else if (bcryptjs.compareSync(req.body.password, resultFromDB.password)) {
          console.log("found user", resultFromDB);
          req.session.currentlyLoggedIn = resultFromDB;

          req.flash('success', 'Welcome ' + resultFromDB.username);
          res.redirect('/items/items');
          return;
        } else {
          req.flash('error', 'this username/password combination could not be authenticated. please try again');
          res.redirect('/login');
        }
      })
      .catch(error => console.log(error));
  });
  
  
  router.get('/profile', (req, res, next)=>{
    User.findById(req.session.currentlyLoggedIn._id).populate({ 
      path: 'likes',
      populate: {
        path: 'items',
        model: 'Item'
      } 
   })
    .then((theUser)=>{
      console.log(theUser.id);
      res.render('auth/profile', {theUser: theUser})
    })
    .catch((err)=>{
      console.log(err)
    })
  })

  router.post('/like/:outfitId', (req, res, next)=>{

    let ids = req.params.outfitId;
    console.log({id_I_want: ids})

        User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, 
          {$addToSet: {likes: ids}})
            .then((result)=>{
              console.log(result)
                res.redirect('/outfits/outfits');
            })
            .catch((err)=>{
                console.log(err)
            })
})
    
  
  
  router.post('/logout', (req, res, next)=>{
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  })
  
  router.get('/change-password', (req, res, next)=>{
    res.render("auth/changepassword", {theUser: req.session.currentlyLoggedIn});
  })
  
  
  router.post('/new-password', (req, res, next)=>{
  
    if(req.body.newpass !== req.body.confirmnewpass){
      res.redirect("/profile")
      // need to show an error message here but cant yet
    }
  
    User.findById(req.session.currentlyLoggedIn._id)
    .then(resultFromDB => {
       if (bcryptjs.compareSync(req.body.oldpass, resultFromDB.password)) {
        const saltRounds = 12;
        bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(req.body.newpass, salt))
        .then(hashedPassword => {
          
          User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
            password: hashedPassword
          })
          .then(()=>{
            res.redirect('/profile');
  
          })
        })
          .catch((err)=>{
            next(err);
          })
    }
  })
  })
  

  
    


module.exports = router;