const express = require('express')
const PORT = process.env.PORT || 8888

express()
  .get('/', (req, res) => res.send(appointments(req)))
  .get('*', (req, res) => res.status(404).send(notFound(req)))
  .listen(PORT, () => console.log(`Listening on PORT: ${ PORT }, open http://localhost:${ PORT } to preview it`))

function appointments (req) {
  // console.log(req)
  return {path: req.path}
}

function notFound(req) {
  return {result: 'error', detail: 'route not found'}
}
