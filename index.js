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

app.intent('lancia_deploy', (conv, {repo}) => {
  const repoStr = repo.replace(/\s+/g, '-').toLowerCase() || '';
  let slug = '';
  
  const getOptions = {
    uri: 'https://api.travis-ci.org/owner/mbertozzo/repos',
    headers: {
      'Travis-API-Version': '3',
      'Authorization': 'token ' + process.env.TRAVIS
    },
    json: true
  };

  let postOptions = {
    method: 'POST',
    url: '',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Travis-API-Version': '3',
      'Authorization': 'token ' + process.env.TRAVIS
    },
    body: JSON.stringify({
      "request": {
        "message": "Request sent from GA",
        "branch": "master"
      }
    })
  };

  return request(getOptions)
  .then((r) => r.repositories)
  .then((r) => {
    const match = r.find(data => data.name === repoStr);
    return slug = match.slug;
  })
  .then((r) => conv.ask('Inizio il processo di deploy per ' + slug))
  .then((r) => {
    const postSlug = slug.replace('/','%2F');
    postOptions.url = `https://api.travis-ci.org/repo/${postSlug}/requests`;

    //return conv.ask('Il link POST è ' + postOptions.url);
  })
  .then((r) => {
    return request(postOptions)
      .then(() => {return conv.close('Travis è stato notificato con successo. Le operazioni inizieranno a momenti!')});
  });



}); //app.intent


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