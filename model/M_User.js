const mongoose = require("mongoose")
const bcrypt = require("bcryptjs") 

const Schema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, 'Please set your name'],},
    slug: { type: String, lowercase: true,},
    email: { type: String, required: [true, 'Please set your email'], unique: [true, 'Email already in use'], lowercase: true,},
    phone: String,
    profileImg: String,
    password: { type: String, required: [true, 'Please set your password'], minlength: [6, 'password min length 6'],},
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    resetCodeVerified: Boolean,
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user', },
    active: { type: Boolean, default: true, },
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'product', },],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

Schema.pre(/^find/, function (next) {
  this.populate("wishlist")
  next()
})

Schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

Schema.post("init", (e) => {
if (e.profileImg) {e.profileImg = `${process.env.BASE_URL}/category/${e.profileImg}`}})

module.exports = mongoose.model("user" , Schema)