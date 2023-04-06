const mongoose = require('mongoose');

const orderSchema= new mongoose.Schema({
    name:String,
    email:String,
    price:String,
    items:[
        {
        name:String,
        category:String
    }
],
    quantity:String,
}
)

module.exports = mongoose.model("orders",orderSchema);