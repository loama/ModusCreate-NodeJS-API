const express = require('express')
const PORT = process.env.PORT || 8888

express()
  .get('/', (req, res) => res.send('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
