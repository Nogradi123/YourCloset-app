const { default: mongoose, SchemaType } = require("mongoose");
const { boolean } = require("webidl-conversions");


const {Schema, model} = mongoose;

const itemSchema  = new Schema ({
    itemName: String,
    type: {
        type: String,
        enum: ["Top", "Bottom", "Footwear"]
    },
    size: String,
    brand: String,
    color: String, 
    description: String,
    available: Boolean,
    category: {type: [{type: Schema.Types.ObjectId, ref:'Outfit'}]},
    
}, {
    timestamps: true
})

const Item = model('Item', itemSchema);
module.exports = Item;