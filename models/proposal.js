var mongoose = require('mongoose');

var ProposalSchema = new mongoose.Schema({
  hash: { type: String, unique: true, index: true },
  name: { type: String },
  yesCount: { type: Number },
  noCount: { type: Number },
  abstainCount: { type: Number },
  absoluteYesCount: { type: Number },
  creationTime: { type: Number },
  expirationTime: { type: Number },
  fCachedFunding: { type: Boolean },
  fCachedDelete: { type: Boolean },
  fCachedEndorsed: { type: Boolean },
  url: { type: String },
  address: { type: String },
  amount: { type: Number },
  votePercent: { type: Number },
  creationUTC: { type: String },
  expirationUTC: { type: String }
});

Proposal = mongoose.model('proposals', ProposalSchema);

module.exports = Proposal;
