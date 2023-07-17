const { check, validationResult } = require("express-validator")

const v_layer = (req, res, next) => {
  const err = validationResult(req);
  console.log(err)
  if (!err.isEmpty()) {
    return res.status(400).json({ err: err.array() })
  }
  next()
}


exports.V_create = [
  check("name").notEmpty().withMessage("name is empty"),
  check("discount").notEmpty().withMessage("discount is empty"),
  check("expire").notEmpty().withMessage("expire is empty"),
  v_layer
]


