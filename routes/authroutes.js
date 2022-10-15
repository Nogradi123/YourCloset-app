const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Item');
const nodemailer = require("nodemailer");
const bcryptjs = require('bcryptjs');

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
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'romina@code-art.com',
          pass: process.env.GMAILPASS
        }
      });
      
      var mailOptions = {
        from: 'hellocloset@info.com',
        to: newUser.email,
        subject: 'automated email sent with nodemailer',
        html: `<p>Thank you for signing up. Your username is ${newUser.username}</p>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          req.flash('success', 'Successfully Signed Up');
          req.session.currentlyLoggedIn = newUser;
          res.redirect('/profile');
        }
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
    User.findById(req.session.currentlyLoggedIn._id).populate('likes')
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