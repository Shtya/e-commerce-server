const M_User = require("../model/M_User")
const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const nodemailer = require("nodemailer");



// const sendEmail = require("../util/sendEmail")

exports.signUp = AsyncHandler(async (req, res) => {
  req.body.name ?req.body.slug = slugify(req.body.name) : null
  const data = await M_User.create(req.body)
  const token = JWT.sign({id : data._id} ,process.env.JWT_SECRET_KEY , {expiresIn:process.env.JWT_EXPIRE_IN} )
  res.status(201).json({data , token})
})



exports.login = AsyncHandler(async (req, res ,next) => {
  const user = await M_User.findOne({ email: req.body.email })
  if (!user) return next(new Error("This user not found"))

  const IsCorrect = await bcrypt.compare(req.body.password , user.password)
  if (!IsCorrect) return next(new Error("Password is not correct"))
  
  const token = JWT.sign({id : user._id} ,process.env.JWT_SECRET_KEY , {expiresIn:process.env.JWT_EXPIRE_IN} )
  res.status(201).json({data :user , token})
})


exports.protect = AsyncHandler(async (req, res, next) => {
    //=================== (1) Check if login or no
    let token = ""
    req.headers.authorization ? token = req.headers.authorization.split(" ")[1]:null
  if (!token) return next(new Error("You are not Login , please Login to get access this route"))
  
  //========= (2) verify token ( no change happens , expired token ) ==========//
  const Decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)

  //========= (3) check if user Exist if  " Deleted User form database "  ==========//
  const user = await M_User.findById(Decoded.id )
  if (!user) return next(new Error("The user that belong to this token does no longer exist"))
  
  //========= (4) check if user change password after token created  ==========//
  if (user.passwordChangedAt) {
    const PassTimeStamp = parseInt(user.passwordChangedAt.getTime() / 1000 ,10)
    if(PassTimeStamp > Decoded.iat) next(new Error ("user recently changed his password . please login again.."))
    
  }

  req.user = user
  next()

})

exports.allowedTo = (...roles) =>
  AsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) next(new Error("You are not allowed to perform this action"))
    next()
  })


  const sendEmail = async (email , message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
      port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
      secure: true,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,// generated ethereal password
      }
    });
  
    // 2) Define email options (like from, to, subject, email content)
    const mailOpts = {
      from: 'E-shop App <Shtya54@gmail.com>',
      to: email,
      subject: 'Your Password Reset Code (valid for 10 min)',
      text: message,
    };
    // 3) Send email
    await transporter.sendMail(mailOpts);
}


  
exports.ForgetPass = AsyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const {email} = req.body
  const user = await M_User.findOne({ email})
  if (!user) next(new Error(`There is no user with this email address ${email}`))
  
  // 2) Generate random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 9000000).toString()
  const hashResetCode = crypto.createHash("sha256").update(resetCode).digest("hex")
  user.passwordResetCode = hashResetCode
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000
  user.resetCodeVerified = false
  await user.save()

  // 3)  Send password reset code via email
  const message = `Hi ${user.name} \n we received a request to reset the password on your Shop Account \n ${resetCode} \n Thanks for helping us keep you account secure The E-commerce Team`

  try {
    await sendEmail(user.email , message );
  }
  catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.resetCodeVerified = undefined
      await user.save();
      return next(new Error('There was an error sending the email. Try again later!'));
  }
  res.status(200).json({ status: 'Success', message });

})

exports.verifyPass = AsyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code ! because we have not user id
  const hashedResetCode = crypto
    .createHash("sha256").update(req.body.resetCode).digest("hex")
  
  // 2) Check if reset code is valid or expired
  const user = await M_User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires:{$gt:Date.now()}
  })
  if (!user) next(new Error("Reset code is invalid or has expired"))
  
  // 3) If reset code has not expired, and there is user send res with userId
  user.resetCodeVerified = true
  await user.save()
  res.status(200).json({status:"success"})
})


exports.resetPassword = AsyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await M_User.findOne({ email: req.body.email });
  if (!user)  next(new Error(`There is no user with this email address ${req.body.email}`))
  
  // Check if user verify the reset code
  if (!user.resetCodeVerified) next(new Error('reset code not verified'))
  

  // 2) Update user password & Hide passwordResetCode & passwordResetExpires from the result
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.resetCodeVerified = undefined;

  await user.save();

  // 3) If everything ok, send token to client
  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(200).json({ token });
});



