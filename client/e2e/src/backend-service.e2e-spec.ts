import { env } from '../../src/environments/environment';
var http = require('http')

describe('Test Backend', () => {

  it('backend service should be online', () => {
    http.get(env.api_root, (res) => {
      var api = '';
      res.on("data", function (endpoint) {
        api += endpoint;
      });

      res.on('end', function () {
        expect(res.statusCode).toBe(400);
      });
    })
  });
});
