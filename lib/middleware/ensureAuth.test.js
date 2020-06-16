const { usernamePasswordReader } = require('./ensureAuth');

describe('ensureAuth middleware', () => {
  it('can read a username/password from the header', () => {
    const authorization = 'Basic amFpbWVAamFpbWUuY29tOjEyMzQ1';
    expect(usernamePasswordReader(authorization)).toEqual({
      username: 'jaime@jaime.com',
      password: '12345'
    });
  });
});
