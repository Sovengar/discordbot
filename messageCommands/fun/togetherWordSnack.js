const { Message, Client, } = require("discord.js");
const discordTogether = require("../../client/discordTogether");

module.exports = {
    name: "wordsnack",
    aliases: ['together-wordsnack', 'wordsnack-together'],
    description: "Play Wordsnack in a voice channel together!",
    usage: "<channel> \nExample 1: command channel_id \nExample 2: command (from a voice channel)",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let channel;

        if(!args[0]){
            if(!message.member.voice.channel)
                return message.reply({ content: "Please choose or join a voice channel" });
            channel = message.member.voice.channel;
        } else {
            channel = message.guild.channels.cache.get(args[0]);
        }
        
        if(channel.type !== 'GUILD_VOICE') 
            return message.reply({ content: "Please choose a voice channel" });

        discordTogether.createTogetherCode(channel.id, "wordsnack")
            .then( (invite) => message.reply(invite.code) );
    },
};