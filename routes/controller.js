const mongoose = require('mongoose');
const Rates = require('../models/Rates');
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectID;
const dotenv = require('dotenv');
dotenv.config();
var db = process.env.mongoURI;

router.get('/controller', ensureAuthenticated, (req, res) => {//  , ensureAuthenticated
  var queryz = Rates.find();
  queryz.exec(function (err, results) {
    if (err) return handleError(err);
    res.render('controller', {
      user: req.user,
      rates_data: results
    })
  })
})


router.post('/controller', (req, res) => {//  , ensureAuthenticated
  var { idd, hotel, rate } = req.body;


  var queryz = Rates.updateOne({ _id: idd }, { $set: { "hotel": hotel, "rate": rate } });
  queryz.exec(function (err, result) {
    if (err) return handleError(err);

    var queryz2 = Rates.find();
    queryz2.exec(function (err, result2) {
      if (err) return handleError(err);
      res.render('controller', {
        user: req.user,
        rates_data: result2
    })
  })
}) })

//       db.collection("rates").find().sort({ "hotel": 1 }).toArray(function (err, result) {
//         if (err) { console.log(err) } else {
//           res.render('controller', {
//             user: req.user,
//             rates_data: result
//           })}
//       })}
// })

module.exports = router;
