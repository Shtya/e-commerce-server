const express = require("express")
const router = express.Router({mergeParams :true})

const { Get, Get_Id, Create, Update, Delete } = require("../controller/C_reviews")
const { protect, allowedTo } = require("../controller/C_auth")
const { V_create ,V_Update ,V_Delete } = require("../validation/V_review")
const {Link_Prod_Review} =require("../controller/LInk_Prod_review")

router.get("/"       ,protect , allowedTo( "user") , Get)
router.get("/:id"    ,protect , allowedTo( "user")  , Get_Id)
router.post("/"      ,protect , allowedTo( "user") ,V_create , Create)
router.put("/:id"    ,protect , allowedTo( "user") , V_Update , Update)
router.delete("/:id" ,protect , allowedTo( "user" , "admin" , "manger"),V_Delete , Delete)

module.exports = router