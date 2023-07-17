const { check, validationResult } = require("express-validator")
const M_category = require("../model/M_Category")
const M_SubCategory = require("../model/M_SubCategory")

const v_layer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({_err : err.array()})
  }
  next()
}


exports.V_Create = [
  check("title").notEmpty().withMessage("Field Is Empty"),
  check("quantity").notEmpty().withMessage("Empty").isNumeric().withMessage("must be Number"),
  check("price").notEmpty().withMessage("Field is Empty").isNumeric().withMessage("must be Number"),
  check("imageCover").notEmpty().withMessage("Feild is Empty"),
  check("category")
    .notEmpty().withMessage("category is empty")
    .isMongoId().withMessage("ID Category not valid")
    .custom(async(val) => 
      M_category.findById(val).then(res => {
        if (!res) return Promise.reject(new Error("Category not Exist.."))
      })),
  check("priceAfterDiscount").optional().toFloat().isNumeric().withMessage('Product priceAfterDiscount must be a number')
    .custom((val, { req }) => {
      if (val >= req.body.price) throw new Error('priceAfterDiscount must be lower than price')
      return true
  })
  ,
  
  
  check("subCategory")
    .notEmpty().withMessage("subCategory is empty")
    .isMongoId().withMessage("ID subCategory not valid")
      // 2- Check if subcategories exist in our db
    .custom((val, { req }) => 
      M_SubCategory.find({_id : {$exists:true , $in : val}}).then(res => {
        if(!res.length < 1 || val.length !== res.length) return new Error("")
      }))
  
    // 3- check if subcategories belong to category
    // .custom((val, { req }) =>
    // M_SubCategory.find({ category: req.body.category }).then(res => {
    //   let itemsSub = []
    //   res.forEach(subs => itemsSub.push(subs._id.toString()))
      
    //   const checker = (item, target)=>target.every((t)=>item.icludes(t))
    //   if (!checker(itemsSub, val)) {
    //     return Promise.reject(new Error("Subcategory not belong to category"))
    //   }
    // }))
  ,
    check('brand').optional().isMongoId().withMessage('Invalid ID formate'),
    check('ratingsAverage').optional().isNumeric().withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 }).withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 }).withMessage('Rating must be below or equal 5.0'),

  check('ratingsQuantity')
    .optional().isNumeric().withMessage('ratingsQuantity must be a number'),

  v_layer
]

exports.V_check_id = [
  check("id").isMongoId().withMessage("Params id is not valid")
  ,v_layer
]