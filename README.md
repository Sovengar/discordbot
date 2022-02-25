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
C bot is a multipurpose bot including music stuff but heavily focused on utility, moderation and fun commands.

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

If you want to use your own bot go to [Discord developers site](https://discord.com/developers/applications).
Create an application, on General Information  grab the `CLIENT ID`, CLIENT ID is the identity of the application.
On Bot, create a bot and grab `TOKEN`, TOKEN is the password of the bot, this should be highly secret.
Also on bot, yo should activate `PUBLIC BOT`, `PRESENCE INTENT`, `SERVER MEMBERS INTENT`.
Activate `MESSAGE CONTENT INTENT` only if your bot will reach more than 100 servers.
On OAuth2, go to URL Generator, tick `bot`, `applications.commands`, `Administrator`. This will generate an URL that you can use to invite the bot to a server.

## Usage
To start using the bot, you either need to type npm start or npm run dev for auto-reload on changes.
 `client_id` and `client_secret` which you get from creating an application on the [Discord developers site](https://discord.com/developers/applications). 

Using native NodeJS:
```js
const TwitchApi = require("node-twitch").default;

const twitch = new TwitchApi({
	client_id: "YOUR_CLIENT_ID",
	client_secret: "YOUR_CLIENT_SECRET"
});
```
## Documentation

### Workflow
The program starts, node reads package.json to know which file has to execute, in this case index.js
index.js is our entry point, from here we require the bot created on [Discord developers site](https://discord.com/developers/applications)
Requiring the bot (./client/discordBot) starts creating the bot itself through the variable client, loads necessary dependencies and executes the handlers.
The handlers job in essence except from error and mongo handler is to get the data from the files to variables.
The error handler job is to get any critical error and avoid the stop of the process furthermore printing info.
The mongo handler job is to try to connect with the DB if has one.

Once the handlers are loaded succesfully, we continue to read discordBot.js and finally login the bot.

### Folders explained
#### Backups
Here we store the backup files of the servers if created from commands, that way we can create a new server and load the data from the backup.

#### Client 
Here we store the entities conforming the program, like the bot itself or the music player.

#### Collections
Here we store fast data that is not needed to be persisted

#### Events
Here is where the discord events are handled.
The most important ones are the messageCreate but focused when that message is a command, to handle different things like cooldown or permissions.
interactionCreate but focused when that interaction is a command (Command of Context Menu App), to handle different things like cooldown.

The command is finally executed on the last line with run() which is the property of the module of each command where the function is stored.

#### Functions
Functions to minimize code redundancy and focus on SOLID principles

#### Handlers
interaction, message, noprefix are the three types of commands; gets the data from the files to load them on variables
event gets the data from the files to execute an event (on or once)
Error handler job is to get any critical error and avoid the stop of the process furthermore printing info.
The mongo handler job is to try to connect with the DB if has one.

One of the jobs of the interaction command handler is to set the permissions, the perms for interactions are managed to set the graphic interface.
*It's worth mentioning that can be done to be managed when typing like messageCommands through events, but is better practice from graphic interface.
In addition, because is graphic interface has to be imported for every guild through guild.commands

#### Interaction Commands
Here are the interaction commands like slash commands and context menu apps.

#### MediaFiles
Here are some media files to avoid connecting to the internet to get the resource.

#### Message Commands
Here are the classic commands like !ping

#### Models
Here are stored the schemas and the models of the DB, ready to be imported.

#### node_modules
Dependancies from package.json, useful modules.

#### No Prefix Commands
Here are the commands that doesnt need prefix

#### Systems
Folder exclusively for giveaways command

### Examples

## Problems or issues?
If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](url). 

## Get in touch
If you have any questions or just want to reach me, you can get in touch with me on Twitter([@](url))