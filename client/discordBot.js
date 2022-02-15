const { Client, Collection, } = require("discord.js");
const Ascii = require("ascii-table");
const logs = require('discord-logs')
const { Database } = require("quickmongo");
require('dotenv').config();

///CREATING THE CLIENT - BOT
const client = new Client({
    intents: 32767, //Import all intents
    allowedMentions: {
        parse: ['everyone', 'roles', 'users'],
        repliedUser: true, //False = Dont ping the user
    }
});

///MAKING THE BOT A MODULE SO CAN BE IMPORTED
module.exports = client;

//Giveaway specified in the DOCS
require("../Systems/GiveawaySys")(client);

//LOADING CUSTOM LOGS FROM DISCORD-LOGS
logs(client, { debug: true })

///GLOBAL VARIABLES
client.messageCommands = new Collection();
client.interactionCommands = new Collection();
client.noPrefixCommands = new Collection();
client.quickmongo = new Database(process.env.MONGODBURL)
client.config = { 
    bot_token: `${process.env.BOT_TOKEN}`,
    mongoDB_url: `${process.env.MONGODBURL}`,
    tenor_key: `${process.env.TENOR_KEY}`,
    owner_id: `${process.env.OWNER_ID}`,
    devGuild: `${process.env.DEVGUILD}`,
    errorLogsChannel: `${process.env.ERROR_LOGS_CHANNEL}`,
    logsChannel: `${process.env.LOGS_CHANNEL}`,
};

/// Getting the handlers to HANDLE the DB, errors, commands, slashcommands, contextMenu
['interactionCommand_handler', 'mongo_handler', 'error_handler', 
'event_handler', 'messageCommand_handler', 'noPrefixCommands'].forEach(handler => {
    require(`../handlers/${handler}`)(client, Ascii)
})

///CHECKING IF QUICKMONGO IS CONNECTED
client.quickmongo.on("ready", ()=> {
    console.log("Connected with quickmongo")
})

client.login(client.config.bot_token);