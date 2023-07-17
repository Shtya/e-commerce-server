const mongoose = require("mongoose")
const M_Product = require("./M_Product")


const Schema = new mongoose.Schema({
  review: { type: String, required: true },
  rating: { type: Number,required:true},
  user: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
  product:{ type: mongoose.Schema.ObjectId, ref: "product", required: true },
})

Schema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" })
  next()
})

// For Count Reating by Aggregation
Schema.statics.CalcAverageRatingsAndQuantity = async function (ProdId) {
  const result = await this.aggregate([
    // 1) get all reviews on prodcut
    { $match: { product: ProdId } },
    // 2) grouping reviews based on ProdId and calc avgRatings
    {$group:
      {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 }
    }
    }])
  
  if (result.length > 0) {
    await M_Product.findByIdAndUpdate(ProdId, {
      ratingsQuantity: result[0].ratingsQuantity,
      ratingsAverage: result[0].avgRatings
    })
  } else {
    await M_Product.findByIdAndUpdate(ProdId, {
      ratingsQuantity:0 ,
      ratingsAverage: 0
    })
  }
}

Schema.post("save", async function () {
  await this.constructor.CalcAverageRatingsAndQuantity(this.product)
})

Schema.post("remove", async function () {
  await this.constructor.CalcAverageRatingsAndQuantity(this.product)
})


module.exports = mongoose.model("review" , Schema)