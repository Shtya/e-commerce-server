const M_cart = require("../model/M_cart")
const M_product = require("../model/M_Product")
const M_coupon = require("../model/M_Coupon")
const AsyncHandler = require("express-async-handler")


exports.Create = AsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body
  const product = await M_product.findById(productId)
  
  let cart = await M_cart.findOne({ user: req.user._id })


    // (1) Create cart for logged user 
  if (!cart) {
    cart = await M_cart.create({
      user: req.user._id,
      cartItems:[{product: productId , color , price:product.price}]
    })



    // (2) product exist in cart , update product quantity
  } else {
    const ProductIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId && item.color === color)

    if (ProductIndex > -1) {
        cart.cartItems[ProductIndex].quantity +=1
    } else {
      cart.cartItems.push({product:productId , color , price : product.price})
      }
  }

    // (3) calculate total cart price 
  let totalPrice = 0;
  cart.cartItems.forEach(e => totalPrice += e.price * e.quantity)
  cart.totalCartPirce = totalPrice;
  cart.totalCartDiscount = undefined;
  res.status(200).json({ status: "success", data: cart , countProduct:cart.cartItems.length })
  await cart.save()

})

exports.getCart = AsyncHandler(async (req, res, next) => {
  const cart = await M_cart.findOne({ user: req.user._id })
    .populate({ path: "cartItems.product" ,select:"description imageCover price  ratingsAverage priceAfterDiscount title" })
  if (!cart) next(new Error("not exists cart For this id"))
  res.status(200).json({ data: cart ,countProduct:cart.cartItems.length  })
  await cart.save()
})


exports.DeleteOneProduct = AsyncHandler(async (req, res, next) => {
  const cart = await M_cart.findOneAndUpdate(
    { user: req.user._id },
    {$pull : {cartItems : {_id : req.params.id}}} , {new : true}
  )
  let totalPrice = 0
  cart.cartItems.forEach(e => totalPrice += e.quantity * e.price)
  cart.totalCartPirce = totalPrice

  if (!cart) next(new Error("not exists cart For this id"))
  res.status(200).json({ data: cart })
  await cart.save()
})


exports.DeleteAllCart = AsyncHandler(async (req, res, next) => {

  const cart = await M_cart.findOneAndDelete({ user: req.user._id })
  res.status(200).send("Deleted Cart All")
  await cart.save()
})


exports.UpdateQuantity = AsyncHandler(async (req, res, next) => {
  
  const cart = await M_cart.findOne({ user: req.user._id })
  if (!cart) next(new Error("there is no cart for user"))
  
  const ItemIndex = cart.cartItems.findIndex(
    e => e._id.toString() === req.params.id)
  
  if (ItemIndex > -1) {
    const cartItem = cart.cartItems[ItemIndex]
    cartItem.quantity = req.body.quantity
    cart.cartItems[ItemIndex] = cartItem
  } else {
    return next( new Error("there is no item for this id"))
  }

  let totalPrice = cart.cartItems.forEach(e => e.quantity * e.price)
  cart.totalCartPirce = totalPrice
  cart.totalCartDiscount = totalPrice
  await cart.save()
  res.status(200).json({ data :cart ,totalCartDiscount , totalPrice})
})

// To here
exports.ApplyCoupon = AsyncHandler(async (req, res, next) => {

  // (1) Get coupon based on coupon name  is unique
  const coupon = await M_coupon.findOne({
    name: req.body.coupon,
    expire : {$gt : Date.now()} // expire > Date.now()
  })

  if (!coupon) next(new Error("coupon is invalid or expired "))
  

  // 2) Get logged user cart to get total cart price
  const cart = await M_cart.findOne({ user: req.user._id })
  const totalPrice =  cart.totalCartPirce

  // 3) calculate price after priceAfterDiscount
  cart.totalCartDiscount = (totalPrice - (totalPrice * coupon.discount)/100).toFixed(2)
  await cart.save()
  res.status(200).json({numOfCartItems : cart.cartItems.length , data:cart })

})