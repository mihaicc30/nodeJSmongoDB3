const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User')
const { forwardAuthenticated } = require('../config/auth');
const { db } = require('../models/User');
const bookings = require('../config/key-bookingform').mongoURI;
const messagesDB = require('../config/key-contactform').mongoURI;


// check bookings
router.post('/checkbookings', function (req, res) {
  var { city, date } = req.body;
  mongoose.createConnection(bookings, { useNewUrlParser: true, useUnifiedTopology: true }, (err, bookings) => {
    if (err) { console.log(err) }

    bookings.collection(city).find({ fromDate: date }).sort({ date: -1 }).toArray(function(err, result) {
      if (err) { console.log(err) }
      the_data = {}
      
      if (!result) { the_data={"found_data":false} }
      if (result.length === 0) { the_data={"found_data":false} }
      if (result.length > 0) { the_data=result }
      // console.log(result);
      // console.log("dataz>>>> ", the_data)
      // console.log(the_data)
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
  var { city } = req.body;
  mongoose.createConnection(messagesDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, messagesDB) => {
    if (err) { console.log(err) }

    messagesDB.collection(city).find().sort({ date: -1 }).toArray(function(err, result) {
      if (err) { console.log(err) }
      the_data = {}

      if (!result) { the_data={"found_data":false} }
      if (result.length === 0) { the_data={"found_data":false} }
      
      if (result.length > 0) { the_data=result;}
      // console.log(result);
      // console.log("dataz>>>> ", the_data[0]["hotel"])
      req.flash('bookings_data', the_data);
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
              req.flash('success_msg', 'You are now registered and can log in' );
              res.redirect('/users/login');
             })
              .catch(err => console.log(err));
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
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

// Update
router.post('/update', (req, res) => {
  const { email2, created2, name, email, phone, password } = req.body;

  let errors = [];
  creation_date = created2;

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

    // maybe i will update to db.collection("users").updateOne({ name:name2}, {$set:{name:name} }) 
    // but at the moment i am more relaxed with this :D
    db.collection("users").deleteOne({ email: email2 })
    const newUser = new User({
      name,
      email,
      phone,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.date = creation_date;
        newUser.name = name.toUpperCase();
        newUser.save().then(user => {
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

// Delete
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