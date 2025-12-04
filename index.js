// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql2')
var session = require('express-session')
const path = require('path')
require('dotenv').config()
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Create an input sanitizer
app.use(expressSanitizer());

// Set up public folder 
app.use(express.static(path.join(__dirname, 'public')))

// Creatse session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Middleware to make login status available in all .ejs pages
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    next();
})

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') 
    } else { 
        next (); 
    } 
}

app.locals.redirectLogin = redirectLogin

const db = mysql.createPool({
    host: 'localhost',
    user: process.env.BB_USER,        
    password: process.env.BB_PASSWORD, 
    database: process.env.BB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

app.locals.shopData = {shopName: "Bertie's Books"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)
 
// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

// Load weather routes
const weatherRoutes = require('./routes/weather');
app.use('/weather', weatherRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))