const { Message, Client, MessageEmbed,} = require("discord.js");

module.exports = {
    name : 'ban-list',
    aliases : ['ban-list'],
    description: "Shows a list with the users banned on this server.",
    userPermissions: ["BAN_MEMBERS",],
    botPermissions: ["BAN_MEMBERS",],
    cooldown: 5,
    usage: "",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const fetchBans = message.guild.bans.fetch();
        const bannedMembers = (await fetchBans).map( member => `\`${member.user.tag}\`` ).join("\t");

        message.reply({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setTitle("**Banned members**")
                .addField("\u200B", `${bannedMembers.length !== 0 ? bannedMembers : `No users banned yet!`}`)
                .setTimestamp()
        ]})
    },
};