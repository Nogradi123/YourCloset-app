const express = require('express');
const router = express.Router();
const Items = require('../models/Item');
// const uploadMiddleware = require('../config/cloudinary');
const { createMochaInstanceAlreadyRunningError } = require('mocha/lib/errors');
const User = require('../models/User')

router.get('/create', (req, res, next) => {
    res.render('items/new-item')
})


    router.post('/create', (req, res, next) => {
        console.log (req.session.currentlyLoggedIn._id)

        const newItem = {
            itemName: req.body.itemName,
            type: req.body.type,
            size: req.body.size,
            brand: req.body.brand,
            color: req.body.color,
            description: req.body.description,
            category: req.body.category,
            
        } 
        
   Items.create(newItem)
.then(newlyCreatedItem => {
 res.redirect('/items/items');
    }).catch(err => {
        console.log({err});
    })
});



router.get('/items', (req,res,next) => {
    // console.log({query: req.query})

    Items.find()
    .then((itemsFromDb) => {
        console.log({itemsFromDb})
        console.log(req.params.category)

        data = {
            items: itemsFromDb
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

router.post('/items/:id', (req, res, next)=>{
    Items.findByIdAndUpdate(req.params.id, {
        itemName: req.body.itemName,
        type: req.body.type,
        size: req.body.size,
        brand: req.body.brand,
        color: req.body.color,
        description: req.body.description,
        category: req.body.category,
        owner: req.session.currentlyLoggedIn._id
        
    }).then(()=>{
        
        res.redirect('/items/items'+ req.params.id);

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

module.exports = router;