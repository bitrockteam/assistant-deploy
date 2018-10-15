# assistant-deploy
Deploy a Travis CI project using a Google Assistant command.

## Setup
Clone project
```bash
$ git clone https://github.com/bitrockteam/assistant-deploy
```

Install Node.js dependencies
```bash
$ yarn
--- or ---
$ npm install
```

Add a `.env` (*you can start from `.env.template`*) file with:
* a Travis CI token
* a GitHub user or org name

## How it works
This project contains two main parts:
* **the real Google Assistant action** defined in `index.js`, it needs to deployed on webserver that runs Node.js like Heroku or Now.
* a **dummy build project** defined in `demo.js`, it should be buit by Travis CI, the output can be deployed on any webserver.

## Integrate with Google Assistant
Just deploy the project to a Node.js server and set Dialogflow to forward the POST requests to the **/hook** endpoint.

## License
Released by [Bitrock](https://github.com/bitrockteam) under the [MIT license](LICENSE).