const { default: mongoose } = require("mongoose");
const {Schema, model } = mongoose

const outfitSchema = new Schema ({
    name: String,
    image:  [
        { type: Schema.Types.ObjectId, ref: 'Item'},
    ],
    occasion:  [
        { type: Schema.Types.ObjectId, ref: 'Item'},
    ], 
}, {
    timestamps: true
})

const Outfit = model('Outfit', outfitSchema);
module.exports = Outfit;