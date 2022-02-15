const { Client, ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "getavatar",
    type: "USER",
    cooldown: 5,
    permissions: "",
    usage: "Right click the avatar of any user, choose Apps, choose the app",
    /**
     *
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const user = await client.users.fetch(interaction.targetId);

        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }), url: '' })
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
        interaction.followUp({ embeds: [embed] });
    },
};