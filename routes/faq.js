const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-faqform').mongoURI;
var nodemailer = require('nodemailer');

router.get('/faq', (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("FAQ").find().sort({ likes: -1 }).toArray(function (err, result) {
        // console.log(result)
        faq_data = {}
        if (err) { console.log(err) } else {
          res.render('faq', {
            user: req.user,
            faq_data: result
          })
        }
      })
    }
  }))

router.post('/adminpostfaqmsg', (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { thequestion, theresponse, theoneresponding } = req.body;

    if (err) {
      console.log(err)
    } else {
      db.collection("FAQ").updateOne({ "question": thequestion }, { $set: { "response": String(theresponse + " replied by:" + theoneresponding) } });

      db.collection("FAQ").find({ "question": thequestion }).toArray(function (err, result) {
        if (err) { console.log(err) } else {

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mihaisolent@gmail.com',
              pass: 'mihaisolentmihaisolent'
            }
          });
          var emailMsg = " Email for " + result[0]["questionFrom"] + "\nDear guest,\n \n This is a email to notify you that your question has been answered! \n \nKind Regards\nReceptionTeam";
          var mailOptions = {
            from: 'mihaisolent@gmail.com',
            to: result[0]["questionFrom"],
            subject: 'QualityHotel - FAQ Message Answered ' + (new Date().toISOString().slice(0, 10)),
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
      res.redirect('/faq');
    }
  })
)

router.post('/admindeletefaqmsg', ensureAuthenticated, (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    console.log(req.body);
    var { thequestion } = req.body;
    if (err) {
      console.log(err)
    } else {
      db.collection("FAQ").deleteOne({ "question": thequestion });
      res.redirect('/faq');
    }
  }))


router.post('/postfaqmsg', ensureAuthenticated, (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { questionnn, userEmail } = req.body;
    if (err) {
      console.log(err)
    } else {
      db.collection("FAQ").insertOne({ question: questionnn, "likes": String("0"), "response": String("Not yet replied."), date: new Date().toISOString().slice(0, 10), questionFrom: String(userEmail) });
      res.redirect('/faq');
    }
  }))

router.post('/sendlike', (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { questionn, likee } = req.body;
    likee++;
    if (err) {
      console.log(err)
    } else {
      db.collection("FAQ").updateOne({ question: questionn }, { $set: { likes: String(likee) } });
      res.redirect('/faq');
    }
  }))


module.exports = router;
