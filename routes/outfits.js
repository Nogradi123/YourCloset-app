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


// /:outfitId/addOutfit/:id
router.get('/create/:outfitId', (req,res,next)=>{
        // Item.findById(req.params.id).then((theItem)=> {
        //     let newOutfit = [];
        //     newOutfit.push(theItem.id)
            
        //     // allTheItems.forEach((eachItem) => {
        //     //     if(theItem.includes(eachItem.id)){
        //     //         newOutfit.push(eachItem);
        //     //     } 
        //     // });

        //     res.render('movies/edit-movie', {
        //         newOutfit: newOutfit,
        //         // movieID: req.params.movieID
        //     })
        // })

        // Outfit.findByIdAndUpdate(req.params.outfitId, { $push: {newOutfit: req.params.id}}, {new: true})
        //     .then(updatedOutfit => {

            // })
        Outfit.create({newOutfit: []}).then(newOutfit => {
            Item.find({owner: req.session.currentlyLoggedIn._id}).then(allItems => {
                const data = {
                    outfit: newOutfit,
                    allItems
                }

                console.log({newOutfitData: data});

                res.render('outfits/outfits', data);
            }).catch(err => next(err));
        }).catch(err => next(err));
})

router.post('/:id/updated/:outfitId', (req,res,next) => {
    // Item.findByIdAndUpdate(req.params.id, {
    //     title: req.body.title,
    //     genre: req.body.genre,
    //     plot: req.body.plot, 
    //     cast: req.body.cast
    // }).then(()=> {
    //     res.redirect('/movies/movies')
    // })

    // Outfit.findByIdAndUpdate(req.params.outfitId, { $push: {newOutfit: req.params.id}}, {new: true})
    //     .then(updatedOutfit => {
    //         Item.find({owner: req.session.currentlyLoggedIn._id}).then(allItems => {
    //             const data = {
    //                 outfit: updatedOutfit,
    //                 allItems
    //             }

    //             console.log({updatedOutfitData: data});

    //             res.render('outfits/outfits', data);
    //         }).catch(err => next(err));
    //     }).catch(err => next(err));


        Outfit.findById(req.params.outfitId)
        .then(foundOutfit => {
            
            Item.find({owner: req.session.currentlyLoggedIn._id}).then(allItems => {
                console.log(req.params.id)
                if(foundOutfit.newOutfit.includes(req.params.id)) {
                    foundOutfit.pull(req.params.id);
                } else {
                    foundOutfit.push(req.params.id);
                }

                foundOutfit.save().then(updatedOutfit => {
                    
                    const data = {
                        outfit: updatedOutfit,
                        allItems
                    }
    
                    console.log({updatedOutfitData: data});
    
                    res.render('outfits/outfits', data);
                }).catch(err => next(err));
            }).catch(err => next(err));
        }).catch(err => next(err));
})




module.exports = router;