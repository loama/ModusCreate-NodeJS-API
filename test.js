const { spawn } = require('child_process')
const request = require('request')
const test = require('tape')

// Start the app
const env = Object.assign({}, process.env, {PORT: 8888})
const child = spawn('node', ['index.js'], {env})

test('correct index', (t) => {
  t.plan(9)
  // Wait until the server is ready
  child.stdout.on('data', _ => {
    // Make a request to our app
    request('http://localhost:8888', (error, response, body) => {
      // stop the server

      // No error
      t.false(error)
      // Successful response
      t.equal(response.statusCode, 200)
      // Assert content checks
      t.equal(JSON.parse(response.body).result, 'success')
      t.equal(JSON.parse(response.body).detail, 'welcome to NHTSA Safety API')
    })

    request('http://localhost:8888/vehicles/2015/Audi/A3', (error, response, body) => {
      // stop the server
      child.kill()

      // Successful response
      t.equal(response.statusCode, 200)
      // Assert content checks
      t.equal(JSON.parse(response.body).Count, 4)
      t.equal(Array.isArray(JSON.parse(response.body).Results), true)
      t.notEqual(JSON.parse(response.body).Results.length, 0)
      t.equal(JSON.parse(response.body).Results[0].CrashRating, undefined)
    })
  })
})
