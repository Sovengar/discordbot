const { Message, Client, MessageEmbed} = require("discord.js");
const { antijoin } = require('../../collections/index')

module.exports = {
    name : 'antijoin',
    aliases : ['antijoin'],
    description: "Disables the ability to join the server, usually when a raid is occurring.",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    usage: "<on/off/list/status>",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["on", "off", "list", "status"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on`, `off`, `status` or `list`!")
            ]})

        const getCollection = antijoin.get(message.guild.id);

        if(args[0]?.toLowerCase() === "on"){
            if(getCollection) return message.reply("Antijoin feature is already enabled!");

            antijoin.set(message.guild.id, []); 
            message.reply("Turned on antijoin system!");   
        }

        else if(args[0]?.toLowerCase() === "off"){
            if(!getCollection) return message.reply("Antijoin feature is already disabled!");

            antijoin.delete(message.guild.id);
            message.reply("Turned off antijoin feature!");
        }

        else if(args[0]?.toLowerCase() === "list"){
            if(!getCollection) return message.reply("Antijoin feature is disabled!");

            message.reply(`Kicked members: ${getCollection.map( value => { return `${value.tag} (${value.id})`})}`);
        }

        else if(args[0]?.toLowerCase() === "status"){
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .addField("👩‍👩‍👧‍👦 __Anti join/Raid__", `\`${antijoin.get(message.guild.id) ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                ]})
        }
    },
};