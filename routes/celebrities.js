const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit')


router.get('/create', (req, res, next) => {
    res.render('celebrities/new-celebrity')
})

router.post('/create', (req,res,next) => {
    // console.log(req.body)

    const celebritiesToCreate = {
        name: req.body.name,
        occupation: req.body.occupation,
        catchPhrase: req.body.catchPhrase
    }

    Outfit.create(celebritiesToCreate).then(newlyCreatedCeleb => {
        // console.log(newlyCreatedCeleb)

        res.redirect('/celebrities/celebrities')
    }).catch((err) => {
        console.log({err})
    })
})

router.get('/celebrities', (req,res,next) => {
    // console.log({query: req.query})

    Outfit.find()
    .then((celebritiesFromDb) => {
        console.log({celebritiesFromDb})

        data = {
            celebrities: celebritiesFromDb
        }

        res.render('celebrities/celebrities', data)
    }).catch((err) => {
        console.log(err)
    })
})


module.exports = router;