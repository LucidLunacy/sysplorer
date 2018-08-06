var mongoose = require('mongoose');

var OfferSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  cert: { type: String },
  txid: { type: String },
  expires_on: { type: Number },
  expired: { type: Boolean },
  height: { type: Number },
  category: [{ type: String }],
  title: { type: String },
  currency: { type: String },
  price: { type: Number },
  commission: { type: Number },
  offerlink_guid: { type: String },
  offerlink_seller: { type: String },
  paymentoptions: { type: String },
  offer_units: { type: Number },
  quantity: { type: Number },
  private: { type: Boolean },
  description: { type: { description: { type: String }, images: [{ type: String }] } },
  alias: { type: String },
  address: { type: String },
  offertype: { type: String },
  auction_expires_on: { type: Number },
  auction_reserve_price: { type: Number },
  auction_require_witness: { type: Boolean },
  auction_deposit: { type: Number }
});

Offer = mongoose.model('offers', OfferSchema);

module.exports = Offer;
