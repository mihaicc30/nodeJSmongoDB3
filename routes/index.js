const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-contactform').mongoURI;
const db2 = require('../config/key-bookingform').mongoURI;
var nodemailer = require('nodemailer');


// Admin - Bookings
router.get('/bookings', ensureAuthenticated, (req, res) => // 
  res.render('bookings', {
    user: req.user,
  })
);


// Admin - Messages
router.get('/messages', ensureAuthenticated, (req, res) => // 
  res.render('messages', {
    user: req.user
  })
);


// Home Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

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
router.post('/successfullbooking', ensureAuthenticated, function (req, res) {

  var { hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM, hotelUserName, hotelUserEmail,hotelUserPhone} = req.body;
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
      if (breakfastFORM.valueOf() == "true") { var needBreakfast = "breakfast"} else { var needBreakfast = ""};
      if (champagneFORM.valueOf() == "true") { var needChampagne = "champagne"} else { var needChampagne = ""};
      if (rentcarFORM.valueOf() == "true") { var needCar = "car"} else { var needCar = ""};

      db2.collection(hotelFORM).insertOne({ customer:hotelUserName, customerEmail:hotelUserEmail, customerPhone:hotelUserPhone, hotel:hotelFORM, fromDate:from_dateFORM, toDate:to_dateFORM, roomType:roomTypeFORM, extras:{breakfast:needBreakfast, champagne:needChampagne, car:needCar}, total:TOTALFORM, date: new Date() } )

      req.flash('success_msg', 'Thank you '+hotelUserName+' for booking with us! Check your email for a confirmation! Kind regards, QualityHotel');
      res.redirect('/successfullbooking')
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mihaisolent@gmail.com',
          pass: 'mihaisolentmihaisolent'
        }
      });

      var emailMsg = " Email for "+hotelUserEmail+"\n \n \nThis is a confirmation email.\nThank you for booking with QualityHotel "+(hotelFORM.toUpperCase())+"! \n \nJust to confirm, your stay will be from "+from_dateFORM+" until "+to_dateFORM+" in our "+roomTypeFORM+" room.\nMore details will be provided at the reception and we apologize we only take payments on arrival.\n \nWishing you a pleasant stay and let us know if you require anything else!\n \n \nKind regards,\nQualityHotel Reception\n"+hotelFORM.toUpperCase();


      var mailOptions = {
        from: 'mihaisolent@gmail.com',
        to: 'mihaisolent@gmail.com',
        subject: 'QualityHotel - Booking Confirmation '+(new Date().toISOString().slice(0, 10)),
        text: emailMsg
      };

      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
        }
    })
})

// Index
router.get('/index', (req, res) => //, ensureAuthenticated
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
router.get('/about', (req, res) => // , ensureAuthenticated
  res.render('about', {
    user: req.user
  })
);
// FAQ
router.get('/faq', (req, res) => // , ensureAuthenticated
  res.render('faq', {
    user: req.user
  })
);
// Contact
router.get('/contact', (req, res) =>   // , ensureAuthenticated  - leaving this on purpose without ensureAuthenticated
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
