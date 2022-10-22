const express = require('express');
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

    })


    router.get("/outfits", (req,res,next) => {
        Outfit.find({owner: req.session.currentlyLoggedIn._id}).populate('items').populate('owner').then(allOutfits => {
            res.render('outfits/outfits', {allOutfits: allOutfits})
        })
    })
//==== delete outfits=======
    router.post('/:id/delete', (req, res, next)=>{

    Outfit.findByIdAndRemove(req.params.id)
    .then((response)=>{
        res.redirect('/outfits/outfits');
    })
    .catch((err)=>{
        console.log(err);
    })

});

//==== delete items inside an outfit=======  

router.post('/:itemId/removeItem/:outfitId', (req, res, next)=>{
    console.log({items: req.params.itemId})
    console.log({outfit: req.params.outfitId})

    Outfit.findByIdAndUpdate(req.params.outfitId, {
        $pull: {items: req.params.itemId}
    })
    .then((response) => {
        res.redirect('/outfits/outfits')
    }).catch((err) => {
        console.log(err)
    })

});




router.get('/outfits/:sort', (req,res,next) => {
    let sortBy;
    if(req.params.sort === "recent"){
        sortBy = -1;
    } else {
        sortBy = 1;
    }

    Outfit.find().sort({createdAt: sortBy}).populate('items')
    .then((outfitsFromDb) => {
        console.log({outfits: outfitsFromDb})
        data = {
            outfits: outfitsFromDb,
            recent: req.params.sort === "recent"? true : false
        }

        res.render("outfits/outfits", data)
    }).catch(err => {
        console.log(err);
        next(err);
    })
})





// =========== soon to be used feature =================== 
// router.get('/like/:outfitId', (req,res,next) => {
//     console.log(req.params.outfitId)
    

//     Outfit.findById(req.params.outfitId).populate('items')
//     .then((outfitsFromDb) => {
//         User.find({likes: req.params.outfitId}).then((usersWhoLiked) => {
//             res.render('outfits/outfits', {outfits: outfitsFromDb, likes: usersWhoLiked.length});
//         })
        
//     }).catch((err) => {
//         console.log(err)
//     })
//  })











module.exports = router;