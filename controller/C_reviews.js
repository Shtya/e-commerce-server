const M_review = require("../model/M_review")
const AsyncHandler = require("express-async-handler")


exports.Create = AsyncHandler(async (req, res) => {
  const data = await M_review.create(req.body)
  res.status(200).json({data})
})

exports.Get = AsyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1
  let limit = req.query.limit * 1 || 10
  let skip = (page - 1) * limit
  
  let Query = M_review.find().limit(limit).skip(skip)
  
  let OBJ = {}
  if (req.params.ProdID) {
    OBJ = { product: req.params.ProdID }
    Query = Query.find(OBJ)
  }
  if (req.query) {
    Query = Query.find(req.query)
  }
  
  const data = await Query
  res.status(200).json({
    results: data.length,
    paginationResult: {
      currentPage: page,
      numberOfPages: Math.ceil(await M_review.find().countDocuments() / limit) ,
      limit
    },
    data
  })
})

exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_review.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res , next) => {
  const data = await M_review.findByIdAndUpdate(req.params.id, req.body , { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({ data })
  data.save()
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_review.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
  data.remove()
})

