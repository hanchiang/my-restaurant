const db = require('../db');

const multer = require('multer'); // handles multipart/form-data
const jimp = require('jimp');     // manipulate image
const uuid = require('uuid/v4');
const slug = require('slug');
const { validationResult } = require('express-validator/check');

const multerOptions = {
  storage: multer.memoryStorage(),
  filterFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not allowed' }, false);
    }
  }
}

exports.getStores = async (req, res) => {
  const stores = await db.get().collection('stores').find({}).toArray();

  res.render('stores', { title: 'Stores', stores });
}

exports.addStore = (req, res) => {
  res.render('storeForm', { title: 'Add Store' })
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(800, jimp.AUTO);
  await image.write(`./public/uploads/${req.body.photo}`);
  next();
  
}

exports.createStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.h.setFlashErrors(req, errors);
    return res.redirect('/add');
  }
  req.body.location.coordinates[0] = parseFloat(req.body.location.coordinates[0]);
  req.body.location.coordinates[1] = parseFloat(req.body.location.coordinates[1]);

  // handles the case when a slug already exist
  const stores = await db.get().collection('stores')
    .find({ slug: { $regex: new RegExp(`${slug(req.body.name)}(-\d+)?`) } })
    .toArray();
  if (stores.length > 0) {
    req.body.slug = slug(req.body.name) + '-' + (stores.length + 1);
  } else {
    req.body.slug = slug(req.body.name)
  }

  // Ensure that tags is an array. If only one tag is selected, it is passed as a string
  if (!Array.isArray(req.body.tags)) {
    req.body.tags = [req.body.tags];
  }


  const result = await db.get().collection('stores').insertOne(req.body);
  req.flash('success', `Successfully created ${req.body.name}. Care to leave a review?`);
  res.redirect(`/stores/${result.ops[0].slug}`);
}

exports.getStoreBySlug = async (req, res) => {
  const store = await db.get().collection('stores').findOne({ slug: req.params.slug })
  res.render('store', { title: store.slug, store });
}