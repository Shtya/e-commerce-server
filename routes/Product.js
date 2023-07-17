const express = require("express")
const router = express.Router()
const Reviews = require("./Review")

const {IMG , Resize , Get, Get_Id, Create, Update, Delete } = require("../controller/C_Product")
const { V_Create , V_check_id } = require("../validation/V_product")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"       ,protect , allowedTo( "user" ,"admin" , "manger"), Get)
router.get("/:id"    ,protect , allowedTo( "user" ,"admin" , "manger"), V_check_id, Get_Id)
router.post("/"      ,protect , allowedTo( "user" ,"admin" , "manger"), IMG ,Resize , V_Create , Create)
router.put("/:id"    ,protect , allowedTo( "user" ,"admin" , "manger"), IMG ,Resize , V_check_id, Update)
router.delete("/:id" ,protect , allowedTo( "user" ,"admin" , "manger"), V_check_id, Delete)
router.use("/:ProdID/reviews" , Reviews)
module.exports = router