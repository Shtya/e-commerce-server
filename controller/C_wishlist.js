const M_User = require("../model/M_User")
const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")


exports.Create = AsyncHandler(async (req, res) => {
  const data = await M_User.findByIdAndUpdate(req.user._id, {
    $addToSet:{wishlist: req.body.productId}
  }, { new: true })
  
  res.status(200).json({data :data.wishlist})
})

exports.RemoveForWishlist = AsyncHandler(async (req, res) => {

  const data = await M_User.findByIdAndUpdate(
    req.user._id,
    {$pull : {wishlist : req.params.productId}} , {new : true})
  res.status(200).json({data : data.wishlist , status:"success"})
})

exports.GET = AsyncHandler(async (req, res , next) => {
  const data = await M_User.findById(req.user._id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data:data.wishlist})
})

