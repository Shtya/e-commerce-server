const Category    = require("./Category")
const SubCategory = require("./SubCategory")
const Brand       = require("./Brand")
const Product     = require("./Product")
const User        = require("./user")
const Auth        = require("./Auth")
const Review      = require("./Review")
const Wishlist    = require("./wishlist")
const Addresses   = require("./Addresses")
const Coupon      = require("./Coupon")
const Cart        = require("./Cart")
const Order       = require("./Order")

const mounte = (app) => {
  app.use("/api/v1/categories"     , Category)
  app.use("/api/v1/subcategories"  , SubCategory)
  app.use("/api/v1/brands"         , Brand)
  app.use("/api/v1/products"       , Product)
  app.use("/api/v1/users"          , User)
  app.use("/api/v1/auth"           , Auth)
  app.use("/api/v1/reviews"        , Review)
  app.use("/api/v1/wishlist"       , Wishlist)
  app.use("/api/v1/addresses"      , Addresses)
  app.use("/api/v1/coupons"        , Coupon)
  app.use("/api/v1/cart"           , Cart)
  app.use("/api/v1/orders"         , Order)
}

module.exports = mounte