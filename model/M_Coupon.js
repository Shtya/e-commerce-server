const mongoose = require("mongoose")


const Schema = new mongoose.Schema({
  name: { type: String, unique: true , required:true , trim:true },
  discount: {type : Number , required:true} ,
  expire: {type:Date , required:true},
})


module.exports = mongoose.model("coupon" , Schema)