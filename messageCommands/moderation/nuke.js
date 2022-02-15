const { Message, Client, MessageEmbed} = require("discord.js");

module.exports = {
    name: "nuke",
    aliases : ['nuke-channel'],
    description: "Deletes the channel to create a new blanked one with the same config",
    userPermissions: ["MANAGE_CHANNELS",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
    */
    run: async (client, message, args) => {
        message.channel.clone().then( ch => {
            ch.setParent(message.channel.parentId);
            ch.setPosition(message.channel.position);
            message.channel.delete();
            ch.send("This channel has been nuked")
        })
    },
};