const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Result = new Schema({
  username: { type: String },
  formula: { type: String },
  result: { type: Number }
  },
  {
    collection: 'results',
    // allow dynamic change of the model
    strict: false
  }
)

module.exports = mongoose.model('Result', Result)
