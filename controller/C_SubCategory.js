const M_SubCategory    = require("../model/M_SubCategory")
const AsyncHandler     = require("express-async-handler")
const slugify          = require("slugify")
const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 } = require("uuid")

const memory = multer.memoryStorage({})
const filter = (req, file, next) => {
  file.mimetype.startsWith("image")
    ? next(null , true)
    : next(new Error("Allow Upload Image") , false)
}

const Upload = multer({ storage: memory, fileFilter: filter })
exports.IMG = Upload.single("image")
exports.Resize = AsyncHandler(async (req, res, next) => {
  const filename =`SubCategory_${uuidv4()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer).resize(400, 400)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/subcategory/${filename}`)
  }
  req.body.image = filename
  next()
})


exports.Create = AsyncHandler(async (req, res) => {
  req.body.name ? req.body.slug = slugify(req.body.name) : null
  const data = await M_SubCategory.create(req.body)
  res.status(200).json({data})
})


exports.Get = AsyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1
  let limit = req.query.limit * 1 || 10
  let skip = (page - 1) * limit

  let obj = {}
  if (req.params.IDCate) obj = { category: req.params.IDCate }

  
  const data = await M_SubCategory.find(obj).limit(limit).skip(skip)
  res.status(200).json({
    result: data.length,
    paginationResult: {
      currentPage: page,
      numberOfPages: Math.ceil(await M_SubCategory.find().countDocuments() / limit),
      limit
    },
    data
  })
})


exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_SubCategory.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res , next) => {
  req.body.name ? req.body.slug = slugify(req.body.name) : null
  const data = await M_SubCategory.findByIdAndUpdate(req.params.id, req.body , { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_SubCategory.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
})