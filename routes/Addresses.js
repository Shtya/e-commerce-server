const express = require("express")
const router = express.Router()

const {GETAll , Create , Delete ,Update , Get_ID } = require("../controller/C_addresses")
const { protect, allowedTo } = require("../controller/C_auth")
const {V_create} = require("../validation/V_Address")
router.get("/"               ,protect  , GETAll)
router.post("/"              ,protect  ,V_create , Create)
router.delete("/:AddressId"   ,protect ,Delete)
router.put("/:AddressId"   ,protect ,Update)

module.exports = router



// 