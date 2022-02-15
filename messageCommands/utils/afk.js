const { Message, Client, } = require("discord.js");
const { afk } = require('../../collections/index')

module.exports = {
    name: "afk",
    aliases: ["afk"],
    description: "Similar to DND, makes you unpingeable and show for how much time you are AFK",
    usage: '[reason] \nExample 1: command \nExample 2: command reason',
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const reason = args.join(" ") || "No reason provided";
        afk.set(message.author.id, [Date.now(), reason]);
        message.reply(`You are now afk \`${reason}\``)
    },
};
