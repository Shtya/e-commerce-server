const M_User = require("../model/M_User")
const AsyncHandler = require("express-async-handler")


exports.Create = AsyncHandler(async (req, res) => {
  
  const data = await M_User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {new :true}
  )
  return res.status(200).json({data : data.addresses , status : "success Add"})
})


exports.Delete = AsyncHandler(async (req, res) => {

  const data = await M_User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses:{ _id: req.params.AddressId }} },
    {new :true}
  )
  res.status(200).json({data : data.addresses , status : "success Delete"})
})

exports.Update = AsyncHandler(async (req, res, next) => {
  const user = await M_User.findById(req.user._id);

  const address = user.addresses.id(req.params.AddressId);

  address.alias = req.body.alias || address.alias;
  address.details = req.body.details || address.details;
  address.phone = req.body.phone || address.phone;
  address.city = req.body.city || address.city;
  address.postalCode = req.body.postalCode || address.postalCode;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: address,
  });
});

exports.GETAll = AsyncHandler(async (req, res) => {

  const data = await M_User.findById(req.user._id).populate("addresses").select("addresses")
  
  return res.status(200).json({data : data.addresses , status : "success"})
})


// exports.Get_ID = AsyncHandler(async (req, res, next) => {
//   const user = await M_User.findById(req.user._id)
//   const address = await user.addresses.id(req.params.addressId)
//   if(!address) return next(new Error("this id not found"))
//   res.status(200).json({
//     status: 'success',
//     data: address,
//   });
// })



