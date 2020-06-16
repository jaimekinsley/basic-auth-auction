const { Router } = require('express');
const Auction = require('../models/Auction');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        ending: req.body.ending
      })
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('bids')
      .then(auction => res.send(auction))
      .catch(next);
  });
