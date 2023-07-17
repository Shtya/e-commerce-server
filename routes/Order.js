const express = require("express")
const router = express.Router()

const {checkOutSession ,CreateOrder ,GetAllOrder ,GET_Id_Order , Update_Order_To_paid , Update_Order_To_delever} = require("../controller/C_order")
const { protect, allowedTo } = require("../controller/C_auth")

router.post("/:cartId"            ,protect, allowedTo("user") , CreateOrder)
router.get("/"                    ,protect, allowedTo("user" , "admin" , "manger") , GetAllOrder)
router.get("/:id"                 ,protect, allowedTo("user" , "admin" , "manger") , GET_Id_Order)
router.put("/pay/:id"             ,protect, allowedTo("user" , "admin" , "manger") , Update_Order_To_paid)
router.put("/deliver/:id"         ,protect, allowedTo("user" , "admin" , "manger") , Update_Order_To_delever)
router.get("/checkout-session/:id",protect, allowedTo("user" , "admin" , "manger") , checkOutSession)



module.exports = router