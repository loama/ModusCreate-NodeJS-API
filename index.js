const express = require('express')
const PORT = process.env.PORT || 8888

express()
  .get('/', (req, res) => res.send(appointments(req)))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function appointments (req) {
  console.log(req)
  return req.path
}
