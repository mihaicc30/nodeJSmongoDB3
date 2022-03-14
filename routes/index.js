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
router.get('/index', forwardAuthenticated, (req, res) => res.render('index'));

// Contact Form
router.post('/contact', function (req, res) {
  var { name, email, telephone, comment, city } = req.body;

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }

    if (!name || !email || !telephone || !comment || !city) {
      req.flash('error_msg', 'Please enter all fields')
      res.redirect('/contact')
    }

    if (name.length < 1 || email.length < 1 || telephone.length < 1 || comment.length < 1) {
      req.flash('error_msg', 'Please enter all fields')
      res.redirect('/contact')
    }

    else {
      db.collection(city).insertOne({ name: name, email: email, telephone: telephone, comment: comment.trim(), location: city, date: new Date().toISOString().slice(0, 10), status: "unread" })
      req.flash('success_msg', 'Thank you for contacting us. You message has been successfully sent to QualityB&B in ' + city + '!');
      res.redirect('/contact')
    }
  })
})

// Admin Form - Edit Contact Messages
router.post('/messagesedit', ensureAuthenticated, function (req, res) { //
  var { modalName, modalEmail, modalTelephone, modalDate, modalStatus, modalMessage, modalName2, modalEmail2, modalTelephone2, modalDate2, modalMessage2, modalStatus2, messageLocation2 } = req.body;

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }

    else {
      db.collection(messageLocation2).updateOne(
        { name: { $eq: modalName2 }, email: { $eq: modalEmail2 }, telephone: { $eq: modalTelephone2 }, comment: { $eq: modalMessage2 }, status: { $eq: modalStatus2 } }, {
        $set:
          { name: modalName, email: modalEmail, telephone: modalTelephone, comment: modalMessage.trim(), status: modalStatus, date: modalDate }
      })
      res.redirect('/messages')
    }
  })
})

// Admin Form - Delete Contact Messages
router.post('/messagesdelete', ensureAuthenticated, function (req, res) {
  var { modalName, modalEmail, modalTelephone, messageStatus, modalDate, modalMessage, modalName2, modalEmail2, modalTelephone2, modalDate2, modalMessage2, messageLocation2, messageStatus2 } = req.body;
  messageLocation2 = messageLocation2.trim();

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) }

    else {
      db.collection(messageLocation2).deleteOne(
        { name: modalName2, email: modalEmail2, telephone: modalTelephone2, comment: modalMessage2 })
      res.redirect('/messages')
    }
  })
})


// Admin Form - Edit Bookings
router.post('/bookingedit', ensureAuthenticated, function (req, res) {
  var { modalname, modalemail, modalhotel, modalcheckin, modalcheckout, modalroomtype, modalbreakfast, modalchampagne, modalcar, modaltotal,
    modalname2, modalemail2, modalhotel2, modalcheckin2, modalcheckout2, modalroomtype2, modalbreakfast2, modalchampagne2, modalcar2, modaltotal2 } = req.body;

  mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
    if (err) { console.log(err) }

    else {
      db2.collection(modalhotel).updateOne(
        { customer: { $eq: modalname2 }, customerEmail: { $eq: modalemail2 }, fromDate: { $eq: modalcheckin2 }, toDate: { $eq: modalcheckout2 }, roomType: { $eq: modalroomtype2 }, total: { $eq: modaltotal2 } },
        {
          $set:
            { customer: modalname, customerEmail: modalemail, hotel: modalhotel, fromDate: modalcheckin, toDate: modalcheckout, roomType: modalroomtype, extras: { breakfast: modalbreakfast, champagne: modalchampagne, car: modalcar }, total: modaltotal }
        })
      res.redirect('/bookings')
    }
  })
})

