const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-contactform').mongoURI;



// Home Page
router.get('/', forwardAuthenticated, (req, res) => res.render('landing'));


// Contact Form
router.post('/contact', function (req, res) {
  var { name, email, telephone, comment, city } = req.body;

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }
    db.collection(city).insertOne({ name: name, email: email, telephone: telephone, comment: comment })
  });
  res.redirect('/contact');
});

// Index
router.get('/index', (req, res) =>
  res.render('index', {
    user: req.user
  })
);
// Index
router.get('/contactform', (req, res) =>
  res.render('contactform', {
    user: req.user
  })
);

// Find a Room
router.get('/findaroom', ensureAuthenticated, (req, res) =>
  res.render('findaroom', {
    user: req.user
  })
);
// Admin - Bookings
router.get('/bookings', ensureAuthenticated, (req, res) =>
  res.render('bookings', {
    user: req.user
  })
);
// About
router.get('/about', ensureAuthenticated, (req, res) =>
  res.render('about', {
    user: req.user
  })
);
// FAQ
router.get('/faq', ensureAuthenticated, (req, res) =>
  res.render('faq', {
    user: req.user
  })
);
// Contact
router.get('/contact', ensureAuthenticated, (req, res) =>
  res.render('contact', {
    user: req.user
  })
);
// MyProfile
router.get('/myprofile', ensureAuthenticated, (req, res) =>
  res.render('myprofile', {
    user: req.user
  })
);

module.exports = router;
