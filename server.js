require('dotenv').config()
const express = require('express')
// express server module is a function which return objects which we will store in app variable
const app = express()
// Import ejs module for create dynamic webpage
const ejs = require('ejs')
// Express-ejs-layouts for create layout page to stop dublication of code in all ejs file
const expressLayout = require('express-ejs-layouts')
// Import path module to add paths in some functions
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')

// if there is port then assign that port number otherwise port number will be 3000
var PORT = process.env.PORT || 3000

// Manage mongo server
mongoose.connect('mongodb+srv://test:test@cluster0.nrarj.mongodb.net/pizza?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, 'useCreateIndex': true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...')
}).catch(err => {
    console.log('Connection Failed..')
})


//Session Store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions',
})

//  Set Session and Cookie
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})



// Telling server that where is all static files(ex. CSS, JS, Images)
app.use(express.static('public'))
app.use(expressLayout)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Telling server Where is all template files(ejs files)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')

// Import our web routes and execute it.
require('./routes/web')(app)


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})