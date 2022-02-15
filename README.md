<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/bRCvFy9"><img src="https://img.shields.io/discord/222078108977594368?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord.js/"><img src="https://nodei.co/npm/discord.js.png?downloads=true&stars=true" alt="npm installnfo" /></a>
  </p>
</div>

# C Bot
C bot is a multipurpose bot including music stuff but heavily focused on utility and fun commands.

> **NOTE**: This bot is still under development. Currently running Discord v13

## Installation
Download the repository, delete package-lock.json, add .env and you are good to go.
Now install all the dependencies.

NPM:
```sh
npm install
```

Yarn:
```sh
yarn add
```

### Configuration
All your `API_KEYS`, `URLs` and other confidential info should be on a file named `.env`
You can either use your .env the name of the variables found on the repository or change the variables of the repository to suit yours.

If you want to use your own bot go to [Twitch developers site](https://discord.com/developers/applications).
Create an application, on General Information  grab the `CLIENT ID`, CLIENT ID is the identity of the application.
On Bot, create a bot and grab `TOKEN`, TOKEN is the password of the bot, this should be highly secret.
Also on bot, yo should activate `PUBLIC BOT`, `PRESENCE INTENT`, `SERVER MEMBERS INTENT`.
Activate `MESSAGE CONTENT INTENT` only if your bot will reach more than 100 servers.
On OAuth2, go to URL Generator, tick `bot`, `applications.commands`, `Administrator`. This will generate an URL that you can use to invite the bot to a server.

## Usage
To start using the bot, you either need to type npm start or npm run dev for auto-reload on changes.
 `client_id` and `client_secret` which you get from creating an application on the [Twitch developers site](https://dev.twitch.tv/console). 

Using native NodeJS:
```js
const TwitchApi = require("node-twitch").default;

const twitch = new TwitchApi({
	client_id: "YOUR_CLIENT_ID",
	client_secret: "YOUR_CLIENT_SECRET"
});
```
## Documentation


### Examples

## Problems or issues?
If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](url). 

## Get in touch
If you have any questions or just want to reach me, you can get in touch with me on Twitter([@](url))