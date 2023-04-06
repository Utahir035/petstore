const mongoose= require('mongoose');

const categorySchema= new mongoose.Schema({
    name:String,
    category:String,
    subcategories:[
        {
            image:String,
            name:String,
            category:String
        }
    ]
})

module.exports = mongoose.model("categories",categorySchema);