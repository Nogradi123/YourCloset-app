const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Outfit = require('../models/Outfit');
const User = require('../models/User');


router.get('/create', (req, res, next) => {
    
    Item.find(req.params.id)
    .then((itemsFromDb) => {

        data = {
            items: itemsFromDb
        }

        res.render('outfits/outfit-details', data)
    }).catch((err) => {
        res.redirect('/outfits')
    })
})

// router.post('/create', (req,res,next) => {
//     console.log(req.body)

//     const itemsToCreate = {
//         title: req.body.title,
//         genre: req.body.genre,
//         plot: req.body.plot, 
//         cast: req.body.cast
//     }


//     Item.create(moviesToCreate).then(newlyCreatedMovie => {
//         // console.log(newlyCreatedMovie)
        
//         res.redirect('/outfits/create')
//     }).catch((err) => {
//         console.log({err})
//     })
// })

router.get('/outfits', (req,res,next) => {
    // console.log({query: req.query})
   
    Item.find(req.params.id)
    .then((itemsFromDb) => {
        
        data = {
            items: itemsFromDb
         }
    
        res.render('outfits/outfits', data)
    }).catch((err) => {
        console.log(err)
        res.redirect('/outfits')
     })
})

 router.get('/:id', (req,res,next) => {
    console.log(req.params.id)
    

    Item.findById(req.params.id).populate('cast')
    .then((movieFromDb) => {
        User.find({likes: req.params.id}).then((usersWhoLiked) => {
            res.render('movies/movie-details', {movie: movieFromDb, likes: usersWhoLiked.length});
        })
        
    }).catch((err) => {
        console.log(err)
    })
 })


 router.post('/:id', (req,res,next)=>{
    Item.findByIdAndRemove(req.params.id)
    .then(()=> {
        res.redirect('/movies/movies')
    })
    .catch((err) => {
        console.log(err)
    })
 })



router.get('/:id/edit', (req,res,next)=>{
    Outfit.find()
    .then((allTheCelebrities) => {
        Item.findById(req.params.id).then((theMovie)=> {
            let myCelebrities = [];
            let otherCelebrities = [];
            allTheCelebrities.forEach((eachCelebrity) => {
                if(theMovie.cast.includes(eachCelebrity.id)){
                    myCelebrities.push(eachCelebrity);
                } else {
                    otherCelebrities.push(eachCelebrity)
                }
            });

            res.render('movies/edit-movie', {
                myCelebrities: myCelebrities,
                otherCelebrities: otherCelebrities,
                movieID: req.params.movieID
            })
        })

    })
})

router.post('/:id/edit', (req,res,next) => {
    Item.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: req.body.genre,
        plot: req.body.plot, 
        cast: req.body.cast
    }).then(()=> {
        res.redirect('/movies/movies')
    })
})




module.exports = router;