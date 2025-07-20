const mongoose = require('mongoose');

const conactSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  imageUrl: {type: String},
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
});

module.exports = mongoose.model('Contact', conactSchema);
