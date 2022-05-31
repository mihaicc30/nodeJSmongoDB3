const mongoose = require('mongoose');


const RatesSchema = new mongoose.Schema({
  hotel: String,
  rate: {
  type: String,
  required: true}
});

const Rates = mongoose.model('Rates', RatesSchema);

module.exports = Rates;
