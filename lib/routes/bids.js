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
      .then(auction => res.send(auction))
      .catch(next);
  });
