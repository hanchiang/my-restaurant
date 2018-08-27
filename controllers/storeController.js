const multer = require('multer'); // handles multipart/form-data
const jimp = require('jimp');     // manipulate image
const uuid = require('uuid/v4');
const slug = require('slug');
const { validationResult } = require('express-validator/check');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const db = require('../db');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true);
    } else {
      // next({ message: 'That filetype is not allowed' }, false);
      // Override default behaviour with flash error
      req.fileError = true;
      next(null, false);
    }
  }
}

exports.getStores = async (req, res) => {
  const stores = await db.get().collection('stores').find({}).toArray()
  const sortedStores = _.orderBy(stores, ['created'], ['desc']);

  res.render('stores', { title: 'Stores', stores: sortedStores });
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
    if (req.fileError) {
      res.locals.h.setValidationErrors(req, errors.array().concat({ msg: 'That file type is not allowed' }));
    } else {
      res.locals.h.setValidationErrors(req, errors.array());
    }
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
    req.body.slug = slug(req.body.name);
  }

  // Ensure that tags is an array, because if only one tag is selected, it is passed as a string
  if (req.body.tags && !Array.isArray(req.body.tags)) {
    req.body.tags = [req.body.tags];
  }

  const now = new Date();
  req.body.created = now;
  req.body.updated = now;

  // Add id of user to store
  req.body.author = req.user._id;

  const result = await db.get().collection('stores').insertOne(req.body);
  req.flash('success', `Successfully created ${req.body.name}. Care to leave a review?`);
  res.redirect(`/stores/${result.ops[0].slug}`);
}

exports.getStoreBySlug = async (req, res) => {
  const store = await db.get().collection('stores').findOne({ slug: req.params.slug })
  res.render('store', { title: store.slug, store });
}

exports.editStore = async (req, res) => {
  const store = await db.get().collection('stores').findOne({ _id: ObjectID(req.params.id) });
  res.render('storeForm', { title: 'Edit Store', store });
}

exports.updateStore = async (req, res) => {
  const toUpdate = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    updated: new Date()
  };
  const toDelete = { somethingThatDontExist: '' };

  // If user upload new photo, update it. Do not delete photo if there no photo uploaded?
  if (req.body.photo) toUpdate.photo = req.body.photo;
  if (req.body.tags) toUpdate.tags = req.body.tags;
  else toDelete.tags = '';

  const store = await db.get().collection('stores').findOneAndUpdate(
    { _id: ObjectID(req.params.id) },
    { 
      $set: toUpdate,
      $unset: toDelete
    },
    { returnNewDocument: true }
  );

  console.log(store);
  req.flash('success', `Successfully updated store! Check it out <strong><a href='/stores/${store.slug}'>here</a></strong> `);
  res.redirect('back');
}