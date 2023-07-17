const mongoose = require("mongoose")


const Schema = new mongoose.Schema({
  //cartItems
  cartItems: [
    {
      product: { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
      color: String,
      price: Number
    }
  ],
  totalCartPirce: Number,
  totalCartDiscount: Number,
  user: { type: mongoose.Schema.ObjectId, ref: "user" },
  coupon : String
})


module.exports = mongoose.model("cart" , Schema)