const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

describe('auction routes', () => {
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

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new auction with POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .auth('jaime@jaime.com', '12345')
      .send({
        user: user._id,
        title: 'Nossa Familia Coffee',
        description: 'Light roast',
        quantity: '20 lbs',
        ending: '2020-06-18T16:00:00Z'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'Nossa Familia Coffee',
          description: 'Light roast',
          quantity: '20 lbs',
          ending: '2020-06-18T16:00:00.000Z',
          __v: 0
        });
      });
  });

  it('gets the auction details by id with GET', async() => {
    const auction = await Auction.create({
      user: user._id,
      title: 'Nossa Familia Coffee',
      description: 'Light roast',
      quantity: '20 lbs',
      ending: '2020-06-18T16:00:00Z'
    });

    await Bid.create({
      user: user._id,
      auction: auction._id,
      price: '$50',
      quantity: '10 lbs',
      submitted: '2020-06-18T16:00:00.000Z',
      accepted: false
    });
    return request(app).get(`/api/v1/auctions/${auction._id}`)
      .auth('jaime@jaime.com', '12345')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'Nossa Familia Coffee',
          description: 'Light roast',
          quantity: '20 lbs',
          ending: '2020-06-18T16:00:00.000Z',
          __v: 0,
          bids: [{
            _id: expect.anything(),
            user: user.id,
            auction: auction.id,
            price: '$50',
            quantity: '10 lbs',
            submitted: '2020-06-18T16:00:00.000Z',
            accepted: false,
            __v: 0
          }]
        });
      });
  });

  it('gets all auctions with GET', async() => {
    const auctions = await Auction.create([
      {
        user: user._id,
        title: 'Nossa Familia Coffee',
        description: 'Light roast',
        quantity: '20 lbs',
        ending: '2020-06-18T16:00:00Z'
      },
      {
        user: user._id,
        title: 'La Colombe',
        description: 'Medium roast',
        quantity: '40 lbs',
        ending: '2020-06-19T16:00:00Z'
      }]);

    return request(app).get('/api/v1/auctions/')
      .auth('jaime@jaime.com', '12345')
      .then(res => {
        for(let i = 0; i < res.body.length; i++){
          expect(res.body[i]).toEqual({
            _id: expect.anything(),
            title: auctions[i].title
          });
        }
      });
  });
});
