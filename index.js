const express = require('express')
const PORT = process.env.PORT || 8888
const axios = require('axios')

express()
  .use(express.json())
  .get('/', (req, res) => index(req,res))
  .get('/vehicles/*', (req, res) => vehicles(req, res))
  .post('/vehicles', (req, res) => vehicles(req, res))
  .get('*', (req, res) => res.status(404).send(notFound(req)))
  .listen(PORT, () => console.log(`Listening on PORT: ${ PORT }, open http://localhost:${ PORT } to preview it`))

const api = 'https://one.nhtsa.gov/webapi/api/'

function index (req, res) {
  // console.log(req)
  res.send({result: 'success', detail: 'welcome to NHTSA Safety API'})
}

function error (message) {
  return {result: 'error', detail: message}
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

  axios.get(api + 'SafetyRatings/modelyear/' + modelyear.toString() + '/make/' + make + '/model/' + model + '?format=json')
    .then((response) => {
      // console.log(response.data)
      var results = []
      var requests = []

      var result = {
        Count: response.data.Count,
        Results: response.data.Results
      }

      if (req.query.withRating || req.body.withRating) {
        // if withRating, add rating to every result
        for (let i = 0; i < response.data.Results.length; i++) {
          requests.push(axios.get(api + 'SafetyRatings/VehicleId/' + response.data.Results[i].VehicleId.toString() + '?format=json'))
        }

        axios.all(requests).then((response) => {
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

function notFound(req) {
  return {result: 'error', detail: 'route not found'}
}
