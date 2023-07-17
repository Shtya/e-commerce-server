const { check, validationResult } = require("express-validator")
const M_review = require("../model/M_review")

const v_layer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({ err: err.array() })
  }
  next()
}

exports.V_create = [
  check("rating").isFloat({ min: 1, max: 5 }).isNumeric(),
  check("user").isMongoId().withMessage("Id not Valid"),
  check("product").isMongoId().withMessage("Id not Valid"),
  // review one comment onlly
  check("review").notEmpty().withMessage("review is Empty")
    .custom((val, { req }) => 
      M_review.findOne({ user: req.user._id, product: req.body.product }).then(res => {
        if(res) {return Promise.reject(new Error (" you Already created before review "))}
      })
  ),
  v_layer
]


exports.V_Update = [
  check("id").isMongoId().withMessage("Id not Valid")
    .custom(async (val, { req }) => 
      M_review.findById(val).then(res => {
        if (!res) return Promise.reject(new Error("This is no review for this id"))
        if (res.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("Your are not allowed to perform this review"))
        }
      })
  ),
  v_layer
]
exports.V_Delete = [
  check("id").isMongoId().withMessage("Id not Valid")
    .custom((val, { req }) => 
      M_review.findById(val).then(res => {
        if (!res) return Promise.reject(new Error("This is no review for this id"))
        if (res.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("Your are not allowed to perform this review"))
        }
      })
  ),
  v_layer
]