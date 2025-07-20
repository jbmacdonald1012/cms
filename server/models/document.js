const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  id:{ type: String, required: true, unique: true },
  name: { type: String, required: true },
  description:{ type: String },
  url: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Document', documentSchema);
