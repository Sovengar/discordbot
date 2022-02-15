const { Client } = require("discord.js")
const client = require('../client/discordBot')

module.exports = {name: "setActivity",};
/**
* @param {Client} client
*/
client.on("ready", () => {
    const arrayOfStatus = [
        `${client.guilds.cache.size} servers`,
        `${client.channels.cache.size} channels`,
        `${client.users.cache.size} users`,
        `${client.user.tag} discord bot!`,
        `Default prefix ${process.env.PREFIX}`,
    ];

    let index = 0;
    setInterval( () => {
        if(index === arrayOfStatus.length)
            index = 0;
        const status = arrayOfStatus[index]
        client.user.setActivity(status);
        index++;
    }, 5000); 
});