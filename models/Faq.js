const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  questionFrom: {
    type: String,
    required: true,
  },
  date: String
});

const Faq = mongoose.model('Faq', FaqSchema);
  
module.exports = Faq;
