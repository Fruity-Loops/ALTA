import { env } from '../../src/environments/environment';
const http = require('http');

describe('Test Backend Connection', () => {

  it('backend service should be online', () => {
    const req = http.get(env.api_root, (res) => {
      let api = '';
      res.on('data', (endpoint) => {
        api += endpoint;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    });
    req.on('error', (err) => {    
      console.error('Test Backend Connection,', err);
      process.exit(1); // If cannot connect, stop all tests early
    });
  });
});
