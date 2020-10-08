const mongoose = require('../src/db').getDb();
const Schema = mongoose.Schema;
const Cart = require('./cart');


// create product schema and model
const userSchema = new Schema({
    name:{type:String, required:[true, 'Name field is required']},
    email: {type: String, required: [true, 'email is required'], unique: true},
    password: {type: String, required: () => this.authType === 'local'}, // password is only required when authType is local
    authType: {type: String, required: [true, 'required auth type'], default: 'local'},
    token: {type: String},
    cart: {type: Object, default: {items: [], totalCost: 0}}
});

const user = mongoose.model('user', userSchema); // create a user model, which would represent a collection in the database

module.exports = user;