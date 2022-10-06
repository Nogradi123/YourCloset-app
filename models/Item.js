const { default: mongoose, SchemaType } = require("mongoose");
const {Schema, model} = mongoose;

const itemSchema  = new Schema ({
    itemName: String,
    image: String,
    type: {
        type: String,
        enum: ["T-Shirt", "Footwear", "Jewelry", "Dress", "Short", "Skirt", "Romper", "Jacket", "Coat", "Sweater", "Pant", "Jean", "Accessories"]
    },
    size: String,
    brand: String,
    color: String, 
    description: String,
    category: {
        type: [String],
        enum: ["Casual", "Activewear", "Going Out", "Work", "Formal"]
    },
    owner: {type: Schema.Types.ObjectId, ref:'User'},
    
}, {
    timestamps: true
})

const Item = model('Item', itemSchema);
module.exports = Item;