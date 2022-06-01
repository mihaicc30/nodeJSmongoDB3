const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User')
const { forwardAuthenticated } = require('../config/auth');
const dotenv = require('dotenv');
dotenv.config();
var db = process.env.mongoURI;
const nodemailer = require('nodemailer');

// check bookings
router.post('/checkbookings', function (req, res) {
  var { city, date } = req.body;
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }

    // bookings.collection(city).aggregate([
    //   { $addFields: {stringDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
    //   { $match: {"stringDate":date}},
    //   { $project:{"stringDate":0}}
    //   ]).sort({ date: -1 }).toArray(function(err, result) {
    //     if (err) { console.log(err) }  // new version of command, searches by date CREATED !important but prefer to use the other one

    db.collection("bookings").find({ fromDate: { $gte : date}, hotel: { $eq: city } }).sort({ date: -1 }).toArray(function (err, result) {
      if (err) { console.log(err) }  // old version of command,  searches by date of BOOKING !important // works better with my website and the way i want it to be
      the_data = {}
      searchedDate = {"searchedDate" : date }
      if (!result)              { searchedDate, the_data = { "found_data": false, "fromDate": date, "hotel": city } }
      if (result.length === 0)  { searchedDate, the_data = { "found_data": false, "fromDate": date, "hotel": city } }
      if (result.length > 0)    { searchedDate, the_data = result }
      req.flash(
        'bookings_data',
        the_data
      );

      res.redirect('/bookings');
    });
  });
});

// check messages
router.post('/checkmessages', function (req, res) {
  var { city, date } = req.body;

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }
    db.collection("messages").find({ "date": { $gte: date }, "location": city }).sort({ date: -1 }).toArray(function (err, result) {
      if (err) { console.log(err) }
      the_data = {}
      searchedDate = {"searchedDate" : date }
      if (!result)             { searchedDate, the_data = { "found_data": false, "date": date, "location": city } }
      if (result.length === 0) { searchedDate, the_data = { "found_data": false, "date": date, "location": city } }

      if (result.length > 0)   { searchedDate, the_data = result }
      req.flash('bookings_data', the_data );
      res.redirect('/messages');
    });
  });
});


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, phone, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !phone) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const date_created = new Date()
        const newUser = new User({
          name,
          email,
          phone,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.date = date_created;
            newUser.name = name.toUpperCase();
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
                      ///////////////// sending email //////////////////////

              var transporter = nodemailer.createTransport(({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                  user: 'mihaisolent@gmail.com',
                  pass: 'mihaisolentmihaisolent'
                }
              }));
              var emailMsg = "Dear "+name+",\n\n\n"+
              "Thank you for registering with us \n"+"Hope you will have a pleasant stay with us!\n"+
              "Otherwise, please do tell! :D\n\n\n"+
              "Kind regards\nQualityHotel Team"

              var mailOptions = {
                from: 'mihaisolent@gmail.com',
                to: email,
                subject: 'QualityHotel - Welcome abord! ' + (new Date().toISOString().slice(0, 10)),
                text: emailMsg
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });  
              ///////////////////////////////////////
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out.');
  res.redirect('login');
});

// User Account Update
router.post('/update', (req, res) => {
  var { email2, created2, name, email, phone, password } = req.body;

  let errors = [];

  if (!name || !email || !phone || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('myprofile', {
      errors, name, email, phone, password
    });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        password = hash;
        name = name.toUpperCase();

        var updatedUser = User.updateOne({ _id: req.user._id}, { $set: { "name":name, "email":email, "password":hash, "lastUpdated": new Date } } )

        updatedUser.then(user => {
          req.flash(
            'success_msg',
            'You profile has been updates. You can now log in with your new credentials.'
          );
          res.redirect('/users/login');
        })
          .catch(err => console.log(err));
      });
    });
  }
})

// User Account Delete
router.post('/delete', (req, res) => {
  const { email } = req.body;
  db.collection("users").deleteOne({ email: email })
  req.flash(
    'success_msg',
    'We are sad to see you go! Hopes for the best. Your profile has been deleted.'
  );
  res.redirect('/users/login');
})

module.exports = router;