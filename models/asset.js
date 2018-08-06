var mongoose = require('mongoose');

var AssetSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  symbol: { type: String },
  txid: { type: String },
  height: { type: Number },
  time: { type: Number },
  publicvalue: { type: String },
  alias: { type: String },
  total_supply: { type: Number },
  max_supply: { type: Number },
  interest_rate: { type: Number },
  precision: { type: Number }
});

Asset = mongoose.model('assets', AssetSchema);

module.exports = Asset;
