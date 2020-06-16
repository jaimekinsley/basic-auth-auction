const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');
const Auction = require('../models/Auction');

module.exports = Router()
  .post('/', ensureAuth, async(req, res, next) => {
    const auction = await Auction.find({ _id: { $eq: req.body.auction } });

    if(auction[0].ending >= new Date(req.body.submitted)) {
      return Bid
        .findOneAndUpdate(
          { user: req.body.user,
            auction: req.body.auction },
          {
            user: req.body.user,
            auction: req.body.auction,
            price: req.body.price,
            quantity: req.body.quantity,
            submitted: req.body.submitted,
            accepted: false
          },
          { new: true, upsert: true })
        .then(bid => res.send(bid))
        .catch(next);
    }})

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
