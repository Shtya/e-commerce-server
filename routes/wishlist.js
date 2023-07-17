const express = require("express")
const router = express.Router()

const { RemoveForWishlist, Create ,GET} = require("../controller/C_wishlist")
const { protect, allowedTo } = require("../controller/C_auth")

router.delete("/:productId"    ,protect , allowedTo( "user" )  , RemoveForWishlist)
router.post("/"      ,protect , allowedTo( "user" ) , Create)
router.get("/"       ,protect , allowedTo( "user" ) , GET)

module.exports = router