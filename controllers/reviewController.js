const { ObjectID } = require('mongodb');

const db = require('../db');


exports.addReview = async (req, res) => {
  if (!req.body.text) {
    req.flash('error', 'Your review must have text!');
    return res.redirect('back');
  }

  req.body.rating = parseInt(req.body.rating);
  req.body.created = Date.now();

  const result = await db.get().collection('reviews').insertOne({
    ...req.body,
    author: req.user._id,
    store: ObjectID(req.params.id)
  })

  if (result.result.ok === 1) {
    req.flash('success', 'Review added!');
  } else {
    req.flash('error', 'Oops! Something went wrong. Please try again later.');
  }
  res.redirect('back');
}