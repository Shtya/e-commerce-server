const mongoose = require("mongoose")


const Schema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: { type: String, trim: true, lowercase: true },
  image:String
})

Schema.post("save", (e) => {
if (e.image) {e.image = `${process.env.BASE_URL}/brand/${e.image}`}})


Schema.post("init", (e) => {
if (e.image) {e.image = `${process.env.BASE_URL}/brand/${e.image}`}})

module.exports = mongoose.model("brand" , Schema)