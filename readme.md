## Readme

Node JS API with car safety information from https://one.nhtsa.gov based on [requirements](https://github.com/loama/ModusCreate-NodeJS-API/blob/master/node-api-assignment.md) from Modus Create.

You can check it out directly at https://api.modus.com.mx

It has all the requirements plus tests, continuous integration and is deployed to a [heroku server](https://api.modus.com.mx).

## Commands

Clone the repo and run `npm install`

environment | command | description
------------|---------|------------|
development | `npm run develop`| runs the project with hot reloading capabilities in https://localhost:8888 |
test        | `npm run test` | run tests for the project, built with [Tape](https://www.npmjs.com/package/tape)
start       | `npm start` | run the project normally, this would run in the actual server


## Endpoints

**GET**: [http://localhost:8888/vehicles/{{model year}}/{{manufacturer}}/{{model}}](http://localhost:8888/vehicles/2015/audi/a3)
options: [?withRating=true](http://localhost:8888/vehicles/2015/audi/a3?withRating=true)



**POST**: [http://localhost:8888/vehicles](http://localhost:8888/vehicles)
options: [?withRating=true](http://localhost:8888/vehicles?withRating=true)
body:
```javascript
{
	"modelYear": 2015,
	"manufacturer": "audi",
	"model": "A3"
}
```

## Project Structure

Most of the code is in `index.js`, routes and logic.

`travis.yml`: travis (CI) configuration.
`Procfile`: heroku server configuration.
`test.js`: tests with tape

## Consideration

When the user forgets to send a parameter or the parameter is not valid, we return the standard empty response plus a `result: error` and details for it.
