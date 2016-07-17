// This Model is responsible for connecting to our Mongo DB via Mongoose
var mongoose= require("mongoose");

var config = require('../bin/config');

//Connect to mongo DB
host = 'localhost';
var port = 27017;
var dbName = config.database;
mongoose.connect('mongodb://'+host+':'+port+'/'+dbName);
var myDB = mongoose.connection;
//Error handling if conncetion fails
myDB.on('error', console.error.bind(console, 'connection error:'));
//Check if successful connection is made
myDB.once('open', function callback () {
  console.log("node-api-server DB Connected with Mongoose");
});

module.exports = {
   myDB: myDB
};