const debug = require('debug')('app:startup')
//const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require('morgan')
const express = require('express');
const logger = require('./middleware/logger')
const home = require('./routes/home')
const courses = require('./routes/courses')
const auth = require('./auth')
const app = express();
const helmet = require('express');
const Joi = require('joi'); // this uppercase because return a class

// Set template engines using pug
app.set('view engine', 'pug')
app.set('views', './views'); // default

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`)

// Configuration
console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail Password: ${config.get('mail.password')}`)

// built-in middleware
//--------------------------------
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}))
app.use(express.static('public'))
//---------------------------------

// third party middleware
//---------------------------------
app.use(helmet())
app.use('/api/courses', courses)
app.use('/', home)

// setting morgan to be used only in development
if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
  debug('Morgan enabled...') // console.log()
}
//---------------------------------

// Db work...
//dbDebugger('Connected to the database...')

// custom middleware
//----------------
app.use(logger);
app.use(auth);
//-----------------------

// env = envirounment variable: PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));