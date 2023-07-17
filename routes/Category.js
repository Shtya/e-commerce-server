const express = require("express")
const router = express.Router()
const SubCategory = require("./SubCategory")

const {IMG , Resize , Get, Get_Id, Create, Update, Delete } = require("../controller/C_Category")
const { V_Check_ID  , V_Create} = require("../validation/V_Category")
const { protect, allowedTo } = require("../controller/C_auth")

router.use(protect , allowedTo("user" , "admin" , "manger"))
router.get("/"        , Get)
router.get("/:id"     , V_Check_ID , Get_Id)
router.post("/"       ,IMG ,Resize  , V_Create, Create)
router.put("/:id"     ,IMG ,Resize , V_Check_ID , Update)
router.delete("/:id"  ,V_Check_ID , Delete)
router.use("/:IDCate/subcategories" , SubCategory)
module.exports = router