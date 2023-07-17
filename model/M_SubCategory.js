const mongoose = require("mongoose")


const Schema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: { type: String, trim: true, lowercase: true },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "category",
    required:true
  },
  image:String
})

Schema.post("save", (e) => {
  if(e.image) e.image = `${process.env.BASE_URL}/subcategory/${e.image}`
})
Schema.post("init", (e) => {
  if(e.image) e.image = `${process.env.BASE_URL}/subcategory/${e.image}`
})

module.exports = mongoose.model("subcategory" , Schema)