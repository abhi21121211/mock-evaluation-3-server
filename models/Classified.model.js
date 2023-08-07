const mongoose = require("mongoose");


const classifiedSchema = new mongoose.Schema({

    name:{type:String, required:true},
    description:{type:String, required:true},
    category:{type:String, required:true ,enum:['Clothing', 'Electronics', 'Furniture', 'Other']},
    image:{type:String, required:true},
    location:{type:String, required:true},
    postedAt:{type:Date,default:Date.now },
    price:{type:Number, required:true},
})


const Classified = mongoose.model('Classified',classifiedSchema)


module.exports = Classified;