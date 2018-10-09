'use strict';

const dotenv = require('dotenv');
dotenv.config();

/**
 * Import the module to perform HTTP calls with
 * Promise support
 */
const request = require('request-promise-native'); 

/**
 * Import the Dialogflow module from the 
 * Actions on Google client library.
 */
const { dialogflow } = require('actions-on-google');

/**
 * Instantiate the Dialogflow client.
 */
const app = dialogflow({debug: true});

/**
 * Handle the Dialogflow intent named 'start_build'.
 * This intent is triggered when users give the command
 * to start the building process
 */
app.intent('start_build', (conv) => {
  var date = new Date();
  var currTime = date.getHours() + ':' + date.getMinutes();

  var options = {
    method: 'POST',
    url: 'https://api.travis-ci.org/repo/bitrockteam%2Fsignature/requests',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Travis-API-Version': '3',
      'Authorization': 'token ' + process.env.TRAVIS
    },
    body: JSON.stringify({
      "request": {
        "message": "Request sent from GA " + currTime,
        "branch": "master"
      }
    })
  };
  
  conv.ask('So let\'s begin. The building process for your project will start in seconds!');

  return request(options)
  .then(() => {return conv.close('All set! Travis has been correctly notified.')});
  
 });

/**
 * Server setup
 */
const express = require('express')
const bodyParser = require('body-parser')

const server = express();

server.use(bodyParser.json());

server.get('/', function(req,res){
  res.send('Webhook OK!')
})

server.post('/hook', app);

server.listen(3000, () => console.log('Server listening on port 3000.'))