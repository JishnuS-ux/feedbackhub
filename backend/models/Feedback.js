const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  product: { 
    type: String, 
    required: true
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'Resolved']
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
