var mongoose = require('mongoose');

var AliasSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  encryption_privatekey: { type: String },
  encryption_publickey: { type: String },
  publicvalue: { type: String },
  txid: { type: String },
  time: { type: Number },
  height: { type: Number },
  address: { type: String },
  accepttransferflags: { type: Number },
  expires_on: { type: Number },
  expired: { type: Boolean },
  lastUpdateUTC: { type: String },
  expirationUTC: { type: String }
});

Alias = mongoose.model('aliases', AliasSchema);

module.exports = Alias;
