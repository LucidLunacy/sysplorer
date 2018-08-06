var exports = module.exports = {};

const express = require('express');
const router = express.Router();
const SyscoinClient = require('@syscoin/syscoin-core');
const mongoose = require('mongoose');

var syscoin = new SyscoinClient();

function setSyscoin(sys) {
  syscoin = sys;
}

router.get('/', function(req, res) {
  res.send('api is online');
});

// get proposals and return the results in the response based on the results
// per page and page number
router.get('/proposals/:resPerPage/:pageNum', async function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Proposal.aggregate(
    [
      { $facet: {
        results: [{ $skip: skipNum }, { $limit: resPerPage }],
        count: [{ $count: 'count' }]
        }
      }
    ], function(err, proposals) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(proposals);
      }
    }
  );
});

// get triggers and return the results in the response based on the results
// per page and page number
router.get('/triggers/:resPerPage/:pageNum', function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Trigger.aggregate(
    [
      { $facet: {
        results: [{ $skip: skipNum }, { $limit: resPerPage }],
        count: [{ $count: 'count' }]
        }
      }
    ], function(err, triggers) {
      if (err) {
        console.log(err);
      } else {
        Trigger.populate(triggers, { path: 'results.fundedProposals', model: Proposal },
          function(err, triggers) {
            res.status(200).json(triggers);
          });
      }
    }
  );
});

// get average block time calculated over the previous 1995 blocks
router.get('/averageblocktime', async function(req, res) {
  const blockCount = await syscoin.getBlockCount();
  const latestBlockHash = await syscoin.getBlockHash(blockCount - 1995);
  const blockHeaders = await syscoin.getBlockHeaders(latestBlockHash, 2000, true);

  var average = 0;

  for (var i = 1; i < blockHeaders.length - 1; i++) {
    average += (blockHeaders[i + 1].time - blockHeaders[i].time);
  }

  average /= blockHeaders.length;

  res.status(200).json(average);
});

// get the governance information
router.get('/govinfo', async function(req, res) {
  const gInfo = await syscoin.getGovernanceInfo();

  res.status(200).json(gInfo);
});

// get the block hash of the block, defined by the block number
router.get('/blockhash/:bnumber', async function(req, res) {
  const blockHash = await syscoin.getBlockHash(parseInt(req.params.bnumber));

  res.status(200).json(blockHash);
});

// get a specific block's information, defined by its block hash
router.get('/blockinfo/:bhash', async function(req, res) {
  const blockInfo = await syscoin.getBlock(req.params.bhash);

  res.status(200).json(blockInfo);
});

// get the block time of a block, defined by its block number
router.get('/blocktime/:bnumber', async function(req, res) {
  const blockHash = await syscoin.getBlockHash(parseInt(req.params.bnumber));
  const blockInfo = await syscoin.getBlock(blockHash);

  res.status(200).json(blockInfo.time);
});

// get the superblock budget of a specific block, defined by its block number
router.get('/superblockbudget/:bnumber', async function(req, res) {
  const sbBudget = await syscoin.getSuperBlockBudget(parseInt(req.params.bnumber));

  res.status(200).json(sbBudget);
});

// find aliases that begin with the given alias string, and return the results in
// the response based on the results per page and page number
router.get('/findaliases/:searchStr/:resPerPage/:pageNum', function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Alias.aggregate(
    [
      { $match: { id: { "$regex": "^" + req.params.searchStr,
                            "$options": "i" } } },
      { $sort: { id: 1 } },
      { $facet: {
        results: [{ $skip: skipNum }, { $limit: resPerPage }],
        count: [{ $count: 'count'}]
      } }
    ], function(err, aliases) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(aliases);
      }
    }
  );
});

// find the assets allocated to a specific alias, and return the results in
// the response based on the results per page and page number
router.get('/listassetallocations/:alias', async function(req, res) {
  var options = {
    receiver: req.params.alias
  }
  const assetAllocs = await syscoin.listAssetAllocations(0, 0, options);

  res.status(200).json(assetAllocs);
});


// find assets that begin with the given asset string, and return results in
// the response based on the results per page and page number
router.get('/findassets/:searchStr/:resPerPage/:pageNum', function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Asset.aggregate(
    [
      { $match: { symbol: { "$regex": "^" + req.params.searchStr,
                            "$options": "i" } } },
      { $sort: { symbol: 1 } },
      { $facet: {
        results: [{ $skip: skipNum }, { $limit: resPerPage }],
        count: [{ $count: 'count'}]
      } }
    ], function(err, assets) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(assets);
      }
    }
  );
});

// find offers with a title that contains the given search string, and return
// results in the response based on the results per page and page number
router.get('/findoffers/:searchStr/:resPerPage/:pageNum', function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Offer.aggregate(
    [
      { $match: { title: { "$regex": "\\b" + req.params.searchStr,
                            "$options": "i" } } },
      { $sort: { height: -1 } },
      { $facet: {
        results: [{ $skip: skipNum }, { $limit: resPerPage }],
        count: [{ $count: 'count'}]
      }}
    ], function(err, offers) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(offers);
      }
    }
  );
});

// find offers that are within the given category, and return results in the
// response based on the results per page and page number
router.get('/categorisedoffers/:category/:resPerPage/:pageNum', function(req, res) {

  var resPerPage = parseInt(req.params.resPerPage);

  var skipNum;
  if (req.params.pageNum == 1) {
    skipNum = 0;
  } else {
    skipNum = (req.params.pageNum - 1) * req.params.resPerPage;
  }

  Category.aggregate(
    [
      {
        $graphLookup: {
          from: "categories",
          startWith: "$parent",
          connectFromField: "parent",
          connectToField: "name",
          as: "catHierarchy"
        }
      },
      { $match: { $or: [ {"name": req.params.category},
                          {"catHierarchy.name": req.params.category},
                          {"catHierarchy.parent": req.params.category} ] } },
      { $project: { "name": 1 } }
    ], function(err, cats) {
      if (err) {
        console.log(err);
      } else {
        var catNames = [];
        cats.forEach(function(cat) {
          catNames.push(cat.name)
        });

        Offer.aggregate(
          [
            { $match: { category: { $in: catNames } } },
            { $sort: { height: -1 } },
            { $facet: {
              results: [{ $skip: skipNum }, { $limit: resPerPage }],
              count: [{ $count: 'count' }]
            }}
          ], function(err, offers) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json(offers);
            }
          }
        );
      }
    }
  )
});

// get all categories
router.get('/categories', function(req, res) {

  Category.aggregate(
    [
      {
        $project: { "name": 1, "parent": 1, "_id": 0 }
      }
    ], function(err, cats) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(cats);
      }
    }
  )
});

// any other routes should return the index.html file
router.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// sort in descending order so newer proposals are shown first
function compareProps(prop1, prop2) {
  return prop2.creationTime - prop1.creationTime;
}

module.exports = router;
module.exports.setSyscoin = setSyscoin;
