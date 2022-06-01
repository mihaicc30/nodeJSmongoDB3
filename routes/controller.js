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
var emailuser = process.env.emailuser;
var emailpass = process.env.emailpass;

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
  })
})


module.exports = router;
