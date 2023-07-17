const M_coupon = require("../model/M_Coupon")
const AsyncHandler = require("express-async-handler")

exports.Create = AsyncHandler(async (req, res) => {
  const data = await M_coupon.create(req.body)
  res.status(200).json({data})
})

exports.Get = AsyncHandler(async (req, res) => {
  const data = await M_coupon.find()
  res.status(200).json({result:data.length ,data})
})

exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_coupon.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const data = await M_coupon.findByIdAndUpdate(req.params.id, req.body , { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_coupon.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
})