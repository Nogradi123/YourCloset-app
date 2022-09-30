const { default: mongoose } = require("mongoose");

//  Add your code here
const {Schema, model } = mongoose

const outfitSchema = new Schema ({
    name: String,
    occupation: String,
    catchPhrase: String
})

const Outfit = model('Outfit', outfitSchema);
module.exports = Outfit;