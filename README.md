# Sysplorer

This project will be on hiatus starting from August 2018 for a number of months. Anyone is very welcome to fork and improve it. There is a list of potential improvements below.

Sysplorer is a web app designed to utilise the Syscoin blockchain in order to allow users to explore certain Syscoin blockchain data in the app. It focuses mainly on offers, governance, aliases and assets rather than being a block explorer. This software uses the MEAN framework (MongoDB, Express.js, Angular.js and Node.js).

This is a quick prototype made with the aim of learning how to use the Syscoin API and what can be done with it.

For others looking to learn there are a number of resources that aided in the development of this prototype:
* https://www.justinsilver.com/technology/cryptocurrency/syscoin-node-js-blockchain-apps/
* https://www.justinsilver.com/technology/cryptocurrency/syscoin-zmq-node-js-realtime-blockchain/
* https://syscoin.readme.io/v3.0.6/reference

There are a number of improvements that could currently be made:
* Adding complete error handling, and reporting possibly as an Angular service.
* Changing the page title with view changes for better navigation history.
* Adding the ability to see transactions made to/from aliases.
* Adding proper item filtering based on text contained within titles/descriptions of offers.
* Adding a block explorer.
* Adding an asset block explorer, which can be filtered by asset.
* Sending transactions to the blockchain could potentially be added after the release of Pangolin; the Syscoin equivalent of Ethereum's MetaMask.

### WARNING
As noted above, proper item filtering has not been implemented so there may be items shown which are NSFW.

## Installation Instructions

Required software:
* MongoDB - Version 3.4 has been tested and works with this app. The latest release v4.0 has not been tested.
* Node.js - v9.4.0 has been tested and works with this app.
* npm - v6.2.0 has been tested and works with this app.

### Installation Steps

1. Download the relevant version of the Syscoin QT wallet for your OS. Open it and let it synchronise the blockchain, close it after this has been done.

2. Add the following information (as written on Justin Silver's website above) to the syscoin.conf file.

```
# server
server=1
daemon=1

# indexes
addressindex=1
txindex=1
litemode=0

# rpc
rpcuser=sysplorer
rpcpassword=exploringsyscoinsince1845
rpcport=8370
rpcallowip=127.0.0.1

# zmq listener config
zmqpubaliasrecord=tcp://127.0.0.1:3030
zmqpubaliashistory=tcp://127.0.0.1:3030
zmqpubaliastxhistory=tcp://127.0.0.1:3030
zmqpubassetrecord=tcp://127.0.0.1:3030
zmqpubassetallocation=tcp://127.0.0.1:3030
zmqpubassethistory=tcp://127.0.0.1:3030
zmqpubcertrecord=tcp://127.0.0.1:3030
zmqpubcerthistory=tcp://127.0.0.1:3030
zmqpubescrowrecord=tcp://127.0.0.1:3030
zmqpubescrowbid=tcp://127.0.0.1:3030
zmqpubescrowfeedback=tcp://127.0.0.1:3030
zmqpubofferrecord=tcp://127.0.0.1:3030
zmqpubofferhistory=tcp://127.0.0.1:3030
zmqpubhashblock=tcp://127.0.0.1:3030
zmqpubhashtx=tcp://127.0.0.1:3030
zmqpubhashtxlock=tcp://127.0.0.1:3030
zmqpubrawblock=tcp://127.0.0.1:3030
zmqpubrawtx=tcp://127.0.0.1:3030
zmqpubrawtxlock=tcp://127.0.0.1:3030
```

4. Download the Sysplorer project from github.

5. Navigate to the top-level of the project directory in a terminal and use this command to install all the project dependencies.
```
npm install
```

6. Navigate to the methods.js file in the "node_modules/@syscoin/syscoin-core/dist/src" folder and add the following line about halfway down the file along with the other methods (once the official syscoin-core v3.0 is released as an npm package Sysplorer's package.json can be updated to link to that version instead, then the below line will not need to be added manually):
```
getBlockHash: { version: '>=2.2.0' },
```

7. In a terminal enter the command:
```
npm install -g @angular/cli
```

8. Navigate to the top-level of the project directory in a terminal and enter the following command:
```
ng build
```

9. Start up both MongoDB and Syscoin QT (or syscoind).

10. In the top-level of the project directory type the next command in a terminal to start the server:
```
node server.js
```

11. This URL can then be used to interact with the server:
  http://localhost:8080
