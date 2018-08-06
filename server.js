const express = require('express');
const SyscoinClient = require('@syscoin/syscoin-core');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const bs = require('./ss-modules/blockScraper.js');
const bw = require('./ss-modules/blockWatcher.js');
const db = require('./ss-modules/db.js');

const app = express();
db.connect();

const syscoin = new SyscoinClient({
  host: process.env.SYSCOIND_HOST || 'localhost',
  port: process.env.SYSCOIND_PORT || 8370,
  username: process.env.SYSCOIND_USER || 'sysplorer',
  password: process.env.SYSCOIND_PASS || 'exploringsyscoinsince1845',
  timeout: 30000,
});

api.setSyscoin(syscoin);
bs.setSyscoin(syscoin);
bw.setSyscoin(syscoin);

bs.scrapeBlocks();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/bootstrap/dist/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/dist/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery/dist', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

// catch all other paths
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080);
console.log("App listening on port 8080");
process.on('warning', e => console.warn(e.stack));

module.exports = app;
