const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const db = require('../config/key-qualityhotel').mongoURI;
var nodemailer = require('nodemailer');
const { Int32 } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

router.get('/controller', (req, res) => //  , ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("rates").find().sort({ "hotel": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('controller', {
            user: req.user,
            rates_data: result
          })
        }
      })
    }
  }))



router.post('/controller', (req, res) => //  , ensureAuthenticated


  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { idd, hotel, rate } = req.body;
    if (err) { console.log(err) } else {
      db.collection("rates").updateOne({ _id: new ObjectId(idd) }, { $set: { "hotel": hotel, "rate": rate } });

      db.collection("rates").find().sort({ "hotel": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('controller', {
            user: req.user,
            rates_data: result
          })
        }
      })
    }
  }))

module.exports = router;
