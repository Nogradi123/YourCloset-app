
const express = require('express');
const router = express.Router();
const Items = require('../models/Item');
const uploadMiddleware = require('../config/cloudinary');
const User = require('../models/User');
const { timers } = require('jquery');

router.get('/create', (req, res, next) => {
    res.render('items/new-item', {type: ["T-Shirt", "Footwear", "Jewelry", "Dress", "Short", "Skirt", "Romper", "Jacket", "Coat", "Sweater", "Pant", "Jean", "Accessories"]})
});


router.post('/create', uploadMiddleware.single("itemIMG"), (req, res, next) => {
    console.log (req.session.currentlyLoggedIn._id)
        const newItem = {
            itemName: req.body.itemName,
            type: req.body.type,
            size: req.body.size, 
            brand: req.body.brand,
            color: req.body.color,
            description: req.body.description,
            category: req.body.category,
            owner: req.session.currentlyLoggedIn._id,
            image: req.file.path
        } 
        console.log({newItem, body: req.body})
        Items.create(newItem)
        .then(newlyCreatedItem => {
            console.log({newItem: newlyCreatedItem})
        res.redirect('/items/items');
            }).catch(err => {
                 console.log({err});
            })
});




router.get('/items', (req,res,next) => {
    
    Items.find({owner: req.session.currentlyLoggedIn._id})
    .then((itemsFromDb) => {

        data = {
            items: itemsFromDb,
            
        }
        
        res.render('items/items', data)
    }).catch((err) => {
        console.log(err)
    })
})



///================== Edit ======

router.get('/:id/edit', (req, res, next) => {
    Items.findById(req.params.id)
    .then(itemsFromDb => {
        console.log(itemsFromDb);
        res.render('items/edit-item', itemsFromDb);
}).catch(err => {console.log({err})});
})

router.post('/update/:id', (req, res, next)=>{
    Items.findByIdAndUpdate(req.params.id, {
        itemName: req.body.itemName,
        type: req.body.type,
        size: req.body.size,
        brand: req.body.brand,
        color: req.body.color,
        description: req.body.description,
        category: req.body.category,
        
    }).then(()=>{
        
        res.redirect('/items/items');

    }).catch((err)=>{
        console.log(err);
    })

});

///================== Delete ======

router.post('/:id/delete', (req, res, next)=>{

    Items.findByIdAndRemove(req.params.id)
    .then((response)=>{
        res.redirect('/items/items');
    })
    .catch((err)=>{
        console.log(err);
    })

});

router.get('/items/:sort', (req,res,next) => {
    let sortBy;
    if(req.params.sort === "recent"){
        sortBy = -1;
    } else {
        sortBy = 1;
    }

    Items.find().sort({createdAt: sortBy})
    .then((itemsFromDb) => {
        data = {
            items: itemsFromDb,
            recent: req.params.sort === "recent"? true : false
        }

        res.render("items/items", data)
    }).catch(err => {
        console.log(err);
        next(err);
    })
})


//=====Filtering======

router.get('/filter', (req, res, next) => {
    console.log(req.query)

    Items.find({type: req.query.type})
    .then((filteredType)=> {
        
        res.render('items/items', {items: filteredType})
    }).catch(err => {
        console.log(err)
    })
})



module.exports = router;