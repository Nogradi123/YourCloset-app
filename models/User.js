const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema ({
   
    userphoto: String,
    username: String,
    password: String,
    email: String,
    likes:  [
        { type: Schema.Types.ObjectId, ref: 'Outfit'}
    ]
}, {
    timestamps: true
})

const User = model('User', userSchema);

module.exports = User;