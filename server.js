const path              = require("path")
const express           = require("express")
const dotenv = require("dotenv")
const csrf = require("csurf")
// const csrfProtection = csrf({cookie : true})
dotenv.config({path:".env"})
const morgan = require('morgan')

const compression       = require("compression")
const cors              = require("cors")

const {globalError}     = require("./util/GlobalError")
const mounte            = require("./routes/index")
const { webhookCheckout } = require("./controller/C_order")
const connectiondb      = require("./config/db")

connectiondb()





const app = express()
app.use(cors())
app.options("*", cors())
app.enable("trust proxy")


app.post('/webhook', express.raw({type: 'application/json'}),webhookCheckout );


app.use(express.json({limit:"20kb"}))  // for protected web from attackers and make send large data for fill the cloude with you 
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "uploads")))

app.use(compression())
app.use(morgan("dev"))


// 2 ) CSRF for protect password words 
// app.use("/", csrfProtection, (req, res) => {
//   res.render("send" , {csrfToken : req.csrfToken()})
// })
mounte(app)


// ) Catch Error
app.all("*", (req, res, next) => {
  next(new Error (`can't find this route : ${req.originalUrl}`))
})
app.use(globalError)


let port = process.env.PORT || 6000
app.listen(port , _=> console.log(`Server is running on ${port}`))
