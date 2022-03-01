const mongoose = require('mongoose');

const LondonSchema = new mongoose.Schema({
  room: {
    type: Number,
    required: true
  },
  date_in: {
    type: Date,
    required: true
  },
  date_out: {
    type: Date,
    required: true
  },
  breakfast: {
    type: Boolean,
    required: true
  },
  pax: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  review: {
    type: Number,
    required: true
  }
});

const London = mongoose.model('101', LondonSchema);

module.exports = London;
