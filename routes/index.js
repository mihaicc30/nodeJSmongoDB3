const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-contactform').mongoURI;
const db2 = require('../config/key-bookingform').mongoURI;
var nodemailer = require('nodemailer');


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
// successfullbooking get
router.get('/successfullbooking', ensureAuthenticated, (req, res) => //, ensureAuthenticated
  res.render('successfullbooking', {
    user: req.user
  })
);
// successfullbooking post
router.post('/successfullbooking', function (req, res) {

  var { hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM, hotelUserName, hotelUserEmail} = req.body;
  // console.log(hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM);
  
  mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
    if (err) { console.log(err) }

    if (!hotelFORM || !from_dateFORM || !to_dateFORM || !roomTypeFORM) {
      req.flash('error_msg', 'Please enter all fields');
      res.redirect('/findaroom'); }

    if (hotelFORM === "undefined" || from_dateFORM === "undefined" || to_dateFORM === "undefined" || roomTypeFORM === "undefined") {
      req.flash('error_msg', 'Please choose a hotel first.');
      res.redirect('/findaroom'); }

    else {
      // console.log(hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM);
      db2.collection(hotelFORM).insertOne({ hotel:hotelFORM, fromDate:from_dateFORM, toDate:to_dateFORM, roomType:roomTypeFORM, extras:{breakfast:breakfastFORM, champagne:champagneFORM, car:rentcarFORM}, total:TOTALFORM, date: new Date() } )
      // console.log("success");
      req.flash('success_msg', 'Thank you for booking with us! Check your email for a confirmation! Kind regards, QualityHotel');
      res.redirect('/successfullbooking')
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mihaisolent@gmail.com',
          pass: 'mihaisolentmihaisolent'
        }
      });

      var emailMsg = "This is a confirmation email.\nThank you for booking with QualityHotel "+(hotelFORM.toUpperCase())+"! \nJust to confirm, your stay will be from "+from_dateFORM+" until "+to_dateFORM+" in our "+roomTypeFORM+" room.\nMore details will be provided at the reception and we apologize we only take payments on arrival.\nWishing you a pleasant stay and let us know if you require anything else!\nKind regards,\nQualityHotel Reception\n"+hotelFORM.toUpperCase();


      var mailOptions = {
        from: 'mihaisolent@gmail.com',
        to: 'alemihai25@gmail.com',
        cc: ''+hotelUserEmail+'',
        subject: 'QualityHotel - Booking Confirmation',
        text: emailMsg
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
        }
    })
})

// Index
router.get('/index', ensureAuthenticated, (req, res) => //, ensureAuthenticated
  res.render('index', {
    user: req.user
  })
);
var theChoices = [];
// Find a Room
router.get('/findaroom', ensureAuthenticated, (req, res) => // , ensureAuthenticated
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
router.get('/contact', (req, res) =>   //leaving this on purpose without ensureAuthenticated
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
