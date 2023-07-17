const express = require("express")
const router = express.Router()

const { Get, Get_Id, Create, Update, Delete } = require("../controller/C_Coupon")
const { protect, allowedTo } = require("../controller/C_auth")
const { V_create } = require("../validation/V_Coupon")

router.use(protect , allowedTo( "user " ,"admin" , "manger"))
router.get("/"        , Get)
router.get("/:id"     , Get_Id)
router.post("/"        , Create)
router.put("/:id"     ,V_create, Update)
router.delete("/:id"  , Delete)

module.exports = router