const express = require('express')
const PORT = process.env.PORT || 8888
const request = require('request')

express()
  .get('/', (req, res) => appointments(req,res))
  .get('/vehicles/*', (req, res) => vehicles(req, res))
  .get('*', (req, res) => res.status(404).send(notFound(req)))
  .listen(PORT, () => console.log(`Listening on PORT: ${ PORT }, open http://localhost:${ PORT } to preview it`))

const api = 'https://one.nhtsa.gov/webapi/api/'

function appointments (req) {
  // console.log(req)
  return {result: 'success', detail: 'welcome to NHTSA Safety API'}
}

function error (message) {
  return {result: 'error', detail: message}
}

function vehicles (req, res) {
  const path = req.path.split('/')

  let modelyear = path[2]
  // check that model is a valid year
  if (1900 < modelyear && modelyear < 2020) {
    // valid
  } else {
    res.status(400).send(error('invalid model year specified'))
  }

  let make = path[3]
  // check that make is a valid string
  if (0 < make.length && make.length < 20) {
    // valid
  } else {
    res.status(400).send(error('invalid make specified'))
  }

  let model = path[4]
  // check that model is a valid string
  if (0 < model.length && model.length < 20) {
    // valid
  } else {
    res.status(400).send(error('invalid model specified'))
  }

  request(api + 'SafetyRatings/modelyear/' + modelyear.toString() + '/make/' + make + '/model/' + model + '?format=json', function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // response body
    let data = JSON.parse(response.body)

    let result = {
      Count: data.Count,
      Results: data.Results
    }

    res.send(result)
  })
}

function notFound(req) {
  return {result: 'error', detail: 'route not found'}
}
