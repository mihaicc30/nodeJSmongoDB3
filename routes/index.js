const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-contactform').mongoURI;



// Admin - Bookings
router.get('/bookings', (req, res) => // , ensureAuthenticated
  res.render('bookings', {
    user: req.user
  })
);



// Home Page
router.get('/', forwardAuthenticated, (req, res) => res.render('landing'));

// Contact Form
router.post('/contact', function (req, res) {
  var { name, email, telephone, comment, city } = req.body;

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }

    if (!name || !email || !telephone || !comment || !city) {
      req.flash('error_msg', 'Please enter all fields')
      res.redirect('/contact') }

    if (name.length < 1 || email.length < 1 || telephone.length < 1 || comment.length < 1) { 
      req.flash('error_msg', 'Please enter all fields')
      res.redirect('/contact') }

    else {
      db.collection(city).insertOne({ name: name, email: email, telephone: telephone, comment: comment, date: new Date() } )
        req.flash('success_msg', 'Thank you for contacting us. You message has been successfully sent to QualityB&B in ' + city + '!');
        res.redirect('/contact')
        }
    })
})

// Index
router.get('/index', (req, res) => //, ensureAuthenticated
  res.render('index', {
    user: req.user
  })
);

// Find a Room
router.get('/findaroom', ensureAuthenticated, (req, res) =>
  res.render('findaroom', {
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
