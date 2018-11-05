var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send({a:'b'})
});

app.get('/abc', function(req, res) {
  res.send('abcd')
});

app.listen(8888, function () {
  console.log('ModusCreate-NodeJS-API listening on port 8888!');
});
