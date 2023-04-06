const mongoose = require('mongoose');

const mainSchema= new mongoose.Schema({
    name:String,
    category:String,
    image:String
})

module.exports = mongoose.model("mains",mainSchema);