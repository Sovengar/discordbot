const { Message, Client, MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ['avatar'],
    description: "Shows the avatar of the user",
    usage: "",
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
        const user = message.author || message.mentions.users.first(); //client.users.cache.get(User.id);
        const member = message.guild.members.cache.get(user.id);

        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }), url: '' })
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embeds: [embed] });
    },
};