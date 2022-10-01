const { default: mongoose, SchemaType } = require("mongoose");
const {Schema, model} = mongoose;

const itemSchema  = new Schema ({
    itemName: String,
    image: String,
    type: {
        type: String,
        enum: ["Top", "Bottom", "Footwear"]
    },
    size: Number,
    brand: String,
    color: String, 
    description: String,
    category: {
        type: [String],
        enum: ["Casual", "Activewear", "Going Out", "Work", "Formal"]
    },
    owner: {type: [{type: Schema.Types.ObjectId, ref:'User'}]},
    
}, {
    timestamps: true
})

const Item = model('Item', itemSchema);
module.exports = Item;