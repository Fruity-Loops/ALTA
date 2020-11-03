var http = require('http')

describe('Test Backend', () => {

  it('backend service should be online', () => {
    http.get("http://localhost:8000/", (res) => {
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
