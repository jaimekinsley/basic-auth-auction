const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

describe('bid routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'jaime@jaime.com',
      password: '12345'
    });
  });

  let auction;
  beforeEach(async() => {
    auction = await Auction.create({
      user: user._id,
      title: 'Nossa Familia Coffee',
      description: 'Light roast',
      quantity: '20 lbs',
      ending: '2020-06-18T16:00:00Z'
    });
  });

  const date = new Date();

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new bid with POST', async() => {
    return request(app)
      .post('/api/v1/bids')
      .auth('jaime@jaime.com', '12345')
      .send({
        user: user._id,
        auction: auction._id,
        price: '$50',
        quantity: '10 lbs',
        submitted: date,
        accepted: false
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: '$50',
          quantity: '10 lbs',
          submitted: date.toISOString(),
          accepted: false,
          __v: 0
        });
      });
  });

  it('gets a bid by id with GET', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: '$50',
      quantity: '10 lbs',
      submitted: date,
      accepted: false
    });

    return request(app).get(`/api/v1/bids/${bid._id}`)
      .auth('jaime@jaime.com', '12345')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: '$50',
          quantity: '10 lbs',
          submitted: date.toISOString(),
          accepted: false,
          __v: 0
        });
      });
  });

  it('deletes a bid by id with DELETE', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: '$50',
      quantity: '10 lbs',
      submitted: date,
      accepted: false
    });

    return request(app).delete(`/api/v1/bids/${bid._id}`)
      .auth('jaime@jaime.com', '12345')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: '$50',
          quantity: '10 lbs',
          submitted: date.toISOString(),
          accepted: false,
          __v: 0
        });
      });
  });
});
