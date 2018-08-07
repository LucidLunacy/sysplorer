/* A module that uses ZeroMQ to subscribe to specific Syscoin events. When an
event occurs the information in the message is used to find and update specific
documents in the MongoDB.
*/

const zeromq = require('zeromq');
const db = require('./db.js');
const SyscoinClient = require('@syscoin/syscoin-core');

var syscoin = new SyscoinClient();

const subscriber = zeromq.socket('sub');
subscriber.on('message', async (topic, message) => {
  topic = topic.toString('utf8');
  message = message.toString('utf8');
  var messageJSON = JSON.parse(message);

  switch (topic) {
    case 'aliashistory':
      var interval = setInterval( async(_) => {
        console.log("Retrieving new alias information...");
        var alias = await syscoin.aliasInfo(messageJSON.alias);
        if (alias !== undefined) {
          db.upsertAlias(alias);
          clearInterval(interval);
        }
      }, 5000);
      break;
    case 'assethistory':
      var interval = setInterval( async(_) => {
        console.log("Retrieving new asset information...");
        var asset = await syscoin.assetInfo(messageJSON._id, false);
        if (asset !== undefined) {
          db.upsertAsset(asset);
          clearInterval(interval);
        }
      }, 5000);
      break;
    case 'offerhistory':
      var interval = setInterval( async(_) => {
        console.log("Retrieving new offer information...");
        var offer = await syscoin.offerInfo(messageJSON.offer);
        if (offer !== undefined) {
          db.upsertOffer(offer);
          clearInterval(interval);
        }
      }, 5000);
      break;
    default:
      console.log("Unknown zmq topic received");
  }
});

// connect to message producer
subscriber.connect('tcp://127.0.0.1:3030');

// subscribe to topics
subscriber.subscribe('assethistory');
subscriber.subscribe('offerhistory');
subscriber.subscribe('aliashistory');
console.log('subscribed to syscoin topics aliashistory, '
                      + 'assethistory and offerhistory');

exports.setSyscoin = function(sys) {
  syscoin = sys;
}
