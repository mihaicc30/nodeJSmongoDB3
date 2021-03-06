const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('cookie-session');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const dotenv = require('dotenv');
dotenv.config();
var db = process.env.mongoURI;

// Connect to MongoDB
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: '1234567890qwertpoiuyasdflkjzxcvmnQWEOPIUASDFLKHZXCMn',
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours, a number representing the milliseconds from Date.now() for expiry
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.bookings_data = req.flash('bookings_data');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(express.static('../config'));
app.use('/index', require('./routes/index.js'));
app.use('/', require('./routes/faq'));
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/controller.js'));
app.use('/users', require('./routes/users.js'));
app.use('/imgs', express.static('./imgs'))
app.use('/config', express.static('./config'))

app.all('*', (req, res) => {
  res.render("./invalid_page.ejs")
})

process.on("SIGHUP", function () {
  console.log("Stopping NodeJS server.");
  setTimeout(function() {
    process.exit();
 }, 2000);
})

const PORT = process.env.PORT || 5555;
app.listen(PORT, console.log(`--QualityHotel App-- Server running on ${PORT}`));

// if (dev_mode == true) { require('child_process').exec('start http://localhost:'+PORT);}  // only if you want the browser to open automatically 