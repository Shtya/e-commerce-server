const express = require("express")
const router = express.Router()

const {Create ,getCart , DeleteOneProduct ,DeleteAllCart , UpdateQuantity , ApplyCoupon} = require('../controller/C_cart')
const { protect, allowedTo } = require("../controller/C_auth")

router.use(protect , allowedTo( "user" ))

router.post("/"            ,protect , Create)
router.get("/"             ,protect , getCart)
router.delete("/:id"       ,protect , DeleteOneProduct)
router.delete("/"          ,protect , DeleteAllCart)
router.put("/applyCoupon"  ,protect , ApplyCoupon)
router.put("/:id"          ,protect , UpdateQuantity)


module.exports = router