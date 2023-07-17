const { check, validationResult } = require("express-validator")

const v_layer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({ err: err.array() })
  }
  next()
}


exports.V_create = [
  check("alias").notEmpty().withMessage("alias is empty"),
  check("details").notEmpty().withMessage("details is empty"),
  check("phone").isMobilePhone(["ar-EG","ar-SA"]).withMessage("phone not valie"),
  check("city").optional(),
  check("postalCode").notEmpty().withMessage("postalCode is empty"),
  v_layer
]


