const M_User = require("../model/M_User")
const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")
const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

const memory = multer.memoryStorage({})
const filter = (req, file, next) => {
  file.mimetype.startsWith("image")
    ? next(null , true)
    : next(new Error("Allow Upload Image") , false)
}

const Upload = multer({ storage: memory, fileFilter: filter })
exports.IMG = Upload.single("profileImg")
exports.Resize = AsyncHandler(async (req, res, next) => {
  const filename =`user_${uuidv4()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer).resize(400, 400)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/user/${filename}`)
  }
  req.body.profileImg = filename
  next()
})


exports.Create = AsyncHandler(async (req, res) => {
  req.body.name ?req.body.slug = slugify(req.body.name) : null
  const data = await M_User.create(req.body)
  res.status(200).json({data})
})

exports.Get = AsyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1
  let limit = req.query.limit * 1 || 10
  let skip = (page - 1) * limit
  
  const data = await M_User.find().limit(limit).skip(skip)
  res.status(200).json({
    result: data.length,
    paginationResult: {
      currentPage: page,
      numberOfPages: Math.ceil(await M_User.find().countDocuments() / limit),
      limit
    },
    data
  })
})

exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_User.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res , next) => {
  req.body.name ?req.body.slug = slugify(req.body.name):null
  const {name ,email , phone, profileImg ,role , active  } = req.body
  const data = await M_User.findByIdAndUpdate(req.params.id,
    {name ,email , phone, profileImg ,role , active },
    { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update_Pass = AsyncHandler(async (req, res , next) => {
  const {password} = req.body
  const data = await M_User.findByIdAndUpdate(req.params.id,
    {
      password: await bcrypt.hash(password, 12),
      passwordChangedAt: Date.now()
    },
    { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_User.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
})