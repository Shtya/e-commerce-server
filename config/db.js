const mongoose = require("mongoose")

const connectiondb = () => {
  mongoose.set('strictQuery', false)
  mongoose.connect(process.env.URL_DB).then(res=> console.log(`connect on ${res.connection.host}`)).catch(err=> console.log(`Error_mongoose : ${err}`))
}

module.exports = connectiondb