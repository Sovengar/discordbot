const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Shows the avatar of the user",
    cooldown: 5,
    usage: "",
    permissions: "",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        const member = interaction.member;
        
        const embed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: '' })
            .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
        interaction.followUp({ embeds: [embed] });
    },
};