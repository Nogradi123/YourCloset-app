const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const Item = require('../models/Item');
const Outfit = require('../models/Outfit');
const User = require('../models/User');


// /:outfitId/addOutfit/:id
router.get('/create',(req,res,next)=>{
    if(!req.session.currentlyLoggedIn) {
        res.redirect('/login')
    }

    Item.find()
    .then(allItems => {
        res.render("outfits/createOutfit", {allItems: allItems})
    }).catch(err => {
        console.log(err)
    })
    
})

router.post('/create', (req,res,next) => {
    console.log(req.body)

    const outfitToCreate = {
        items: req.body.items,
        owner: req.body.owner[0]
    }

    Outfit.create(outfitToCreate)
    .then(newlyCreatedOutfit => {
        User.findById(req.session.currentlyLoggedIn._id)
        .then((theUserObject)=>{
            console.log(theUserObject);
            Outfit.findByIdAndUpdate(theUserObject.outfits, {
                $push: {items: newlyCreatedOutfit},
            })
            .then((updatedOufit)=>{
                res.redirect(`/outfits/outfits`);
            })
        })
    }).catch(err => {
        console.log({err});
    })

    router.get("/outfits", (req,res,next) => {
        Outfit.find({owner: req.session.currentlyLoggedIn._id}).populate('items').then(allOutfits => {
            res.render('outfits/outfits', {allOutfits: allOutfits})
        })
    })

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


        // Outfit.findById(req.params.outfitId)
        // .then(foundOutfit => {
            
        //     Item.find({owner: req.session.currentlyLoggedIn._id}).then(allItems => {
        //         console.log({items: req.params.id})
        //         console.log({issue:foundOutfit.allItems})
        //         if(foundOutfit.newItems.includes(req.params.id)) {
        //             foundOutfit.newItems.pull(req.params.id);
        //         } else {
        //             foundOutfit.newItems.push(req.params.id);
        //         }

        //         foundOutfit.save().then(updatedOutfit => {
                    
        //             const data = {
        //                 outfit: updatedOutfit,
        //                 allItems
        //             }
    
        //             console.log({updatedOutfitData: data.allItems});
        //             // ?outfitId=${updatedOutfit._id}
        //             res.render(`outfits/outfit-details?outfitId=${updatedOutfit._id}`, data);
        //         }).catch(err => next(err));
        //     }).catch(err => next(err));
        // }).catch(err => next(err));
})





module.exports = router;