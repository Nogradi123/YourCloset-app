const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema ({
   
    username: String,
    password: String,
    email: String,
    likes:  [
        { type: Schema.Types.ObjectId, ref: 'Item'}
    ]
}, {
    timestamps: true
})

const User = model('User', userSchema);
// by putting 'Animal' as the first argument here it tells mongo DB to create a collection called animals 
module.exports = User;