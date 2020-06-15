const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new auction with POST', async() => {
    const user = await User.create({
      email: 'jaime@jaime.com',
      password: '12345'
    });

    return request(app)
      .post('/api/v1/auctions')
      .auth('jaime@jaime.com', '12345')
      .send({
        user: user.id,
        title: 'Nossa Familia Coffee',
        description: 'Light roast',
        quantity: '20 lbs',
        ending: '2020-06-18T16:00:00Z'
      });
  });
});
