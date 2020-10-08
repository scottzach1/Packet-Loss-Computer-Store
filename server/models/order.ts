// will add the typescript object to this order model when checking out

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const schema = new Schema({
    user: {type: Object, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: Object, required: true},
    paymentInfo: {type: Object, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    //paymentId: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Order', schema);