const M_Product = require("../model/M_Product")
const AsyncHandler = require("express-async-handler")
const slugify = require("slugify")
const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 } = require("uuid")



const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('only images allowed'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.IMG = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.Resize = AsyncHandler(async (req, res, next) => {

  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split('/')[1];
    const imageCoverFilename = `product-${Date.now()}-cover.${ext}`;
    await sharp(req.files.imageCover[0].buffer)
      .toFile(`uploads/product/${imageCoverFilename}`); // write into a file on the disk
    req.body.imageCover = imageCoverFilename;
  }

  req.body.images = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const ext = img.mimetype.split('/')[1];
        const filename = `products-${Date.now()}-${index + 1}.${ext}`;
        await sharp(img.buffer)
          .toFile(`uploads/product/${filename}`);

        // Save images into database
        req.body.images.push(filename);
      })
    );
  }
  next();
});


exports.Create = AsyncHandler(async (req, res) => {
  req.body.title ?req.body.slug = slugify(req.body.title) : null
  const data = await M_Product.create(req.body)
  res.status(200).json({data})
})

exports.Get = AsyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1
  let limit = req.query.limit * 1 || 10
  let skip = (page - 1) * limit

  // Build Query 
  let Query = M_Product.find({}).limit(limit).skip(skip)


  //======== 1) Search bt [gt lt lte gte]
  let Clone = { ...req.query }
  let excude = ["limit", "page", "fields", "keyword", "sort"]
  excude.forEach(e => delete Clone[e])
  const REg = JSON.stringify(Clone).replace(/\b(gte|gle|gt|lt)\b/g, match => `$${match}`)
  REg ?Query = Query.find(JSON.parse(REg)) : null
  


  //======= 2) Sorting 
  if (req.query.sort) {
    Query=Query.sort(req.query.sort.split(",").join(" "))
  }

  //======= 3) Feilds
  if (req.query.fields) {
    Query=Query.select(req.query.fields.split(",").join(" "))
  }

  //====== 4) Search by keyword
  if (req.query.keyword) {
    let query = {}
    query.$or = [
      {title :{$regex : req.query.keyword , $options:"i"}},
      {description :{$regex : req.query.keyword , $options:"i"}},
    ]
    Query = Query.find(query)
  }


  const data = await  Query
  res.status(200).json({
    result: data.length,
    paginationResult: {
      currentPage: page,
      numberOfPages: Math.ceil(await M_Product.find({}).countDocuments() / limit),
      limit
    },
    data
  })
})

exports.Get_Id = AsyncHandler(async (req, res , next) => {
  const data = await M_Product.findById(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json({data})
})

exports.Update = AsyncHandler(async (req, res , next) => {
  req.body.title ? req.body.slug = slugify(req.body.title):null
  const data = await M_Product.findByIdAndUpdate(req.params.id, req.body , { new: true })
  if(!data) next( new Error("This user is not found"))
  res.status(201).json({data})
})

exports.Delete = AsyncHandler(async (req, res , next) => {
  const data = await M_Product.findByIdAndDelete(req.params.id)
  if(!data) next( new Error("This user is not found"))
  res.status(200).json("تم الحذف")
})