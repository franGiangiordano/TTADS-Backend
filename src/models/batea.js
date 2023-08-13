const mongoose = require('mongoose');

const BateaSchema = new mongoose.Schema(
  {
   patent: {
     type: String, required: true 
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Batea', BateaSchema);