/* A module to allow connection to the MongoDB, and to provide functions for
adding various Syscoin-related documents to the MongoDB.
*/

var exports = module.exports = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// import mongoose models
var Alias = require('../models/alias.js');
var Asset = require('../models/asset.js');
var Category = require('../models/category.js');
var Offer = require('../models/offer.js');
var Proposal = require('../models/proposal.js');
var Trigger = require('../models/trigger.js');

exports.connect = function() {
  mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
}

// a function to add/update the given alias in the 'aliases' collection
exports.upsertAlias = function(alias) {
  Alias.findOneAndUpdate( {id: alias._id}, {
    id: alias._id,
    encryption_privatekey: alias.encryption_privatekey,
    encryption_publickey: alias.encryption_publickey,
    publicvalue: alias.publicvalue,
    txid: alias.txid,
    time: alias.time,
    height: alias.height,
    address: alias.address,
    accepttransferflags: alias.accepttransferflags,
    expires_on: alias.expires_on,
    expired: alias.expired,
    lastUpdateUTC: new Date(alias.time * 1000).toUTCString(),
    expirationUTC: new Date(alias.expires_on * 1000).toUTCString()
  }, {upsert: true, new: true}, function(err, alias) {
    if (err) {
      console.log(err);
    } else {
      console.log("");
      console.log("************ New/updated alias info added to DB ************")
      console.log(alias);
      console.log("");
    }
  });
}

// a function to add/update the given asset in the 'assets' collection
exports.upsertAsset = function(asset) {
  Asset.findOneAndUpdate( {id: asset._id}, {
    id: asset._id,
    symbol: asset.symbol,
    txid: asset.txid,
    height: asset.height,
    time: asset.time,
    publicvalue: asset.publicvalue,
    alias: asset.alias,
    total_supply: asset.total_supply,
    max_supply: asset.max_supply,
    interest_rate: asset.interest_rate,
    precision: asset.precision
  }, {upsert: true, new: true}, function(err, asset) {
    if (err) {
      console.log(err);
    } else {
      console.log("");
      console.log("************ New/updated asset info added to DB ************")
      console.log(asset);
      console.log("");
    }
  });
}

// a function to add/update the given offer in the 'offers' collection
exports.upsertOffer = function(offer) {
  try {
    var descJSON = JSON.parse(offer.description);
    // dum dee dum
    if (descJSON.description.toLowerCase().indexOf('sex') > -1
        || descJSON.description.toLowerCase().indexOf('nude') > -1) {
      return;
    }
    offer.description = { description: descJSON.description,
                          images: descJSON.images };

    var cats = offer.category.split(">");
    var cleanCats = [];

    for (var i = 0; i < cats.length; i++) {
      var cleanCat = cats[i].trim().toLowerCase();
      cleanCats.push(cats[i].trim().toLowerCase());

      // nothing to see here >.>
      if (cleanCat == 'medicinal') {
        return;
      }
    }

    upsertCategories(cleanCats);

    Offer.findOneAndUpdate( {id: offer._id}, {
      id: offer._id,
      cert: offer.cert,
      txid: offer.txid,
      expires_on: offer.expires_on,
      expired: offer.expired,
      height: offer.height,
      category: cleanCats,
      title: offer.title,
      currency: offer.currency,
      price: offer.price,
      commission: offer.commission,
      offerlink_guid: offer.offerlink_guid,
      offerlink_seller: offer.offerlink_seller,
      paymentoptions: offer.paymentoptions,
      offer_units: offer.offer_units,
      quantity: offer.quantity,
      private: offer.private,
      description: offer.description,
      alias: offer.alias,
      address: offer.address,
      offertype: offer.offertype,
      auction_expires_on: offer.auction_expires_on,
      auction_reserve_price: offer.auction_reserve_price,
      auction_require_witness: offer.auction_require_witness,
      auction_deposit: offer.auction_deposit
    }, {upsert: true, new: true}, function(err, offer) {
      if (err) {
        console.log(err);
      } else {
        console.log("");
        console.log("************ New/updated offer info added to DB ************")
        console.log(offer);
        console.log("");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// a function to add/update the given proposal in the 'proposals' collection
exports.upsertProposal = function(prop) {
  Proposal.findOneAndUpdate( { hash: prop.hash}, {
    hash: prop.hash,
    name: prop.name,
    yesCount: prop.yesCount,
    noCount: prop.noCount,
    abstainCount: prop.abstainCount,
    absoluteYesCount: prop.absoluteYesCount,
    creationTime: prop.creationTime,
    expirationTime: prop.expirationTime,
    fCachedFunding: prop.fCachedFunding,
    fCachedDelete: prop.fCachedDelete,
    fCachedEndorsed: prop.fCachedEndorsed,
    url: prop.url,
    address: prop.address,
    amount: prop.amount,
    votePercent: prop.votePercent,
    creationUTC: new Date(prop.creationTime * 1000).toUTCString(),
    expirationUTC: new Date(prop.expirationTime * 1000).toUTCString()
  }, {upsert: true, new: true}, function(err, proposal) {
    if (err) {
      console.log(err);
    }
  });
}

// a function to add/update the given trigger in the 'triggers' collection
exports.upsertTrigger = function(trig, propHashes) {

  Proposal.find( { hash: { $in: propHashes } }, { _id: 1 }, (err, props) => {
    if (err) {
      console.log(err);
    } else {
      var propIds = [];
      for (var i = 0; i < props.length; i++) {
        propIds.push(props[i]._id);
      }

      Trigger.findOneAndUpdate( { hash: trig.hash }, {
        hash: trig.hash,
        fundedProposals: propIds,
        creationTime: trig.creationTime,
        blockHeight: trig.blockHeight
      }, {upsert: true, new: true}, function(err, trigger) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

// an interim function to remove all gobjects from the db
exports.removeGobjects = function() {
  Proposal.collection.drop();
  Trigger.collection.drop();
}

// a function to add/update the given categories in the 'categories' collection
// also formats the category strings to avoid url errors and to make them more
// readable
function upsertCategories(cats) {

  var parentCat = null;
  for (var i = cats.length - 1; i >= 0; i--) {
    if (i == 0) {
      parentCat = null;
    } else {
      parentCat = cats[i - 1];
    }

    if (cats[i].indexOf('&') > -1) {
      cats[i] = cats[i].replace(/\b&\b/g, ' & ');
    }

    // remove forward slashes from category name to avoid url errors
    if (cats[i].indexOf('/') > -1) {
      cats[i] = cats[i].replace(/\b\/\b/g, ' & ');
      cats[i] = cats[i].replace(/\//g, '&');
    }

    if (cats[i].indexOf('+') > -1) {
      cats[i] = cats[i].replace(/\b+\b/g, ' & ');
    }

    Category.findOneAndUpdate( {name: cats[i]}, {
      name: cats[i],
      parent: parentCat
    }, {upsert: true, new: true}, function(err, cat) {
      if (err) {
        console.log(err);
      }
    });
  }
}
