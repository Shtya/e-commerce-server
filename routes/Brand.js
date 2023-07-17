const express = require("express")
const router = express.Router()

const {IMG , Resize , Get, Get_Id, Create, Update, Delete } = require("../controller/C_Brand")
const { V_Check_ID } = require("../validation/V_Category")
const { protect, allowedTo } = require("../controller/C_auth")

router.get("/"       ,protect , allowedTo( "user" ,"admin" , "manger") , Get)
router.get("/:id"    ,protect , allowedTo( "user" ,"admin" , "manger") , V_Check_ID , Get_Id)
router.post("/"      ,protect , allowedTo( "user" ,"admin" , "manger") , IMG ,Resize , Create)
router.put("/:id"    ,protect , allowedTo( "user" ,"admin" , "manger") , IMG ,Resize , V_Check_ID , Update)
router.delete("/:id" ,protect , allowedTo( "user" ,"admin" , "manger") , V_Check_ID, Delete)

module.exports = router