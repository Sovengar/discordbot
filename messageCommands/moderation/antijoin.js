const { Message, Client,} = require("discord.js");
const { antijoin } = require('../../collections/index')

module.exports = {
    name : 'antijoin',
    aliases : ['antijoin'],
    description: "Disables the ability to join the server, usually when a raid is occurring.",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    usage: "<on/off/list>",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const query = args[0]?.toLowerCase();
        if(!query) return message.reply("Please specify a query!");

        const getCollection = antijoin.get(message.guild.id);

        if(query === "on"){
            if(getCollection)
                return message.reply("Antijoin feature is already enabled!");
            antijoin.set(message.guild.id, []); 
            message.reply("Turned on antijoin system!");   
        }

        else if(query === "off"){
            if(!getCollection)
                return message.reply("Antijoin feature is already disabled!");
            antijoin.delete(message.guild.id);
            message.reply("Turned off antijoin feature!");
        }

        else if(query === "list"){
            if(!getCollection)
                return message.reply("Antijoin feature is disabled!");
            message.reply(`Kicked members: ${getCollection.map( value => {
                return `${value.tag} (${value.id})`
            })}`);
        }
        
        else return message.reply("Invalid query, check `help antijoin` for more info");
    },
};