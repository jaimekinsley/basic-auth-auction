const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

describe('auth routes', () => {
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

  it('signs up a user via POST /signup', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'jaime@jaime.com',
        password: '12345'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'jaime@jaime.com'
        });
      });
  });
});