// Admin Form - Delete Bookings
router.post('/bookingdelete', ensureAuthenticated, function (req, res) {
  var { modalname, modalemail, modaltelephone, modalhotel, modalcheckin, modalcheckout, modalroomtype, modalbreakfast, modalchampagne, modalcar, modaltotal,
    modalname2, modalemail2, modaltelephone2, modalhotel2, modalcheckin2, modalcheckout2, modalroomtype2, modalbreakfast2, modalchampagne2, modalcar2, modaltotal2 } = req.body;

  mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
    if (err) { console.log(err) }

    else {
      console.log(modalname2, modalemail2, modalcheckin2, modalcheckout2, modaltotal2)
      db2.collection(modalhotel2).deleteOne(
        { customer: { $eq: modalname2 }, customerEmail: { $eq: modalemail2 }, fromDate: { $eq: modalcheckin2 }, toDate: { $eq: modalcheckout2 }, total: { $eq: modaltotal2 } })
      res.redirect('/bookings')
      // send cancelation email
      console.log("canceling email", modalemail2)
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mihaisolent@gmail.com',
          pass: 'mihaisolentmihaisolent'
        }
      });

      var emailMsg = "Dear " + modalname2 + "\n  \nThis is a cancelation email of your booking on " + modalcheckin2 + " in " + modalhotel2 + "\n   \nWe are sorry for any inconvenience and hope to see you again!\n   \nKind Regards,\nReception Team " + modalhotel2;


      var mailOptions = {
        from: 'mihaisolent@gmail.com',
        to: modalemail2,
        subject: 'QualityHotel - Booking Cancelation Executed ' + (new Date().toISOString().slice(0, 10)),
        text: emailMsg
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });



      //end of cancelation email
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

  var { hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM, hotelUserName, hotelUserEmail, hotelUserPhone } = req.body;
  // console.log(hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM);

  mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
    if (err) { console.log(err) }

    if (!hotelFORM || !from_dateFORM || !to_dateFORM || !roomTypeFORM) {
      req.flash('error_msg', 'Please enter all fields');
      res.redirect('/findaroom');
    }

    if (hotelFORM === "undefined" || from_dateFORM === "undefined" || to_dateFORM === "undefined" || roomTypeFORM === "undefined") {
      req.flash('error_msg', 'Please choose a hotel first.');
      res.redirect('/findaroom');
    }

    else {
      // console.log(hotelFORM, from_dateFORM, to_dateFORM, roomTypeFORM, breakfastFORM, champagneFORM, rentcarFORM, TOTALFORM);
      if (breakfastFORM.valueOf() == "true") { var needBreakfast = "breakfast" } else { var needBreakfast = "" };
      if (champagneFORM.valueOf() == "true") { var needChampagne = "champagne" } else { var needChampagne = "" };
      if (rentcarFORM.valueOf() == "true") { var needCar = "car" } else { var needCar = "" };

      db2.collection(hotelFORM).insertOne({ customer: hotelUserName, customerEmail: hotelUserEmail, customerPhone: hotelUserPhone, hotel: hotelFORM, fromDate: from_dateFORM, toDate: to_dateFORM, roomType: roomTypeFORM, extras: { breakfast: needBreakfast, champagne: needChampagne, car: needCar }, total: TOTALFORM, date: new Date() })

      req.flash('success_msg', '\nDear guest, \n \nThank you ' + hotelUserName + ' for booking with us! Check your email for a confirmation! Kind regards, QualityHotel');
      res.redirect('/successfullbooking')

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mihaisolent@gmail.com',
          pass: 'mihaisolentmihaisolent'
        }
      });

      var emailMsg = " Email for " + hotelUserEmail + "\n \n \nThis is a confirmation email.\nThank you for booking with QualityHotel " + (hotelFORM.toUpperCase()) + "! \n \nJust to confirm, your stay will be from " + from_dateFORM + " until " + to_dateFORM + " in our " + roomTypeFORM + " room.\nMore details will be provided at the reception and we apologize we only take payments on arrival.\n \nWishing you a pleasant stay and let us know if you require anything else!\n \n \nKind regards,\nQualityHotel Reception\n" + hotelFORM.toUpperCase();


      var mailOptions = {
        from: 'mihaisolent@gmail.com',
        to: hotelUserEmail,
        subject: 'QualityHotel - Booking Confirmation ' + (new Date().toISOString().slice(0, 10)),
        text: emailMsg
      };

      transporter.sendMail(mailOptions, function (error, info) {
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
router.get('/', (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
    user = req.user;
    const todaysDate = new Date().toISOString().slice(0, 10);
    if (err) { console.log(err) } else {
      collections = ["Manchester", "London", "Birmingham", "Gloucester"]; // can be changed to dynamically get them from DB and do the stuff but i am at the limit of my bandwidth .... for a free account... just trying to limit the traffic a bit :) 
      var firstCommingBooking = [];
      // if (user) {
      // for (i=0; i < collections.length;i++) {
      //   console.log("checking",collections[i] )
      //   db2.collection(collections[i]).find({ "customer": user.name, fromDate:{$gte:todaysDate} } ).sort({ fromDate: 1 }).limit(1).toArray(function(err, rez) {
      //     if (err) {console.log(err)} else {
      //       console.log(rez[0])
      //       firstCommingBooking.push(rez[0]);  
      //       }
      //     // firstCommingBooking.sort()
      //     console.log("lookin up var",firstCommingBooking.sort())
      //   })
        
      //   // start building the then ?

      //   }}
      
      if (user) {
        
        db2.collection("London").find({ "customer": user.name, "fromDate": { $gte: todaysDate } }).sort({ fromDate: 1 }).limit(1).toArray(function (err, result) {
          if (err) { console.log(err) } else {
            // console.log(result)
            if (result.length > 0) {
              res.render('index', {
                user: req.user,
                welcomeMsg: { "hotel": result[0]["hotel"], "fromDate": result[0]["fromDate"], "toDate": result[0]["toDate"], "roomType": result[0]["roomType"], "total": result[0]["total"] }
              })
            } else {
              res.render('index', {
                user: req.user,
                welcomeMsg: { "hotel": "0" } // saying that i dont have a booking later on when checking
              })
            }
          }
        })
      } else {
        res.render('index', {
          user: req.user
        })
      }
    }
  }))
// // Index - backup
// router.get('/', (req, res) => //, ensureAuthenticated

//   mongoose.createConnection(db2, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db2) => {
//     if (err) { console.log(err) } else {

//       collections = [ "Gloucester", "London", "Birmingham", "Manchester" ]; // can be changed to dynamically get them from DB and do the stuff but i am at the limit of my bandwidth .... for a free account... just trying to limit the traffic a bit :) 
//       var firstCommingBooking=[];

//       for (i=0; i < collections.length;i++) {
//         db2.collection(collections[i]).find({ customer: "MIHAI C" }).sort({ fromDate: 1 }).limit(1).toArray(function(err, rez) {
//           if (err) {console.log(err)} else {
//             // console.log(rez[0])
//             firstCommingBooking = rez;  
//           }
//         })
//         // start building the then ?

//         }

//         console.log(typeof firstCommingBooking)
//         console.log(firstCommingBooking)

//       db2.collection("London").find({ customer: "MIHAI C" }).sort({ fromDate: 1 }).limit(1).toArray(function (err, result) {
//         if (err) { console.log(err) } else {

//           res.render('index', {
//             user: req.user
//             ,
//             welcomeMsg: { "hotel": result[0]["hotel"], "fromDate": result[0]["fromDate"], "toDate": result[0]["toDate"], "roomType": result[0]["roomType"], "total": result[0]["total"] }
//           })
//         }
//       })
//     }
//   }))

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
