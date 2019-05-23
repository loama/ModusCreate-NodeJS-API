const express = require('express')
const PORT = process.env.PORT || 8888
const axios = require('axios')
const cors = require('cors')

express()
  .use(express.json())
  .use(cors())
  .get('/', (req, res) => index(req,res))
  .get('/vehicles/*', (req, res) => vehicles(req, res))
  .post('/vehicles', (req, res) => vehicles(req, res))
  .get('/cors/*', (req, res) => corsCleaner(req, res))
  .get('*', (req, res) => res.status(404).send(notFound(req)))
  .listen(PORT, () => console.log(`Listening on PORT: ${ PORT }, open http://localhost:${ PORT } to preview it`))

const api = 'https://one.nhtsa.gov/webapi/api/'

function index (req, res) {
  axios.get(api + 'SafetyRatings' + '?format=json')
    .then((response) => {
      res.send({result: 'success', detail: 'welcome to NHTSA Safety API', Results: response.data.Results})
    })
    .catch((err) => {

    })
}

function error (message) {
  return {Count: 0, Results: [], result: 'error', detail: message}
}

function vehicles (req, res) {
  let modelYear, make, model

  if (req.method === 'GET') {
    const path = req.path.split('/')
    modelyear = path[2]
    make = path[3]
    model = path[4]
  } else if (req.method === 'POST') {
    modelyear = req.body.modelYear
    make = req.body.manufacturer
    model = req.body.model
  }

// VALIDATE DATA
  // check that model is a valid year
  if (1900 < modelyear && modelyear < 2020) {
    // valid
  } else {
    res.status(400).send(error('invalid model year specified'))
  }

  // check that make is a valid string
  if (0 < make.length && make.length < 20) {
    // valid
  } else {
    res.status(400).send(error('invalid make (manufacturer) specified'))
  }

  // check that model is a valid string
  if (0 < model.length && model.length < 20) {
    // valid
  } else {
    res.status(400).send(error('invalid model specified'))
  }
// END DATA VALIDATION

// DO THE API REQUESTS
  axios.get(api + 'SafetyRatings/modelyear/' + modelyear.toString() + '/make/' + make + '/model/' + model + '?format=json')
    .then((response) => {

      let results = []
      let vehicles = response.data.Results

      for (let i = 0; i < vehicles.length; i++) {
        results.push({
          Description: vehicles[i]['VehicleDescription'],
          VehicleId: vehicles[i]['VehicleId']
        })
      }

      var result = {
        Count: response.data.Count,
        Results: results
      }

      var requests = [] // Create an array for all the requests that axios should make
      if (req.query.withRating === 'true') {
        // if withRating, add rating to every result
        for (let i = 0; i < results.length; i++) {
          requests.push(axios.get(api + 'SafetyRatings/VehicleId/' + vehicles[i]['VehicleId'].toString() + '?format=json'))
        }

        axios.all(requests).then((response) => {
          results = []
          response.forEach((carRating => {
            var car = {
              CrashRating: carRating.data.Results[0].OverallRating,
              Description: carRating.data.Results[0].VehicleDescription,
              VehicleId: carRating.data.Results[0].VehicleId
            }
            results.push(car)
          }))

          result.Results = results
          res.send(result)
        })

      } else {
        res.send(result)
      }

    })
}

function corsCleaner(req, res) {
  let path = req.path.split('cors/')[1]
  console.log(api + 'SafetyRatings/' + path + '/?format=json')
  axios.get(api + 'SafetyRatings/' + path + '/?format=json')
    .then((response) => {
      res.send(response.data)
    })
}

function notFound(req) {
  return {result: 'error', detail: 'route not found'}
}
