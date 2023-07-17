
exports.Link_Prod_Review = async (req, res, next) => {

    if (!req.body.user || !req.body.product) {
      req.body.user = req.user._id
      req.body.product = req.params.ProdID
    }
  next()
}
