const { default: mongoose } = require("mongoose");
const {Schema, model } = mongoose

const outfitSchema = new Schema ({
    name: String,
    items:  [
        { type: Schema.Types.ObjectId, ref: 'Item'},
    ], 
    owner: {type: Schema.Types.ObjectId, ref:'User'}
}, {
    timestamps: true
})

const Outfit = model('Outfit', outfitSchema);
module.exports = Outfit;