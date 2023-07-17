const mongoose = require("mongoose")


const Schema = new mongoose.Schema({
  title             : { type: String,unique : [true , "The Title Unquie"] , trim: true, },
  slug              : { type: String, lowercase: true },
  description       : { type: String, required: true, minlength: 3 },
  quantity          : { type: Number, required: true },
  sold              : { type: Number, default: 0 },
  price             : { type: Number, required: true },
  priceAfterDiscount: { type: Number},
  colors            : [String],
  imageCover        : { type: String, required: [true , "imageCover is Required"] },
  images            : [String],
  category          : { type: mongoose.Schema.ObjectId, refer: "category", required: true },
  subCategory       : [{type:mongoose.Schema.ObjectId , refer:"subcategory" }],
  brand             : { type: mongoose.Schema.ObjectId, ref: "brand" },
  ratingsAverage    : { type: Number, min: 1 },
  ratingsQuantity: { type: Number, default: 0 },

}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

Schema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField:"_id"
})

Schema.pre(/^find/, function (next) {
  this.populate("category")
  next()
})



Schema.post("save", (e) => {
  if (e.imageCover) {
    e.imageCover = `${process.env.BASE_URL}/product/${e.imageCover}`
  }
  
  const Imgs = []
  if (e.images) {
    e.images.map((Img) => {
      let URlImg= `${process.env.BASE_URL}/product/${Img}`
      Imgs.push(URlImg)
    })
    e.images = Imgs
  }
})


Schema.post("init", (e) => {
  if (e.imageCover) {
    e.imageCover = `${process.env.BASE_URL}/product/${e.imageCover}`
  }
  const Imgs = []
  if (e.images) {
    e.images.map((Img) => {
      let URlImg= `${process.env.BASE_URL}/product/${Img}`
      Imgs.push(URlImg)
    })
    e.images = Imgs
  }
})

module.exports = mongoose.model("product" , Schema)