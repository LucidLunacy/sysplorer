/* A module to get specific information from the Syscoin client and use the
db.js module to populate the MongoDB with the information.
The functions to scrape aliases, assets and offers are run once on start-up.
The function to scrape proposals is run once every two minutes.
*/

const SyscoinClient = require('@syscoin/syscoin-core');
const mongoose = require('mongoose');
const db = require('./db.js');

var syscoin = new SyscoinClient();

exports.setSyscoin = function(sys) {
  syscoin = sys;
}

exports.scrapeBlocks = function() {
  scrapeAliases();
  scrapeAssets();
  scrapeOffers();
  scrapeProposalsAndTriggers();

  // get all proposals and triggers every two minutes
  setInterval(function() {
    db.removeGobjects();
    scrapeProposalsAndTriggers();
  }, 120000);
}

// function to get all aliases and add each to the database
async function scrapeAliases() {
  const aliases = await syscoin.listAliases(0, 0);

  aliases.forEach((alias, i) => {
    db.upsertAlias(alias);
  });
}

// function to get all assets and add them to the database
async function scrapeAssets() {
  const assets = await syscoin.listAssets(0, 0);

  assets.forEach((asset, i) => {
    db.upsertAsset(asset);
  });
}

// function to get all offers and add them to the database
async function scrapeOffers() {
  const offers = await syscoin.listOffers(0, 0);

  offers.forEach((offer, i) => {
    db.upsertOffer(offer);
  });
}

// function to get all proposals and triggers and add them to the database
async function scrapeProposalsAndTriggers() {

  // get the masternode list in order to count them for the calculation of
  // the proposal vote percentage
  const mnList = await syscoin.masternodeList();

  var mnKeyList = Object.keys(mnList);
  var mnCount = 0;

  // only include masternodes that are ENABLED
  for (var i = 0; i < mnKeyList.length; i++) {
    if (mnList[mnKeyList[i]].status == "ENABLED") {
      mnCount++;
    }
  }

  const gObjects = await syscoin.gObject("list");

  // iterate through the governance objects adding the created JSON objects to
  // the proposals array
  for (var gObject in gObjects) {
    // get the proposal information specified by the user
    var dsObject = JSON.parse(gObjects[gObject].DataString);
    var objectType = dsObject[0][0];
    var objDetails = dsObject[0][1];

    if (objectType == 'proposal') {
      var proposal = gObjects[gObject];

      // create a JSON object with the chosen information
      var propJSON =
        {
          hash: gObject,
          name: objDetails.name,
          yesCount: proposal.YesCount,
          noCount: proposal.NoCount,
          abstainCount: proposal.AbstainCount,
          absoluteYesCount: proposal.AbsoluteYesCount,
          creationTime: proposal.CreationTime,
          expirationTime: objDetails.end_epoch,
          fCachedFunding: proposal.fCachedFunding,
          fCachedDelete: proposal.fCachedDelete,
          fCachedEndorsed: proposal.fCachedEndorsed,
          url: objDetails.url,
          address: objDetails.payment_address,
          amount: objDetails.payment_amount,
          votePercent: (100 * ((proposal.YesCount - proposal.NoCount) / mnCount))
                        .toFixed(2),
        };

      db.upsertProposal(propJSON);
    } else if (objectType == 'trigger') {
      var trigger = gObjects[gObject];

      var fundedProps = [];
      var propHashes = objDetails.proposal_hashes.split("|");

      // create a JSON object with the chosen information
      var trigJSON =
        {
          hash: gObject,
          fundedProposals: [],
          creationTime: trigger.CreationTime,
          blockHeight: objDetails.event_block_height
        }

      db.upsertTrigger(trigJSON, propHashes);
    }
  }
}
