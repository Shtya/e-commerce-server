const { check, validationResult } = require("express-validator")

const V_leyer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) res.status(400).json({ Validation_err: err.array() })
  next()
}

exports.V_Check_ID = [
  check("id").isMongoId().withMessage("this id not valid"),
  V_leyer
]
exports.V_Create = [
  check("name").notEmpty().withMessage("name is empty").isLength({min:5}) ,
  V_leyer
]