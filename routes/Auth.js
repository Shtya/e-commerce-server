const express = require("express")
const router = express.Router()

const {signUp , login  , ForgetPass , verifyPass , resetPassword} = require("../controller/C_auth")
const {V_Create , V_login } = require("../validation/V_user")

router.post("/signup"           , V_Create , signUp)
router.post("/login"            , V_login , login)
router.post("/forgotPasswords"  , ForgetPass)
router.post("/verifyResetCode"  , verifyPass)
router.put("/resetPassword"     , resetPassword)


module.exports = router




