const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-faqform').mongoURI;
var nodemailer = require('nodemailer');


// // FAQ
// router.get('/faq', (req, res) =>   // , ensureAuthenticated  - leaving this on purpose without ensureAuthenticated
//   res.render('faq')
// );

router.get('/faq', (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("FAQ").find().limit(2).toArray(function (err, result) {
        // console.log(result)
        faq_data = {}
        if (err) { console.log(err) } else {
          res.render('faq', {
            user: req.user,
            faq_data : result 
          })
        }
      })
    }
  }))


// router.post('/faq', function (req, res) { // , ensureAuthenticated
//   mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
//     if (err) {
//       console.log(err);
//     } else {
//       db.collection("FAQ").find().limit(2).toArray(function (err, result) {
//         the_data = {}
//         console.log("thedata", the_data)
//         if (err) { console.log(err) } else {
//           if (result.length > 0) { the_data=result }
//           req.flash('the_data', the_data)
//           res.redirect('views/faq', { "the_data": the_data } );
//           console.log("the_data", the_data)
//         }
        
//       })
//     }
//   })
// });

module.exports = router;
