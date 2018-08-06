var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TriggerSchema = new mongoose.Schema({
  hash: { type: String, unique: true, index: true },
  fundedProposals: [{ type : ObjectId, ref: 'Proposal' }],
  creationTime: { type: Number },
  blockHeight: { type: Number },
});

Trigger = mongoose.model('triggers', TriggerSchema);

module.exports = Trigger;
