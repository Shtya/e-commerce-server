const { check, validationResult } = require("express-validator")
const M_User = require("../model/M_User")
const bcrypt = require("bcryptjs")

const v_layer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({_err : err.array()})
  }
  next()
}

exports. V_Create = [
  check("email")
    .isEmail().withMessage("email not valid")
    .notEmpty().withMessage("E-mail is empty")
    .custom(async val => {
      const data = await M_User.findOne({ email: val })
      if (data) return Promise.reject(new Error("This E-mail is Already used"))
    }),
  
  
  check("phone").optional().isMobilePhone(["ar-EG","ar-SA"]).withMessage("Phone number not valid"),
  check("profileImg").optional(),
  check("password")
    .notEmpty().withMessage("password is empty")
    .custom(async(val, { req }) => {
      req.body.password = await bcrypt.hash(val , 12)
      if(val !== req.body.passwordConfirm) return Promise.reject(new Error ("password not Confirm"))
    }
    ),
  check("passwordConfirm").notEmpty().withMessage("passwordConfirm is empty"),
  v_layer
]
exports.V_Update = [
  check("id").isMongoId().withMessage("This id not valid") ,
  check("email")
    .isEmail().withMessage("email not valid")
    .notEmpty().withMessage("E-mail is empty")
    .custom(async val => {
      const data = await M_User.findOne({ email: val })
      if (data) return Promise.reject(new Error("This E-mail is Already used"))
    }),
  check("phone").optional().isMobilePhone(["ar-EG","ar-SA"]).withMessage("Phone number not valid"),
  check("profileImg").notEmpty().withMessage("profileImg is empty"),
  v_layer
]

exports.V_Update_pass = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check("passwordConfirm").notEmpty().withMessage("passwordConfirm is empty"),
  check("currentPassword").notEmpty().withMessage("currentPassword is empty"),

  check("password").notEmpty().withMessage("password is empty")
    
    .custom(async (val, { req }) => {
      const data = await M_User.findById(req.params.id)
      const isCorrect = await bcrypt.compare(req.body.currentPassword, data.password)
      if (val !== req.body.passwordConfirm) return Promise.reject(new Error("Password not Confirm"))
      if(!isCorrect) return Promise.reject(new Error("Password not Correct"))
    }
    ),
  v_layer
]

exports.V_login = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email formate'),

  check('password').notEmpty().withMessage('Password required'),

  v_layer,
];