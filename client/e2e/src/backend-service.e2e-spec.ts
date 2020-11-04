import { env } from '../../src/environments/environment';
const http = require('http');

describe('Test Backend', () => {

  it('backend service should be online', () => {
    http.get(env.api_root, (res) => {
      let api = '';
      res.on('data', (endpoint) => {
        api += endpoint;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    });
  });
});
