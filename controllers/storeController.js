const db = require('../db');

const multer = require('multer'); // handles multipart/form-data
const jimp = require('jimp');     // manipulate image
const uuid = require('uuid/v4');
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

exports.getStores = (req, res) => {
  res.render('layout', { title: 'My Express App' });
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
    return res.status(422).json({ errors: errors.array().map(error => ({message: error.msg}) )});
  }


  const result = await db.get().collection('Stores').insertOne(req.body)
  if (result.result.ok === 1) {
    console.log(`Successfully inserted ${result.result.n} document`);
    console.log(result.ops);
  }
  res.redirect('/');
}