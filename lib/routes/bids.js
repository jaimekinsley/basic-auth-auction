const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .findOneAndUpdate(
        { user: req.user._id,
          auction: req.body.auction },
        {
          user: req.user._id,
          auction: req.body.auction,
          price: req.body.price,
          quantity: req.body.quantity,
          accepted: false
        },
        { new: true, upsert: true })
      .then(bid => res.send(bid))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('auctions', 'users')
      .then(bid => res.send(bid))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
